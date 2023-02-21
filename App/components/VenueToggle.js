import { Modal, StyleSheet, View, Image, Text, TouchableOpacity, Pressable, StatusBar, FlatList } from 'react-native';
import React, { Component, useState } from 'react';
import Images from '../assets/Images';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';

const fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace';
let appPurple;


export default class VenueToggle extends Component {
    constructor(props) {
        super(props);

        // Assemble array of data for render with venues from parent
        let counter = 0;
        let tempVenues = [];

        while(counter < this.props.venues.length){
            tempVenues= tempVenues.concat([{ id: counter + 1, txt: this.props.venues[counter].length > 24 ? this.props.venues[counter].substring(0,24) + '...' : this.props.venues[counter], isChecked: this.props.venueToggles[counter] }])
            counter += 1;
        }

        this.state = {
            data: tempVenues,
        }

        appPurple = this.props.appPurple;
    }

    handleChange = (id) => {

        let temp = this.state.data.map((product) => {
            if (id === product.id) {
                return { ...product, isChecked: !product.isChecked };
            }
            return product;
        });

        this.setState({
            data: temp
        });
    };

    shuffleSelections = () => {
        let temp;

        if (this.state.data.length < 6){
            temp = this.state.data.map((product) => {
                if (id === product.id) {
                    return { ...product, isChecked: true };
                }
                return product;
            });
        }
        else {
            let storeIndices = [];
            let newIndex;
            for (let i = 0; i < 5; i++){
                do {
                    newIndex = Math.floor(Math.random() * (this.state.data.length - 1)) + 1;
                }
                while (storeIndices.includes(newIndex));
                storeIndices = storeIndices.concat([newIndex]);
            }

            temp = this.state.data.map((product) => {
                if (storeIndices.includes(product.id)) {
                    return { ...product, isChecked: true };
                }
                else {
                    return { ...product, isChecked: false };
                }
            });
        }

        this.setState({
            data: temp
        });
    }

    renderFlatList = (renderData) => {
        return (
            <FlatList
                data={renderData}
                renderItem={({ item }) => (
                    <Pressable onPress={() => this.handleChange(item.id)} >
                        <Card style={{ margin: 5, backgroundColor: 'white' }}>
                            <View style={styles.card}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                
                                    <MaterialCommunityIcons
                                        name={item.isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={appPurple} />
                                    <Text style={{color: appPurple, fontSize: 15, fontFamily: fontFamily}}>{item.txt}</Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                )}
            />
        );
    }

    render() {
        return (
            <Modal transparent={true}>
                <TouchableOpacity onPress={async () => await this.props.toggleVenueMenu(this.state.data)} activeOpacity='1.0' style={{backgroundColor: "#000000aa", flex:1}}>
                    <TouchableOpacity activeOpacity={1} style={styles.settingsMenu} >
                        <TouchableOpacity onPress={async () => await this.props.toggleVenueMenu(this.state.data)} style={styles.closeIconContainer}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Wheel Inclusions</Text>
                        <TouchableOpacity onPress={this.shuffleSelections} style={[styles.button, {backgroundColor: appPurple}]}>
                            <Text style={{fontSize: 15, color: 'white', fontFamily: fontFamily}}>Shuffle </Text>
                            <Image source={Images.shuffleIcon} style={styles.shuffleIcon}/>
                        </TouchableOpacity>
                        <View style={styles.container}>
                            <View style={{ flex: 1 }}>
                                {this.renderFlatList(this.state.data)}
                            </View>
                            <StatusBar />
                        </View>
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
        borderRadius: 14,
        height: '85%',
        position: 'relative',
    },
    settingsHeader: {
        fontSize: 25,
        color: appPurple,
        marginLeft: '5%',
        fontFamily: fontFamily,
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
    closeIcon: {
        height: 15,
        width: 15,
        tintColor: appPurple,
        zIndex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
    },
    card: {
        padding: 10,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
    },
    shuffleIcon: {
        height: 20,
        width: 20,
        tintColor: 'white'
    },
    button: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        flexDirection: 'row',
        zIndex: 1,
        margin: '5%',
    },
})