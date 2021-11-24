import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Platform, Image, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { SERVER_URL } from './config/server';
import SplashScreen from 'react-native-splash-screen';
import Geocoder from 'react-native-geocoding';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export class Initial extends Component {
  constructor(props) {
    super();
    this.state = {
      user: false,
    }
    
    //AsyncStorage.clear();
    this.getLoggedInUser();
    //base64 signing for facebook  a9Szg9e01lAQYewaL8KLDGRTAgQ=
  }

  
  componentDidMount(){
    SplashScreen.hide();
    this.init();
    Geocoder.init("AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co");
    GoogleSignin.configure();
  }
  
  async getLoggedInUser(token){
    await AsyncStorage.getItem('enviable').then((value) => {
      
      console.log(value, 'val')
      if(value == null){
        this.props.navigation.navigate('PhoneRegistration')
        return;
      }
      var phone = JSON.parse(value).phone1;
      AsyncStorage.getItem('customer').then((value) => {
        console.log(value, 'valwww')
        if(value){
          this.setState({
            user: JSON.parse(value)

          }, ()=>{
            this.savePush(token);
            
              this.props.navigation.navigate('Home')
          
          })
        }else{
          this.props.navigation.navigate('VerifyPhone', {
            phone: phone
          })
          //this.props.navigation.navigate('Home')
          // AsyncStorage.getItem('loginvalue').then((value) => {
          //   if(value){
          //     this.props.navigation.navigate('Login');
          //   }  else{
          //     this.props.navigation.navigate('Welcome');
          //   } 
          // });
        }
      });
    })
  }
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  static navigationOptions = {
      header: null
  }
  async init() {
    
      await PushNotification.configure({
        largeIcon: "ic_notification",
        smallIcon: "ic_notification",
        onRegister: (token) => {
          AsyncStorage.setItem('pushToken', token.token, () => {
            this.getLoggedInUser(token.token); 
          })
        },
        onNotification: (notification) => {
            this._onRemoteNotification(notification);
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
  _onRemoteNotification(notification) {
    console.log(notification, 'nott')
    if(JSON.parse(notification.data.message).myId == "merchant"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          // {
          //   text: "Stay here",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
          { text: "Check order", onPress: () => this.props.navigation.push('MerchantOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        //{ cancelable: false }
      );
    }
    if(JSON.parse(notification.data.message).myId == "dispatch"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          // {
          //   text: "Stay here",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
          { text: "Check order", onPress: () => this.props.navigation.push('DispatchOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        //{ cancelable: false }
      );
    }
    if(JSON.parse(notification.data.message).myId == "ride_share"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
          // {
          //   text: "Stay here",
          //   onPress: () => console.log("Cancel Pressed"),
          //   style: "cancel"
          // },
          //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
          { text: "Check order", onPress: () => this.props.navigation.push('RideOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
        //{ cancelable: false }
      );
    } 

  }

  savePush(token){
    console.log(token, 'token');
    fetch(`${SERVER_URL}/mobile/save_push_token`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          push_token: token,
          user_id: this.state.user.id, 
          device: Platform.OS
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res)
          if(res.success){
            
          }else{
            
          }
  }).done();
}

  render() {
    return (
      <View>
        
      </View>
    )
  }
}

export default Initial

const styles = StyleSheet.create ({
  
})