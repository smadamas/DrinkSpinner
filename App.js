import React from 'react';
import { Dimensions, View } from 'react-native';
import HomeScreen from './App/screens/HomeScreen';
import axios from 'axios';
import * as Location from 'expo-location';

const height = Dimensions.get('window').height;
const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    /* Holds state for if async method is ready or not */
    this.state = {
      isReady: false,
      venues: [],
    };
  }

  async componentDidMount() {
    this.setState({ isReady: true });
    this.setState({
      venues: await this.fetchWheelLocations()
    });
    
  }

  async fetchWheelLocations() {
    //Fetch current location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});

    //Call Google API
    axios.get(`${GOOGLE_PLACES_API_BASE_URL}/textsearch/json?query=bar&location=${location.coords.latitude}%2C${location.coords.longitude}&radius=10000&&key=AIzaSyD31Tchj71EFAlGpute2CvM_uP_GLCUlcg`).then((response) => {
      return response.data;
    });

    console.log("Total distance: ", 1609.344*1.5);
  }

  render() {
    if (this.state.venues != [] && this.state.isReady){
      return (
        <View style={{height: height, backgroundColor: 'black'}}>
          <HomeScreen name='HomeScreen' component={HomeScreen} />
        </View>
      )
    }
    else {
      return (
        <View style={{height: height, backgroundColor: 'black'}}>
        </View>
      )
    }
  }
}