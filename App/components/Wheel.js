import React from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  Dimensions,
  Animated
} from 'react-native';
import Constants from 'expo-constants';
// import { GestureHandler, Svg } from 'expo';
import Svg, { Path, G, Text, TSpan } from "react-native-svg";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
// const { PanGestureHandler, State } = GestureHandler;
// const { Path, G, Text, TSpan } = Svg;
const { width } = Dimensions.get('screen');
const height = Dimensions.get('window').height;
const fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

// const wheelSize = width * 0.95;
const wheelSize = width * 1.5;
const knobSize = 80;
const fontSize = 11;
const oneTurn = 360;
const neutral = null;
let appPurple;

class Wheel extends React.Component {
  state = {};
  _wheelPaths;
  
  constructor(props) {
    super(props);

    // I don't think this section will ever be used because nothing can be untoggled on initial component load. this.props.selectedLocations can probably be passed in as wheelLabels
    let wheelLabels = [];
    for (let i = 0; i < this.props.selectedLocations.length; i++){
      if (this.props.venueToggles[i]){wheelLabels = wheelLabels.concat([this.props.selectedLocations[i]])} //this section might need cleaning or elimination later
    }
    let selectedLocationsCount = wheelLabels.length; 
    
    this.state = {
      enabled: true,
      finished: false,
      winner: null,
      winnerSet: false,
      numberOfSegments: selectedLocationsCount,
      angleBySegment: 360 / selectedLocationsCount,
      angleOffset: (360/selectedLocationsCount)/2,
      wheelLabels: wheelLabels,
      spinDirection: 1,
    };

    this._wheelPaths = this._makeWheel();
    appPurple = this.props.appPurple;
  }


  componentDidUpdate(prevProps) {

    if (prevProps.venueToggles !== this.props.venueToggles){
      let wheelLabels = [];
      for (let i = 0; i < this.props.selectedLocations.length; i++){
        if (this.props.venueToggles[i] == true){
          wheelLabels = wheelLabels.concat([this.props.selectedLocations[i]])
        }
      }

      this.setState({
        wheelLabels: wheelLabels,
        numberOfSegments: wheelLabels.length,
        angleBySegment: 360 / wheelLabels.length,
        angleOffset: (360/wheelLabels.length)/2,
      },
        () => {this._wheelPaths = this._makeWheel();}
      );
    }
  }

  _makeWheel = () => {

    const data = Array.from({ length: this.state.numberOfSegments }).fill(1);
    const arcs = d3Shape.pie()(data);

    let colors = [];
    let hueIterator = 0;
    const hueAlternation = ['blue', 'red', 'green', 'purple', 'orange', 'pink' ]

    while(colors.length <= this.state.numberOfSegments){
      colors = colors.concat(color({
        luminosity: 'dark',
        hue: hueAlternation[hueIterator],
      }))
      hueIterator++;
      if (hueIterator > 5){hueIterator = 0;}
    }

    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(0.01)
        .outerRadius(width / 2)
        .innerRadius(20);
  
      return {
        path: instance(arc),
        color: colors[index],
        value: this.state.wheelLabels[index], //Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
        centroid: instance.centroid(arc)
      };
      
    });
  };

  _angle = new Animated.Value(0);
  angle = 0;

  componentDidMount() {
    this._angle.addListener(event => {
      if (this.state.enabled) {
        this.setState({
          enabled: false,
          finished: false
        });
      }

      this.angle = event.value;
    });
  }

  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % oneTurn));

    if(this.angle < 0) {
      // wheel turning counterclockwise
      return (Math.floor((deg + this.state.angleOffset) / this.state.angleBySegment) % this.state.numberOfSegments);
    }
    // wheel turning clockwise
    return (this.state.numberOfSegments - Math.floor((deg + this.state.angleOffset) / this.state.angleBySegment)) % this.state.numberOfSegments;
  };

  _onPan = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { velocityX } = nativeEvent;
      this.props.setWinnerText("");
      this.setState({
        spinDirection: velocityX > 0 ? 1 : -1,
      });

      Animated.decay(this._angle, {
        velocity: velocityX / 1000,
        deceleration: 0.999,
        useNativeDriver: true
      }).start(() => {
        this._angle.setValue(this.angle % oneTurn);
        const snapTo = snap(oneTurn / this.state.numberOfSegments);
        Animated.timing(this._angle, {
          toValue: snapTo(this.angle),
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          const winnerIndex = this._getWinnerIndex();
          this.setState({
            enabled: true,
            finished: true,
            winner: this._wheelPaths[winnerIndex].value
          });

          this.props.setWinnerText(this._wheelPaths[winnerIndex].value);
        });
        // do something here;
      });
    }
  };

  _renderKnob = () => {
    // [0, numberOfSegments]
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(this._angle, this.state.angleOffset), (-1)*oneTurn),
        new Animated.Value(this.state.angleBySegment)
      ),
      this.state.spinDirection
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
              })
            }
          ]
        }}
      >
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{ transform: [{ translateY: 8 }] }}
        >
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={appPurple}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderWinner = () => {
    return (
      <RNText style={styles.winnerText}>Go to {this.state.winner}!</RNText>
    );
  };

  setWinner = () => {
    if (this.state.winnerSet == false){
      this.setState({
        winnerSet: true,
      });
      this.props.toggleWinner; //might be able to remove this variable altogether if not being used
      this.props.setWinnerText(this.state.winner);
    }
  }

  _renderSvgWheel = () => {
    return (
      <View style={styles.wheel}>
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                })
              }
            ]
          }}
        >
          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{ transform: [{ rotate: `-${this.state.angleOffset}deg` }] }}
          >
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                let venueName = '';

                // Logic below is for trimming venue names cleanly so they fit on the wheel well with elipses
                if(arc.value && arc.value.length >= 14){
                  if (arc.value[12] == ' ' || arc.value[13] == ' ' || arc.value[14] == ' '){
                    let currChar;
                    let index = 14;
                    while(index >= 0 && currChar != ' '){
                      currChar = arc.value[index];
                      index--;
                    }
                    venueName = arc.value.substr(0, index) + '...';
                  }
                  else {
                    venueName = arc.value.substr(0, 13) + '...';
                  }
                }
                else {
                  venueName = arc.value;
                }

                return (
                  <G key={`arc-${i}`}>
                    <Path d={arc.path} fill={arc.color} />
                    <G
                      rotation={(i * oneTurn) / this.state.numberOfSegments + this.state.angleOffset}
                      origin={`${x}, ${y}`}
                    >
                      <Text
                        x={x}
                        y={y - 80}
                        fill="white"
                        textAnchor="middle"
                        fontSize={fontSize}
                      >
                        {Array.from({ length: venueName.length }).map((_, j) => {
                          return (
                            <TSpan
                              x={x}
                              dy={fontSize}
                              key={`arc-${i}-slice-${j}`}
                            >
                              {venueName.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };

  render() {
    return (
      <PanGestureHandler
        onHandlerStateChange={this._onPan}
        enabled={this.state.enabled}
        key={this.props.venueToggles}
      >
        <Animated.View style={styles.wheelAndRelated}>
          {this._renderKnob()}
          {this._renderSvgWheel()}
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  wheel: {
    height: wheelSize,
    position: 'absolute',
    marginTop: (knobSize*2) - 35,
  },
  winnerText: {
    fontSize: 40,
    fontFamily: fontFamily,
    position: 'absolute',
    margin: '10%',
    textAlign: 'center',
  },
  wheelAndRelated: {
    alignItems: 'center',
  }
});

export default Wheel;