import { Modal, StyleSheet, View, Image, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { Component } from 'react';
import Images from '../assets/Images';
import ToggleSwitch from 'toggle-switch-react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { ButtonGroup } from 'react-native-elements';

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const buttons = ['$', '$$', '$$$']

        return (
            <Modal transparent={true}>
                <TouchableOpacity onPress={this.props.handleChangeDisplaySettings} activeOpacity='1.0' style={{backgroundColor: "#000000aa", flex:1}}>
                    <View style={styles.settingsMenu}>
                        <TouchableOpacity onPress={this.props.handleChangeDisplaySettings}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Settings</Text>
                        <View style={styles.sliderContainer}>
                            <Text style={styles.menuText}>Distance Radius: {this.props.value} mi</Text>
                            <Slider
                                value={this.props.value}
                                onValueChange={value => this.props.updateDistanceValue(value[0])}
                                minimumTrackTintColor='#5858D0'
                                thumbTintColor='#5858D0'
                                minimumValue={1}
                                maximumValue={20}
                            />
                        </View>
                        <View style={styles.priceRangeContainer}>
                            <Text style={[styles.menuText, {paddingBottom: '5%'}]}>Price Range</Text>
                            <ButtonGroup
                                underlayColor='red'
                                onPress={this.props.updateIndex}
                                selectMultiple={true}
                                selectedIndexes={this.props.selectedIndices}
                                buttons={buttons}
                                containerStyle={{borderRadius: 25}} 
                                selectedButtonStyle={{backgroundColor: '#5858D0'}}
                            />
                        </View>
                        <View style={styles.openNowToggleContainer}>
                            <Text style={styles.menuText}>Open Now</Text>
                            <ToggleSwitch
                                isOn={this.props.isOn}
                                onColor='#5858D0'
                                offColor='lightgrey'
                                size="large"
                                onToggle={this.props.toggleIsOpenOption}
                                style={{paddingLeft: '4%'}}
                            />
                        </View>  
                    </View>
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
    sliderContainer: {
        margin: '5%'
    },
    openNowToggleContainer: {
        margin: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceRangeContainer: {
        margin: '5%',
    }
})