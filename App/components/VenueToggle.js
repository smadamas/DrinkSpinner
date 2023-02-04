import { Modal, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import Images from '../assets/Images';
import RadioButtonRN from 'radio-buttons-react-native';

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = [
            {
              label: 'data 1'
             },
             {
              label: 'data 2'
             }
        ];

        return (
            <Modal transparent={true}>
                <TouchableOpacity onPress={this.props.toggleMenu} activeOpacity='1.0' style={{backgroundColor: "#000000aa", flex:1}}>
                    <TouchableOpacity activeOpacity={1} style={styles.settingsMenu} >
                        <TouchableOpacity onPress={this.props.toggleMenu}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Toggle Venues for Wheel</Text>
                        <RadioButtonRN
                            data={data}
                            selectedBtn={(e) => console.log(e)}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        ) 
    }
}

const styles = StyleSheet.create({
    settingsMenu: {
        backgroundColor: 'white', 
        margin: '5%',
        marginTop: '15%', 
        padding: '4%', 
        borderRadius: 14
    },
    settingsHeader: {
        fontSize: 50,
        color: '#5858D0',
        marginLeft: '5%'
    },
    menuText: {
        color: '#5858D0', 
        fontSize: 26
    },
    closeIcon: {
        alignSelf: 'flex-end',
        height: 15,
        width: 15,
        tintColor: '#5858D0'
    },
})