import NavBar from '../components/NavBar';
import Settings from '../components/Settings';
import VenueToggle from '../components/VenueToggle';
import Constants from 'expo-constants';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import React , {Component} from 'react';
import Images from '../assets/Images';
import {  
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, } from 'react-native';

// Api calls
import axios from 'axios';
import * as Location from 'expo-location';
import LoadingIcon from '../components/LoadingIcon';
import Wheel from '../components/Wheel';
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

//Misc UI
const height = Dimensions.get('window').height;
const { width } = Dimensions.get('screen');

const fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace';
const googleMapsIcon = Images.googleMapsIcon;
const purplesArray = ['#710193', '#B79CED', '#7F0D86', '#A45EE5', '#52489C'];
const appPurple = purplesArray[Math.floor(Math.random() * (purplesArray.length - 1))];
const statusBarHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appPurple: appPurple,
      displaySettings: false,
      displayVenueMenu: false,
      inKm: false,
      location: null,
      openNow: true,
      pricePointString: '',
      resultsExist: true,
      savePlaceIds: [],
      saveSettingsValues: [],
      selectedLocations: [],
      selectedLocationsToggle: [],
      selectedPricepoints: [1],
      showVenues: false,
      started: false,
      updatedVenues: [],
      value: 5,
      venues: [],
      winnerIndex: null,
      wheelPrepped: false,
      wheelSize: width * 1.5,
      winnerName: "",
      winnerPlaceId: "",
    };

    this.setWinnerText = this.setWinnerText.bind(this)
    this.toggleVenueMenu = this.toggleVenueMenu.bind(this)
    this.updateIndex = this.updateIndex.bind(this)
    this.updateDistanceValue = this.updateDistanceValue.bind(this)
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
    axios.get(`${GOOGLE_PLACES_API_BASE_URL}/textsearch/json?query=drinks${this.state.openNow ? '&opennow' : ''}${this.state.pricePointString}&location=${this.state.location.coords.latitude}%2C${this.state.location.coords.longitude}&radius=${this.state.inKm ? this.state.value : 1609.344*this.state.value}&key=AIzaSyD31Tchj71EFAlGpute2CvM_uP_GLCUlcg`).then((response) => {
      
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
          if (response.data.results[i].name != null && response.data.results[i].place_id != null){
            this.setState({
              selectedLocations: this.state.selectedLocations.concat([response.data.results[i].name]),
              selectedLocationsToggle: this.state.selectedLocationsToggle.concat([true]),
              savePlaceIds: this.state.savePlaceIds.concat([response.data.results[i].place_id]),
            });
          }
        }

        this.setState({
          wheelPrepped: true,
          resultsExist: true
        });
      }
      return;
    });
  }

  venueButtonClickedHandler = () => {
    const currValue = this.state.displayVenueMenu;
    this.setState({
      displayVenueMenu: !currValue,
    });
  };

  clickMapButton = () => {
    console.log('map button clicked');
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=""&query_place_id=${this.state.winnerPlaceId}&key=AIzaSyD31Tchj71EFAlGpute2CvM_uP_GLCUlcg`).catch(err => console.error('An error occurred', err));
  };

  toggleMenu = async () => {
    const currValue = this.state.displaySettings;
    let captureSettings = [this.state.value, this.state.openNow].concat( this.state.selectedPricepoints);

    if (currValue){
      if (this.state.saveSettingsValues.toString() !== captureSettings.toString()){ // Determines whether any settings were changed before re-fetching/rendering the wheel
        this.setState({
          displaySettings: !currValue,
          wheelPrepped: false,
          selectedLocations: [],
          selectedLocationsToggle: [],
          savePlaceIds: [],
          resultsExist: true,
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

    //No empty pricepoints allowed, can't unselect middle button only
    if (newIndices.length == 0 || (newIndices.length == 2 && newIndices[0] == 0 && newIndices[1] == 2)){return;}

    //Sorts array so the indices are chronological
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

  setWinnerText = (winner) => {

    if(winner == ""){
      this.setState({
        winnerName: "",
        winnerPlaceId: "",
      });
    }
    else {
      let saveIndex;
      for (let i = 0; i < this.state.selectedLocations.length; i++){
        if (this.state.selectedLocations[i] == winner){
          saveIndex = i;
          break;
        }
      }

      this.setState({
        winnerName: winner,
        winnerPlaceId: this.state.savePlaceIds[saveIndex],
      });
    }
  }

  _renderSettings = () => {
    return(
      <Settings
            toggleMenu={this.toggleMenu}
            updateDistanceValue={this.updateDistanceValue}
            toggleIsOpenOption={this.toggleIsOpenOption}
            toggleDistanceMeasurement={this.toggleDistanceMeasurement}
            value={this.state.value}
            openNow={this.state.openNow}
            inKm={this.state.inKm}
            selectedPricepoints={this.state.selectedPricepoints}
            updateIndex={this.updateIndex}
            appPurple={this.state.appPurple}
      />
    );
  }
  
  render() {

    if (this.state.wheelPrepped){
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.fullScreen}>
          <View style={styles.statusBar} />

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            appPurple={this.state.appPurple}
            toggleMenu={this.toggleMenu}></NavBar>

          {/* Conditionally displayed settings menu */}
          {this.state.displaySettings && this._renderSettings()}

          {/* Conditionally displayed venues menu */}
          {this.state.displayVenueMenu && <VenueToggle
            venues={this.state.selectedLocations}
            venueToggles={this.state.selectedLocationsToggle}
            toggleVenueMenu={this.toggleVenueMenu}
            appPurple={this.state.appPurple}
          />}

          {/* Conditionally displayed winner text */}
          {this.state.winnerName != "" && <View 
            style={styles.winnerView}>
              <Text style={styles.winnerText}>Go to {this.state.winnerName}!</Text>
          </View>}

          <View style={styles.wheelMenu}>
            <TouchableOpacity
              onPress={this.venueButtonClickedHandler}
              style={styles.venueToggleButton}>
              <Text style={styles.venueButtonText}>!</Text>
            </TouchableOpacity>

            {/* Conditionally displayed google maps button */}
            {this.state.winnerName != "" &&
            <TouchableOpacity style={styles.mapButton} onPress={this.clickMapButton}>
                <Image source={googleMapsIcon} style={styles.googleMapsIcon}/>
            </TouchableOpacity>}

            <PanGestureHandler>
              <View key={this.state.selectedLocationsToggle}>  
                <Wheel 
                  selectedLocations={this.state.selectedLocations}
                  venueToggles={this.state.selectedLocationsToggle}
                  setWinnerText={this.setWinnerText}
                  appPurple={this.state.appPurple}
                ></Wheel>
              </View>
            </PanGestureHandler>
          </View>
        </View>
        </GestureHandlerRootView>
      );
    }
    else if (!this.state.resultsExist){
      return (
        <View style={styles.fullScreen}>
          <View style={styles.statusBar} />

          {/* Conditionally displayed settings menu */}
          {this.state.displaySettings && this._renderSettings()}

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings}
            appPurple={this.state.appPurple}
            toggleMenu={this.toggleMenu}>
          </NavBar>

          <View style={styles.centralMenuItems}>
            <Text style={styles.winnerText}>No results with those criteria, please change and try again.</Text>
          </View>
        </View>
      );
    }
    else { //Waiting on results to return and wheel to build
      return (
        <View style={styles.fullScreen}>
          <View style={styles.statusBar} />

          {/* Top bar of homescreen */}
          <NavBar
            displaySettings={this.state.displaySettings} 
            appPurple={this.state.appPurple}
            toggleMenu={this.toggleMenu}>
          </NavBar>

          <View style={styles.centralMenuItems}>
            <LoadingIcon></LoadingIcon>
          </View>
        </View>
      );
    }    
  }
}

const styles = StyleSheet.create({
  centralMenuItems: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'white',
  },
  googleMapsIcon: {
    height: 35,
    width: 35,
    zIndex: 1,
  },
  mapButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    marginTop: 30,
    right: 30,
    zIndex: 100,
    backgroundColor: appPurple,
  },
  statusBar: {
    backgroundColor: 'black',
    height: statusBarHeight
  },
  venueButtonText: {
    fontSize: 35,
    color: '#fff',
    fontWeight: 'bold',
  },
  venueToggleButton: {
    width: 50,
    height: 50,
    color: 'white',
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: appPurple,
    position: 'absolute',
    marginLeft: 30,
    marginTop: 30,
    zIndex: 1,
  },
  wheelMenu: {
    marginTop: height - ((width * 1.5)/2) - 52 - statusBarHeight - (160-35) //To position the wheel halfway off the bottom of the screen, have had to use known constants to calculate distance from the top of the screen in order are height of screen, half of wheel size, navBar height, statusBar height, knobHeight
  },
  winnerText: {
    fontSize: 40,
    fontFamily: fontFamily,
    textAlign: 'center',
    margin: '10%',
    zIndex: 1000, //Should be foremost thing on the main UI when loaded (in case if overlaps with anything)
  },
  winnerView: {
    justifyContent: 'center',
    width: width,
    alignItems: 'center',
    position: 'absolute',
    marginTop: Constants.statusBarHeight + 52, //Bring below the status and nav bar
  },
});
