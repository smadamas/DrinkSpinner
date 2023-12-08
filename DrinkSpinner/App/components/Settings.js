import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import Images from '../assets/Images';
import ToggleSwitch from 'toggle-switch-react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { ButtonGroup } from 'react-native-elements';

let appPurple;

export default class Settings extends Component {
    constructor(props) {
        super(props);

        appPurple = this.props.appPurple;
    }

    render() {
        const buttons = ['$', '$$', '$$$']

        return (
            <Modal transparent={true}>
                <TouchableOpacity onPress={this.props.toggleMenu} activeOpacity='1.0' style={{backgroundColor: "#000000aa", flex:1}}>
                    <TouchableOpacity activeOpacity={1} style={styles.settingsMenu} >
                        <TouchableOpacity onPress={this.props.toggleMenu} style={styles.closeIconContainer}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Settings</Text>
                        <View style={styles.sliderContainer}>
                            <Text style={styles.menuText}>Distance Radius: {this.props.value} {this.props.inKm ? 'km': 'mi'}</Text>
                            <Slider
                                value={this.props.value}
                                onValueChange={value => this.props.updateDistanceValue(value[0])}
                                minimumTrackTintColor={appPurple}
                                thumbTintColor={appPurple}
                                minimumValue={1}
                                maximumValue={this.props.inKm ? 30 : 20}
                                step={1}
                            />
                            <View style={styles.distanceMeasureToggleContainer}>
                                <Text style={styles.distanceMeasureText}>mi</Text>
                                <ToggleSwitch
                                    isOn={this.props.inKm}
                                    onColor={appPurple}
                                    offColor={appPurple}
                                    size="medium"
                                    onToggle={this.props.toggleDistanceMeasurement}
                                    style={{paddingLeft: '4%', paddingRight: '4%',}}
                                />
                                <Text style={styles.distanceMeasureText}>km</Text>
                            </View>
                        </View>
                        <View style={styles.priceRangeContainer}>
                            <Text style={[styles.menuText, {paddingBottom: '5%'}]}>Price Range</Text>
                            <ButtonGroup
                                onPress={this.props.updateIndex}
                                selectMultiple={true}
                                selectedIndexes={this.props.selectedPricepoints}
                                buttons={buttons}
                                containerStyle={{borderRadius: 25}} 
                                selectedButtonStyle={{backgroundColor: appPurple}}
                            />
                        </View>
                        <View style={styles.openNowToggleContainer}>
                            <Text style={styles.menuText}>Open Now</Text>
                            <ToggleSwitch
                                isOn={this.props.openNow}
                                onColor={appPurple}
                                offColor='lightgrey'
                                size="large"
                                onToggle={this.props.toggleIsOpenOption}
                                style={{paddingLeft: '4%'}}
                            />
                        </View>  
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        ) 
    }
}

const styles = StyleSheet.create({
    closeIcon: {
        height: 15,
        width: 15,
        tintColor: appPurple,
        zIndex: 1,
    },
    closeIconContainer: {
        height: 35,
        width: 35,
        top: '2%',
        right: '2%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        alignSelf: 'flex-end',
        zIndex: 99,
    },
    distanceMeasureText: {
        color: appPurple, 
        fontSize: 16
    },
    distanceMeasureToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    menuText: {
        color: appPurple, 
        fontSize: 26
    },
    openNowToggleContainer: {
        margin: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceRangeContainer: {
        margin: '5%',
    },
    settingsHeader: {
        fontSize: 50,
        marginLeft: '5%'
    },
    settingsMenu: {
        backgroundColor: 'white', 
        margin: '5%',
        marginTop: '15%', 
        padding: '5%', 
        borderRadius: 14,
        position: 'relative'
    },
    sliderContainer: {
        margin: '5%'
    },
})