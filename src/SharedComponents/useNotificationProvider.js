import React, { Component, useEffect, useState } from 'react';
import { AppState, View, Text, Alert, Platform, Image, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { SERVER_URL } from '@src/config/server';
import SplashScreen from 'react-native-splash-screen';
import Geocoder from 'react-native-geocoding';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

Geocoder.init("AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co");

const sendAlert = (title, body, buttons = []) => {
    Alert.alert(title, body, buttons);
}


function useNotificationProvider({user}){

    const navigation = useNavigation();
    // navigation.
    async function init() {
        await PushNotification.configure({
            largeIcon: "ic_notification",
            smallIcon: "ic_notification",
            onRegister: (token) => {
                AsyncStorage.setItem('pushToken', token.token, () => {
                    savePush(token.token, 1);
                })
            },
            onNotification: (notification) => {
                _onRemoteNotification(notification);
            },

            onRegistrationError: (err) => {
                Alert.alert(err.message)
            },
            senderID: "639533620742",
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }


    function _onRemoteNotification(notification) {

        const id = JSON.parse(notification.data.message).myId;
        const {title, orderId, body } = JSON.parse(notification.data.message);
        const text = 'Check order';

        switch (id) {
            case "merchant": {
                sendAlert(title, body, [{
                        text, onPress: () => navigation.navigate('MerchantOrderDetails', { orderId })
                    }]);
                    break;
            }
            case "dispatch": {
                sendAlert(title, body, [{
                    text,onPress: () => navigation.navigate('DispatchOrderDetails', { orderId })
                }]);
                break;
            }
            case "ride_share": {
                sendAlert(title, body, [{
                    text, onPress: () => navigation.navigate('RideOrderDetails', { orderId })
                }]);
                break;
            }
            default : console.log('Unknown Notification');
        }

    }

    function savePush(token, type=null) {
        fetch(`${SERVER_URL}/mobile/save_push_token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                push_token: token,
                user_id: user.id,
                device: Platform.OS
            })
        })
        .then((response) => response.json())
        .then((res) => {
            console.log(res, 'on save push notification');   
        })
    }


    // useEffect(()=>{
    //     // initGeo();
    // },[]);

    // function initGeo(){
    //     init();
    // }


    return init;
}

export default useNotificationProvider;

