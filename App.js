import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, Platform, StyleSheet, Text, View, TouchableOpacity,AsyncStorage } from 'react-native';
import {name as appName} from './app.json';

import Initial from './src/Initial';
import Login from './src/Login';
import Register from './src/Register';
import Home from './src/Home';
import Eat from './src/Eat/Eat';
import EatMerchants from './src/Eat/Merchants';
import Welcome from './src/Welcome';
import EatDetails from './src/Eat/EatDetails';
import Cart from './src/Eat/Cart';
import EatDeliveryAddress from './src/Eat/EatDeliveryAddress';
import EatOrderSummary from './src/Eat/EatOrderSummary';
import MerchantOrders from './src/MerchantOrders';
import MerchantOrderDetails from './src/MerchantOrderDetails';
import DispatchOrders from './src/DispatchOrders';
import DispatchOrderDetails from './src/DispatchOrderDetails';
import NewDispatch from './src/Dispatch/NewDispatch';
//import DispatchType from './src/Dispatch/DispatchType';
import DispatchCartSummary from './src/Dispatch/DispatchCartSummary';
import DispatchAddress from './src/Dispatch/DispatchAddress';
import Transactions from './src/Transactions';
import Profile from './src/Profile';
import Help from './src/Help';

import RideShareHome from './src/RideShare/RideHome';
import RideShareConfirm from './src/RideShare/RideConfirm';
import RidePaymentMethod from './src/RideShare/RidePaymentMethod';
import RideOrderDetails from './src/RideShare/RideOrderDetails';

import RideOrders from './src/RideShare/RideOrders';

console.disableYellowBox = true;


const MainNavigator = createStackNavigator({
  Initial: {screen: Initial},
  Welcome: {screen: Welcome},
  EatOrderSummary: {screen: EatOrderSummary},
  EatDeliveryAddress: {screen: EatDeliveryAddress},
  Cart: {screen: Cart},
  EatDetails: {screen: EatDetails},
  NewDispatch: {screen: NewDispatch},
  DispatchCartSummary: {screen: DispatchCartSummary},
  DispatchAddress: {screen: DispatchAddress},
  Login: {screen: Login},
  Home: {screen: Home},
  Eat: {screen: Eat},
  EatMerchants: {screen: EatMerchants},
  MerchantOrders: {screen: MerchantOrders},
  MerchantOrderDetails: {screen: MerchantOrderDetails},
  DispatchOrders: {screen: DispatchOrders},
  DispatchOrderDetails: {screen: DispatchOrderDetails},
  //DispatchType: {screen: DispatchType},
  RideShareHome: {screen: RideShareHome},
  RideShareConfirm: {screen: RideShareConfirm},
  RidePaymentMethod: {screen: RidePaymentMethod},
  RideOrderDetails: {screen: RideOrderDetails},
  RideOrders: {screen: RideOrders},

  Transactions: {screen: Transactions},
  Profile: {screen: Profile},
  Help: {screen: Help},
  Login: {screen: Login},
  Register: {screen: Register},
  
   
});
const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
  render () {
    return (
        /*<Provider store={store}>*/
          <AppContainer/>
        /*</Provider>*/
    )
  }
}