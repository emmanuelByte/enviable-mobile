import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DBC2Exit from './src/SharedComponents/DBC2Exit';
import { Provider } from 'react-redux';
import store from "@src/redux/index"

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

 



  render() {
    return (
        <>
          <DBC2Exit />
          <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
          <Provider store={store}>
            <NavigationContainer>
              <Main/>
            </NavigationContainer>
          </Provider>
        </>
    )
  }
}


export default App