import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Images from '../assets/Images';

class NavBar extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.menuBarText}>Welcome to Drink Spinner!</Text>
        <TouchableOpacity style={styles.menuPlacement} onPress={this.props.handleChangeDisplaySettings}>
            <Image source={Images.menuIcon} style={styles.menuIcon}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    width: '100%',
    backgroundColor: '#5858D0',
    flexDirection: 'row', // row
    alignItems: 'center',
    position: 'relative'
  },
  menuBarText: {
    color: 'white',
    textAlign: 'center',
    width: '100%',
    fontSize: 20
  },
  menuPlacement: {
    position: 'absolute',
    right: '5%',
  },
  menuIcon: {
    tintColor: 'white',
    height: 20,
    width: 20
  }
});

export default NavBar;