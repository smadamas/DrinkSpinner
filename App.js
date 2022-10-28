import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import {  
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity, } from 'react-native';
import WheelOfFortune from 'react-native-wheel-of-fortune';

const participants = [
  'Jasper',
  'Kreggers',
  'The Jungle Room',
  'Helen\'s',
  'The Graudate',
  'The HOF',
];
const wheelOptions = {
      rewards: participants,
      knobSize: 50,
      borderWidth: 5,
      borderColor: '#000',
      innerRadius: 50,
      duration: 4000,
      backgroundColor: 'transparent',
      textAngle: 'horizontal',
      knobSource: require('./App/assets/knob.png'),
      getWinner: (value, index) => {
        this.setState({winnerValue: value, winnerIndex: index});
      },
      onRef: ref => (this.child = ref),
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnerValue: null,
      winnerIndex: null,
      started: false,
    };
    this.child = null;
  }

  buttonPress = () => {
    this.setState({
      started: true,
    });
    this.child._onPress();
  };


      render() {
        const wheelOptions = {
          rewards: participants,
          knobSize: 30,
          borderWidth: 5,
          borderColor: '#fff',
          innerRadius: 30,
          duration: 6000,
          backgroundColor: 'transparent',
          textAngle: 'horizontal',
          knobSource: require('./App/assets/knob.png'),
          onRef: ref => (this.child = ref),
        };
        return (
          <View style={styles.container}>
            <StatusBar barStyle={'light-content'} />
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
                  <Text style={styles.startButtonText}>Spin to win!</Text>
                </TouchableOpacity>
              </View>
            )}
            {this.state.winnerIndex != null && (
              <View style={styles.winnerView}>
                <Text style={styles.winnerText}>
                  You win {participants[this.state.winnerIndex]}
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
    export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
