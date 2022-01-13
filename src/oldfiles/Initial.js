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
    
<<<<<<< HEAD:src/oldfiles/Initial.js
     
     
     
=======
   
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
  }

  
  componentDidMount(){
    SplashScreen.hide();
    this.init();
    Geocoder.init("AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co");
    GoogleSignin.configure();
  }
  
  async getLoggedInUser(token){
    alert("jhdbnfjbdhb")
    await AsyncStorage.getItem('enviable').then((value) => {
<<<<<<< HEAD:src/oldfiles/Initial.js
       
      alert(value+ 'val')
=======
   
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js

      if(value == null){
        this.props.navigation.navigate('PhoneRegistration')
        return;
      }
      var phone = JSON.parse(value).phone1;
      AsyncStorage.getItem('customer').then((value) => {
        
        if(value){

          this.setState({
            user: JSON.parse(value)

          }, ()=>{

<<<<<<< HEAD:src/oldfiles/Initial.js
             
=======
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
            this.props.navigation.navigate('Home')
          
          })
        }else{
          this.props.navigation.navigate('VerifyPhone', {
            phone: phone
          })
<<<<<<< HEAD:src/oldfiles/Initial.js
           
           
           
           
           
           
           
           
=======
        
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
        }
      }, (err)=> {alert(err)})
      ;
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
      await this.getLoggedInUser();

      await PushNotification.configure({
        largeIcon: "ic_notification",
        smallIcon: "ic_notification",
        onRegister: (token) => {
          AsyncStorage.setItem('pushToken', token.token, () => {
<<<<<<< HEAD:src/oldfiles/Initial.js
             
=======
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
            this.savePush(token.token,1); 
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
<<<<<<< HEAD:src/oldfiles/Initial.js
           
           
           
           
           
           
=======
          
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
          { text: "Check order", onPress: () => this.props.navigation.push('MerchantOrderDetails', {
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
<<<<<<< HEAD:src/oldfiles/Initial.js
         
=======
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
      );
    }
    if(JSON.parse(notification.data.message).myId == "dispatch"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
<<<<<<< HEAD:src/oldfiles/Initial.js
           
           
           
           
           
           
          { text: "Check order", onPress: () => this.props.navigation.push('DispatchOrderDetails', {
=======
        { text: "Check order", onPress: () => this.props.navigation.push('DispatchOrderDetails', {
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
<<<<<<< HEAD:src/oldfiles/Initial.js
         
=======
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
      );
    }
    if(JSON.parse(notification.data.message).myId == "ride_share"){
      Alert.alert(
        JSON.parse(notification.data.message).title,
        JSON.parse(notification.data.message).body,
        [
<<<<<<< HEAD:src/oldfiles/Initial.js
           
           
           
           
           
           
          { text: "Check order", onPress: () => this.props.navigation.push('RideOrderDetails', {
=======
         { text: "Check order", onPress: () => this.props.navigation.push('RideOrderDetails', {
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
            orderId: JSON.parse(notification.data.message).orderId ,
          })
         }
        ],
<<<<<<< HEAD:src/oldfiles/Initial.js
         
=======
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
      );
    } 

  }

  savePush(token, type){
<<<<<<< HEAD:src/oldfiles/Initial.js
     
=======
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3:src/Initial.js
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