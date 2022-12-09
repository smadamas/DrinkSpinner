import NavBar from '../components/NavBar';
import Settings from '../components/Settings';
import Constants from 'expo-constants';
import React , {Component} from 'react';
import {  
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions } from 'react-native';
import WheelOfFortune from 'react-native-wheel-of-fortune';

const height = Dimensions.get('window').height;
const participants = [
  'Jasper',
  'Kreggers',
  'Jungle Room',
  'PP',
  'Pretty dang long bar name',
  'The HOF',
];

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnerValue: null,
      winnerIndex: null,
      started: false,
      displaySettings: false,
      value: 5,
      isOn: true,
      selectedIndices: [1]
    };
    this.child = null;
    this.updateIndex = this.updateIndex.bind(this)
    this.updateDistanceValue = this.updateDistanceValue.bind(this)
  }

  buttonPress = () => {
    this.setState({
      started: true,
    });
    this.child._onPress();
  }

  handleChangeDisplaySettings = () => {
    const currValue = this.state.displaySettings;
    this.setState({displaySettings: !currValue})
  }

  toggleIsOpenOption = () => {
    const isOn = this.state.isOn;
    this.setState({isOn: !isOn})
  }

  updateDistanceValue (input) {
    const newValue = Math.round(input * 10) / 10;
    this.setState({value: newValue})
  }

  updateIndex (newIndices) {
    if (newIndices.length != 0 ){
        this.setState({selectedIndices: newIndices})
    }
  }
  
  render() {
        const wheelOptions = {
          rewards: participants,
          knobSize: 50,
          borderWidth: 5,
          borderColor: 'black',
          innerRadius: 10,
          duration: 3000,
          backgroundColor: 'transparent',
          textAngle: 'vertical',
          knobSource: require('../assets/knob.png'),
          onRef: ref => (this.child = ref),
        };
        return (
          <View style={styles.container}>
            <View style={styles.statusBar} />

            {/* Top bar of homescreen */}
            <NavBar
              displaySettings={this.state.displaySettings} 
              handleChangeDisplaySettings={this.handleChangeDisplaySettings}></NavBar>

            {/* Conditionally displayed settings menu */}
            {this.state.displaySettings && <Settings
              handleChangeDisplaySettings={this.handleChangeDisplaySettings}
              updateDistanceValue={this.updateDistanceValue}
              toggleIsOpenOption={this.toggleIsOpenOption}
              value={this.state.value}
              isOn={this.state.isOn}
              selectedIndices={this.state.selectedIndices}
              updateIndex={this.updateIndex}
            />}

            {/* The Wheel */}
            <WheelOfFortune
              options={wheelOptions}
              getWinner={(value, index) => {
                this.setState({winnerValue: value, winnerIndex: index});
              }}
            />
            {!this.state.started && (
              <View style={styles.startButtonView}>
                <TouchableOpacity
                  onPress={() => this.buttonPress()}
                  style={styles.startButton}>
                  <Text style={styles.startButtonText}>Spin Now!</Text>
                </TouchableOpacity>
              </View>
            )}
            {this.state.winnerIndex != null && (
              <View style={styles.winnerView}>
                <Text style={styles.winnerText}>
                  Go to {participants[this.state.winnerIndex]}!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({winnerIndex: null});
                    this.child._tryAgain();
                  }}
                  style={styles.tryAgainButton}>
                  <Text style={styles.tryAgainText}>TRY AGAIN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  statusBar: {
    backgroundColor: 'black',
    height: Constants.statusBarHeight
  },
  startButtonView: {
    position: 'absolute',
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,.5)',
    marginTop: 50,
    padding: 5,
  },
  startButtonText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainButton: {
    padding: 10,
  },
  winnerText: {
    fontSize: 30,
  },
  tryAgainButton: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
