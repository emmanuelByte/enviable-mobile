import React, { Component } from 'react';
<<<<<<< HEAD
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DBC2Exit from './src/SharedComponents/DBC2Exit';
import { Provider } from 'react-redux';
import store from "@src/redux/index"
=======
import { AppRegistry, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, Platform, StyleSheet, Text, View, TouchableOpacity,AsyncStorage } from 'react-native';
import {name as appName} from './app.json';

import Initial from './src/Initial';
import Login from './src/Login';
import PhoneRegistration from './src/PhoneRegistration';
import Hires from './src/Hires';
import SpecialMovement from './src/SpecialMovement';
import HireDetails from './src/HireDetails';
import SpecialMovementDetails from './src/SpecialMovementDetails';
import VerifyPhone from './src/VerifyPhone';
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
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3

import Main from './src/pages/Main';
console.disableYellowBox = true;


class App extends Component {
  state = {}
  constructor() {
    super()
    this.state = {
      decider: false
    }
  }

<<<<<<< HEAD
 

=======
  PhoneRegistration: {screen: PhoneRegistration},
  VerifyPhone: {screen: VerifyPhone},
  Hires: {screen: Hires},
  SpecialMovement: {screen: SpecialMovement},
  SpecialMovementDetails: {screen: SpecialMovementDetails},
  HireDetails: {screen: HireDetails},
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
  RideShareHome: {screen: RideShareHome},
  RideShareConfirm: {screen: RideShareConfirm},
  RidePaymentMethod: {screen: RidePaymentMethod},
  RideOrderDetails: {screen: RideOrderDetails},
  RideOrders: {screen: RideOrders},

  Transactions: {screen: Transactions},
  Profile: {screen: Profile},
  Help: {screen: Help},
  Login: {screen: Login},
  
   
});
const AppContainer = createAppContainer(MainNavigator);
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3


  render() {
    return (
<<<<<<< HEAD
        <>
          <DBC2Exit />
          <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
          <Provider store={store}>
            <NavigationContainer>
              <Main/>
            </NavigationContainer>
          </Provider>
        </>
=======
          <AppContainer/>
>>>>>>> 903f9b87122853ce6284a0e96660933e243c0ae3
    )
  }
}


export default App