import React, { Component } from 'react';
import { Alert, AppRegistry, Dimensions, StatusBar } from 'react-native';
import { createAppContainer, createNavigationContainer } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-community/async-storage';
 
import Login from '@src/pages/Auth/Login';
import PhoneRegistration from '@src/pages/Auth/PhoneRegistration';

import Register from '@src/pages/Auth/Register';
 
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
 
import store from "@src/redux/index"
import { connect } from 'react-redux';
import { setUser } from '@src/redux/slices/userSlice';
import Route from './Routes/Route';
import ProtectedRoute from './Routes/ProtectedRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
console.disableYellowBox = true;

class Main extends Component {
  state = {}
  constructor() {
    super()
    this.state = {
      decider: false
    }
  }

  async getLoggedInUser(token){

    try {
       
     
      const customer = await AsyncStorage.getItem('customer');
      let customer$ = JSON.parse(customer);

      if(customer$ === null){
        this.props.dispatch(setUser({user:customer$, status: false}));
        
         
         
      }else{
         
        this.props.dispatch(setUser({user:customer$, status: true}));

      }
       


    } catch (error) {
      console.log(error, "bass errpr");
    }
   
  }


  isAppOutdated(){
    fetch(`https://api.ets.com.ng/app_version`, {
      method:'GET'
    })
    .then(a => a.json())
    .then(b=>{
      var pkg = require('../../package.json');
      // console.log(pkg.version);
      if(Platform.OS === "android" && pkg.app_version.android < b.version.android){
        console.log(pkg.app_version.android,b.version.android)
        Alert.alert('New Updates Available', 'Update your app to the latest version to enjoy latest features');
      }
      if(Platform.OS === "ios" && pkg.app_version.ios < b.version.ios){
        console.log(pkg.app_version.android,b.version.android)
        Alert.alert('New Updates Available', 'Update your app to the latest version to enjoy latest features');
      }
    })
    .catch(e=> console.log(e, "Something wetnt wrong"))
  }

  async componentDidMount() {
   await this.getLoggedInUser();
   this.isAppOutdated();
    SplashScreen.hide();


  }

  render() {
      
    return (
     
       <SafeAreaView style={{flex:1}}>
    
              {this.props.user.status === false ? <Route /> : <ProtectedRoute />}           

        </SafeAreaView>
        
    )
  }
}

const mapStateToProps = (state, ownProps) =>{

     
return {user:state.user , ...ownProps};
}

export default connect(mapStateToProps)(Main) 
