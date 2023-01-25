import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import HomeScreen from './App/screens/HomeScreen';

const height = Dimensions.get('window').height;

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    /* Holds state for if async method is ready or not */
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    this.setState({ isReady: true });
  }

  render() {
    if (this.state.isReady){
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