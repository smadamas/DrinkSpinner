import { Modal, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import Images from '../assets/Images';
import ToggleSwitch from 'toggle-switch-react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { ButtonGroup } from 'react-native-elements';

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.updateIndex = this.updateIndex.bind(this)
    }

    state = {
        value: 5,
        isOn: true,
        selectedIndices: [1]
    };

    updateIndex (newIndices) {
        if (newIndices.length != 0 ){
            this.setState({selectedIndices: newIndices})
        }
      }

    render() {
        const buttons = ['$', '$$', '$$$']

        return (
            <Modal transparent={true}>
                <View style={{backgroundColor: "#000000aa", flex:1}}>
                    <View style={styles.settingsMenu}>
                        <TouchableOpacity onPress={this.props.handleChangeDisplaySettings}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Settings</Text>
                        <View style={styles.sliderContainer}>
                            <Text style={styles.menuText}>Distance Radius: {this.state.value} mi</Text>
                            <Slider
                                value={this.state.value}
                                onValueChange={value => {
                                    value = Math.round(value * 10) / 10;
                                    this.setState({value})}}
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
                                onPress={this.updateIndex}
                                selectMultiple={true}
                                selectedIndexes={this.state.selectedIndices}
                                buttons={buttons}
                                containerStyle={{borderRadius: 25}} 
                                selectedButtonStyle={{backgroundColor: '#5858D0'}}
                            />
                        </View>
                        <View style={styles.openNowToggleContainer}>
                            <Text style={styles.menuText}>Open Now</Text>
                            <ToggleSwitch
                                isOn={this.state.isOn}
                                onColor='#5858D0'
                                offColor='lightgrey'
                                size="large"
                                onToggle={() => this.setState({isOn: !this.state.isOn})}
                                style={{paddingLeft: '4%'}}
                            />
                        </View>  
                    </View>
                </View>
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