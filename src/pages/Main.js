import React, {Component} from 'react';
import {Alert} from 'react-native';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import SplashScreen from 'react-native-splash-screen';

import {connect} from 'react-redux';
import {setUser} from '@src/redux/slices/userSlice';
import Route from './Routes/Route';
import ProtectedRoute from './Routes/ProtectedRoute';
import {SafeAreaView} from 'react-native-safe-area-context';
console.disableYellowBox = true;

class Main extends Component {
  state = {};
  constructor() {
    super();
    this.state = {
      decider: false,
    };
  }

  async getLoggedInUser(token) {
    try {
      const customer = await AsyncStorage.getItem('customer');
      let customer$ = JSON.parse(customer);

      if (customer$ === null) {
        this.props.dispatch(setUser({user: customer$, status: false}));
      } else {
        this.props.dispatch(setUser({user: customer$, status: true}));
      }
    } catch (error) {
      console.log(error, 'bass errpr');
    }
  }

  isAppOutdated() {
    fetch(`https://api.ets.com.ng/app_version`, {
      method: 'GET',
    })
      .then(a => a.json())
      .then(b => {
        var pkg = require('../../package.json');
        // console.log(pkg?.app_version);
        // console.log(pkg.version);
        if (
          Platform.OS === 'android' &&
          pkg?.app_version.android < b?.version.android
        ) {
          console.log(pkg?.app_version.android, b.version.android);
          Alert.alert(
            'New Updates Available',
            'Update your app to the latest version to enjoy latest features',
          );
        }
        if (Platform.OS === 'ios' && pkg?.app_version.ios < b.version.ios) {
          console.log(pkg?.app_version.android, b.version.android);
          Alert.alert(
            'New Updates Available',
            'Update your app to the latest version to enjoy latest features',
          );
        }
      })
      .catch(e => console.log(e, 'Something wetnt wrong'));
  }

  async componentDidMount() {
    await this.getLoggedInUser();
    this.isAppOutdated();
    SplashScreen.hide();
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.props.user.status === false ? <Route /> : <ProtectedRoute />}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {user: state.user, ...ownProps};
};

export default connect(mapStateToProps)(Main);
