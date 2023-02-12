import { Modal, StyleSheet, View, Image, Text, TouchableOpacity, Pressable, StatusBar, FlatList } from 'react-native';
import React, { Component, useState } from 'react';
import Images from '../assets/Images';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';


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
                                        name={item.isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color="#5858D0" />
                                    <Text style={{color: '#5858D0', fontSize: 15}}>{item.txt}</Text>
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
                        <TouchableOpacity onPress={async () => await this.props.toggleVenueMenu(this.state.data)}>
                            <Image source={Images.closeIcon} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.settingsHeader}>Wheel Inclusions</Text>
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
    },
    settingsHeader: {
        fontSize: 35,
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
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
})