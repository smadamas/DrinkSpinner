import React from 'react';
import { Dimensions, View } from 'react-native';
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

  /* Will asynchronously load fonts. This is required for use of native-base ui framework. Else, throws an error. 
     This method sets isReady to true once loaded */
  async componentDidMount() {
    this.setState({ isReady: true });
  }

  render() {
    return (
      <View style={{height: height, backgroundColor: 'black'}}>
        <HomeScreen name='HomeScreen' component={HomeScreen} />
      </View>
    )
  }
}