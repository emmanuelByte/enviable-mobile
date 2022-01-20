import 'react-native-gesture-handler';
import React, {PureComponent} from 'react';
import {
  Text,
  StyleSheet,
  BackHandler,
  Animated,
  Dimensions,
} from 'react-native';
import fonts from '@src/config/fonts';

let { height } = Dimensions.get('window');


class DBC2Exit extends PureComponent {
  state = {
    backClickCount: 0,
  };

  constructor(props) {
    super(props);

    this.springValue = new Animated.Value(100);
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  _spring() {
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(this.springValue, {
          toValue: -0.15 * height,
          friction: 5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(this.springValue, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }

  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
    return true;
  };

  render() {
    return (
      <>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: this.springValue}]},
          ]}>
          <Text style={styles.exitTitleText}>Press back again to exit</Text>
        </Animated.View>
      </>
    );
  }
}

export default DBC2Exit;

const styles = StyleSheet.create({
   
  animatedView: {
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    position: 'absolute',
    width: '50%',
    bottom: 0,
    padding: 10,
    fontSize: 10,
    marginHorizontal: '25%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
  },
  exitTitleText: {
    fontFamily: fonts.poppins.regular,
    fontSize: 10,
    textAlign: 'center',
    color: 'black',
    marginRight: 10,
  },
  exitText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 10,
    color: '#e5933a',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
