import { Modal, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import Images from '../assets/Images';

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal transparent={true}>
                <View style={{backgroundColor: "#000000aa", flex:1}}>
                    <View style={styles.settingsMenu}>
                        <TouchableOpacity onPress={this.props.handleChangeDisplaySettings}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Settings</Text>
                    </View>
                </View>
            </Modal>
        ) 
    }
}

const styles = StyleSheet.create({
    settingsMenu: {
        backgroundColor: 'white', 
        flex:1, 
        margin: '5%',
        marginTop: '15%', 
        padding: '4%', 
        borderRadius: 14
    },
    settingsHeader: {
        fontSize: 50,
        fontColor: '#5858D0'
    },
    closeIcon: {
        alignSelf: 'flex-end',
        height: 15,
        width: 15,
        tintColor: '#5858D0'
    }
})