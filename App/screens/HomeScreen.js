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
import axios from 'axios';
import * as Location from 'expo-location';
import LoadingIcon from '../components/LoadingIcon';

const height = Dimensions.get('window').height;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnerValue: null,
      winnerIndex: null,
      started: false,
      displaySettings: false,
      value: 5,
      openNow: true,
      selectedPricepoints: [1],
      pricePointString: '',
      venues: [],
      location: null,
      selectedLocations: [],
      wheelPrepped: false,
      resultsExist: true,
    };
    this.child = null;
    this.updateIndex = this.updateIndex.bind(this)
    this.updateDistanceValue = this.updateDistanceValue.bind(this)
  }

  async componentDidMount() {
    await this.fetchLocations()
  }

  async fetchLocations() {
    //Fetch current location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    this.setState({
      location: await Location.getCurrentPositionAsync({})
    });

    //Create price point string
    console.log('Here: ', this.state.selectedPricepoints);
    let tempString = '';
    let length = this.state.selectedPricepoints.length;

    if (this.state.selectedPricepoints[0] == 0){
      tempString = tempString.concat('&minprice=0');
    }
    else if (this.state.selectedPricepoints[0] == 1){
      tempString = tempString.concat('&minprice=2');
    }
    else {
      tempString = tempString.concat('&minprice=3');
    }

    if (this.state.selectedPricepoints[length-1] == 0){
      tempString = tempString.concat('&maxprice=1');
    }
    else if (this.state.selectedPricepoints[length-1] == 1){
      tempString = tempString.concat('&maxprice=2');
    }
    else {
      tempString = tempString.concat('&maxprice=4');
    }
    this.setState({
      pricePointString: tempString
    });

    //Call Google API
    console.log(`${GOOGLE_PLACES_API_BASE_URL}/textsearch/json?query=bar${this.state.openNow ? '&opennow' : ''}${this.state.pricePointString}&location=${this.state.location.coords.latitude}%2C${this.state.location.coords.longitude}&radius=${1609.344*this.state.value}&key=AIzaSyD31Tchj71EFAlGpute2CvM_uP_GLCUlcg`);
    axios.get(`${GOOGLE_PLACES_API_BASE_URL}/textsearch/json?query=bar${this.state.openNow ? '&opennow' : ''}${this.state.pricePointString}&location=${this.state.location.coords.latitude}%2C${this.state.location.coords.longitude}&radius=${1609.344*this.state.value}&key=AIzaSyD31Tchj71EFAlGpute2CvM_uP_GLCUlcg`).then((response) => {
      
      if (response.data.results.length == 0){
        console.log('No results with the search parameters!');
        this.setState({
          resultsExist: false
        });
      }
      else {
        for (let i = 0; i < 6; i++) {
          this.setState({
            selectedLocations: this.state.selectedLocations.concat([response.data.results[i].name])
          });
        }
        this.setState({
          wheelPrepped: true,
          resultsExist: true
        });
      }
      return;
    });
  }

  buttonPress = () => {
    this.setState({
      started: true,
    });
    this.child._onPress();
  }

  handleChangeDisplaySettings = async () => {
    const currValue = this.state.displaySettings;

    if (currValue){
      this.setState({
        displaySettings: !currValue,
        wheelPrepped: false,
        selectedLocations: []
      });
  
      await this.fetchLocations();
    }
    else {
      this.setState({
        displaySettings: !currValue,
      });
    }
    
  }

  toggleIsOpenOption = () => {
    const openNow = this.state.openNow;
    this.setState({openNow: !openNow})
  }

  updateDistanceValue (input) {
    const newValue = Math.round(input * 10) / 10;
    this.setState({value: newValue})
  }

  updateIndex (newIndices) {
    let tempArray = newIndices;

    for (let j = 0; j < tempArray.length - 1; j++)
    {
        if (tempArray[j] > tempArray[j + 1])
        {
            let temp = tempArray[j];
            tempArray[j] = tempArray[j + 1];
            tempArray[j + 1] = temp;
            j = -1;
        }
    }

    this.setState({
      selectedPricepoints: tempArray
    })
  }
  
  render() {
    const wheelOptions = {
      rewards: this.state.selectedLocations,
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
    if (this.state.wheelPrepped){
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
            openNow={this.state.openNow}
            selectedPricepoints={this.state.selectedPricepoints}
            updateIndex={this.updateIndex}
          />}

          <View style={styles.wheelMenuItems}>
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
                Go to {this.state.selectedLocations[this.state.winnerIndex]}!
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
        </View>
      );
    }
    else if (!this.state.resultsExist){
      return (
        <View style={styles.container}>
          <View style={styles.statusBar} />

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            handleChangeDisplaySettings={this.handleChangeDisplaySettings}></NavBar>
          <View style={styles.wheelMenuItems}>
            <Text style={styles.winnerText}>No results with those criteria, please change and try again.</Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <View style={styles.statusBar} />

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            handleChangeDisplaySettings={this.handleChangeDisplaySettings}></NavBar>
          <View style={styles.wheelMenuItems}>
            <LoadingIcon></LoadingIcon>
          </View>
        </View>
      );
    }
        
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusBar: {
    backgroundColor: 'black',
    height: Constants.statusBarHeight
  },
  wheelMenuItems: {
    flex: 1,
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
