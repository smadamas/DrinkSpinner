import NavBar from '../components/NavBar';
import Settings from '../components/Settings';
import VenueToggle from '../components/VenueToggle';
import Constants from 'expo-constants';
import { PanGestureHandler } from 'react-native-gesture-handler';
import React , {Component} from 'react';
import {  
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated } from 'react-native';
// import WheelOfFortune from 'react-native-wheel-of-fortune';

const { width } = Dimensions.get('screen');

// Api calls
import axios from 'axios';
import * as Location from 'expo-location';
import LoadingIcon from '../components/LoadingIcon';
import Wheel from '../components/Wheel';

const height = Dimensions.get('window').height;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnerName: "",
      winnerSet: false,
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
      selectedLocationsToggle: [],
      wheelPrepped: false,
      resultsExist: true,
      saveSettingsValues: [],
      inKm: false,
      showVenues: false,
      wheelSize: width * 1.5,
      displayVenueMenu: false,
      updatedVenues: [],
    };
    this.child = null;
    this.updateIndex = this.updateIndex.bind(this)
    this.updateDistanceValue = this.updateDistanceValue.bind(this)
    this.setWinnerText = this.setWinnerText.bind(this)
    this.toggleWinner = this.toggleWinner.bind(this)
    this.toggleVenueMenu = this.toggleVenueMenu.bind(this)

  }

  async componentDidMount() {
    await this.fetchLocations();
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
    axios.get(`${GOOGLE_PLACES_API_BASE_URL}/textsearch/json?query=bar${this.state.openNow ? '&opennow' : ''}${this.state.pricePointString}&location=${this.state.location.coords.latitude}%2C${this.state.location.coords.longitude}&radius=${this.state.inKm ? this.state.value : 1609.344*this.state.value}&key=AIzaSyD31Tchj71EFAlGpute2CvM_uP_GLCUlcg`).then((response) => {
      
      if (response.data.results.length <= 1){
        this.setState({
          resultsExist: false
        });
      }
      else {
        for (let i = 0; i < 20; i++) {
          if (response.data.results[i] == null){
              break;
          }
          this.setState({
            selectedLocations: this.state.selectedLocations.concat([response.data.results[i].name]),
            selectedLocationsToggle: this.state.selectedLocationsToggle.concat([true]),
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

  buttonClickedHandler = () => {
    const currValue = this.state.displayVenueMenu;
    this.setState({
      displayVenueMenu: !currValue,
    });
  };

  toggleMenu = async () => {
    const currValue = this.state.displaySettings;
    let captureSettings = [this.state.value, this.state.openNow].concat( this.state.selectedPricepoints);

    if (currValue){
      if (this.state.saveSettingsValues.toString() !== captureSettings.toString()){ // Determines whether any settings were changed before re-fetching/rendeing the wheel
        this.setState({
          displaySettings: !currValue,
          wheelPrepped: false,
          winnerSet: false,
          selectedLocations: [],
          selectedLocationsToggle: [],
        });
    
        await this.fetchLocations();
      }
      else {
        this.setState({
          displaySettings: !currValue,
        });
      }
    }
    else {
      this.setState({
        displaySettings: !currValue,
        saveSettingsValues: captureSettings,
      });
    }
  }

  toggleVenueMenu = async (newVenues) => {

    const dispVenue = this.state.displayVenueMenu;

    let updatedSelectedLocationsToggles = [];
    for(let i = 0; i < newVenues.length; i++){
      updatedSelectedLocationsToggles = updatedSelectedLocationsToggles.concat([newVenues[i].isChecked]);
    }

    this.setState({
      displayVenueMenu: !dispVenue,
      selectedLocationsToggle: updatedSelectedLocationsToggles,
      wheelPrepped: true,
    })

  }

  toggleIsOpenOption = () => {
    const openNow = this.state.openNow;
    this.setState({openNow: !openNow})
  }

  toggleDistanceMeasurement = () => {
    const inKm = this.state.inKm;
    this.state.value > 20 && inKm == true ? this.setState({inKm: !inKm, value: 20}) : this.setState({inKm: !inKm})
    this.setState({inKm: !inKm})
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

  handleGesture = (evt) => {
    let{nativeEvent} = evt
        console.log(nativeEvent)
  }

  setWinnerText = (winner) => {
    // console.log("new winner: ", winner);
    this.setState({winnerName: winner})
  }

  toggleWinner() {
    const newWinnerToggle = !this.state.winnerSet;
    // console.log("text toggle currently: ", newWinnerToggle);
    this.setState({winnerSet: newWinnerToggle})
  }
  
  render() {
    const wheelOptions = {
      rewards: this.state.selectedLocations,
      knobSize: 50,
      borderWidth: 5,
      borderColor: 'black',
      innerRadius: 10,
      outerHeight: 1000,
      duration: 3000,
      backgroundColor: 'transparent',
      textAngle: 'vertical',
      knobSource: require('../assets/knob.png'),
      onRef: ref => (this.child = ref),
    };

    const segColors = [
      '#EE4040',
      '#F0CF50',
      '#815CD1',
      '#3DA5E0',
      '#34A24F',
      '#F9AA1F',
      '#EC3F3F',
      '#FF9000'
    ]

    if (this.state.wheelPrepped){
      return (
        <View style={styles.fullScreen}>
          <View style={styles.statusBar} />

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            toggleMenu={this.toggleMenu}></NavBar>

          {/* Conditionally displayed settings menu */}
          {this.state.displaySettings && <Settings
            toggleMenu={this.toggleMenu}
            updateDistanceValue={this.updateDistanceValue}
            toggleIsOpenOption={this.toggleIsOpenOption}
            toggleDistanceMeasurement={this.toggleDistanceMeasurement}
            value={this.state.value}
            openNow={this.state.openNow}
            inKm={this.state.inKm}
            selectedPricepoints={this.state.selectedPricepoints}
            updateIndex={this.updateIndex}
          />}

          {/* Conditionally displayed venues menu */}
          {this.state.displayVenueMenu && <VenueToggle
            venues={this.state.selectedLocations}
            venueToggles={this.state.selectedLocationsToggle}
            toggleVenueMenu={this.toggleVenueMenu}
          />}

          {this.state.winnerName != "" && <View style={styles.winnerView}><Text style={styles.winnerText}>Go to {this.state.winnerName}!</Text></View>}

          <View style={styles.wheelMenu}>
            <TouchableOpacity
              onPress={this.buttonClickedHandler}
              style={styles.button}>
              <Text style={styles.startButtonText}>!</Text>
            </TouchableOpacity>

            {/* Change the Opening Brace to this to view pan console logging with internal function: <PanGestureHandler onGestureEvent={this.handleGesture}>*/}
            <PanGestureHandler>
              <View key={this.state.selectedLocationsToggle}>  
                <Wheel 
                  selectedLocations={this.state.selectedLocations}
                  venueToggles={this.state.selectedLocationsToggle}
                  setWinnerText={this.setWinnerText}
                  toggleWinner={this.toggleWinner}
                ></Wheel>
              </View>
            </PanGestureHandler>
          </View>
        </View>
      );
    }
    else if (!this.state.resultsExist){
      return (
        <View style={styles.fullScreen}>
          <View style={styles.statusBar} />

          {/* Conditionally displayed settings menu */}
          {this.state.displaySettings && <Settings
            toggleMenu={this.toggleMenu}
            updateDistanceValue={this.updateDistanceValue}
            toggleIsOpenOption={this.toggleIsOpenOption}
            toggleDistanceMeasurement={this.toggleDistanceMeasurement}
            value={this.state.value}
            openNow={this.state.openNow}
            inKm={this.state.inKm}
            selectedPricepoints={this.state.selectedPricepoints}
            updateIndex={this.updateIndex}
          />}

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            toggleMenu={this.toggleMenu}></NavBar>
          <View style={styles.centralMenuItems}>
            <Text style={styles.winnerText}>No results with those criteria, please change and try again.</Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.fullScreen}>
          <View style={styles.statusBar} />

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            toggleMenu={this.toggleMenu}></NavBar>
          <View style={styles.centralMenuItems}>
            <LoadingIcon></LoadingIcon>
          </View>
        </View>
      );
    }    
  }
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusBar: {
    backgroundColor: 'black',
    height: Constants.statusBarHeight
  },
  centralMenuItems: {
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
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerView: {
    justifyContent: 'center',
    width: width,
    alignItems: 'center',
    position: 'absolute',
    marginTop: '35%',
  },
  tryAgainButton: {
    padding: 10,
  },
  winnerText: {
    fontSize: 40,
    fontFamily: 'Menlo',
    textAlign: 'center',
    margin: '10%',
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
  button: {
    width: 50,
    height: 50,
    color: 'white',
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#5858D0',
    position: 'absolute',
    marginLeft: 30,
    marginTop: 30,
    zIndex: 1,
  },
  wheelMenu: {
    marginTop: height - ((width * 1.5)/2) - 52 - Constants.statusBarHeight - (160-35) //To position the wheel halfway off the bottom of the screen, have had to use known constants to calculate distance from the top of the screen in order are height of screen, half of wheel size, navBar height, statusBar height, knobHeight
  },
});
