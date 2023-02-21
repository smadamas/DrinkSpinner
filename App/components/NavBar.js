import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Images from '../assets/Images';
const fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

class NavBar extends React.Component {

    constructor(props) {
      super(props);

    }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.appPurple}]}>
        <Text style={styles.menuBarText}>Drink Spinner</Text>
        <TouchableOpacity style={styles.menuPlacement} onPress={this.props.toggleMenu}>
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
    flexDirection: 'row', // row
    alignItems: 'center',
    position: 'relative',
  },
  menuBarText: {
    color: 'white',
    textAlign: 'center',
    width: '100%',
    fontSize: 17,
    fontFamily: fontFamily,
  },
  menuPlacement: {
    position: 'absolute',
    right: '5%',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  menuIcon: {
    tintColor: 'white',
    height: 20,
    width: 20,
    zIndex: 1,

  }
});

export default NavBar;