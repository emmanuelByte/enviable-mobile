import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import DBC2Exit from './src/SharedComponents/DBC2Exit';
import {Provider} from 'react-redux';
import store from '@src/redux/index';
navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');
import codePush from 'react-native-code-push';

import Main from './src/pages/Main';
console.disableYellowBox = true;

// let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};
class App extends Component {
  state = {};
  constructor() {
    super();
    this.state = {
      decider: false,
    };
  }

  render() {
    return (
      <>
        <DBC2Exit />
        <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
        <Provider store={store}>
          <NavigationContainer>
            <Main />
          </NavigationContainer>
        </Provider>
      </>
    );
  }
}

export default codePush(App);
// export default codePush(codePushOptions)(App);
