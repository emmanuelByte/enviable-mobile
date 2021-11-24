import React, {Component} from 'react';
import {
  AppState,
  View,
  PermissionsAndroid,
  Text,
  Alert,
  Picker,
  Image,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {SERVER_URL} from '../config/server';
import {getPreciseDistance} from 'geolib';
import { MAP_API_KEY } from '../config/keys';
export class RideConfirm extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      visible: false,
      loaderVisible: false,
      loaderVisible: false,
      latitude: false,
      longitude: false,
      origin: false,
      initialRegion: false,
      fromLatitude: '',
      toLatitude: '',
      time: '',
      distance: '',
      price: false,
      price2: false,
      price3: false,
      timeValue: false,
      vehicleTypeId: 13,
      bg1: 'rgba(231, 236, 255, 0.69)',
      // initialRegion: {
      //   latitude: 6.465422,
      //   longitude: 3.406448,
      //   latitudeDelta: 5,
      //   longitudeDelta: 5
      // },
      kekePrice: '',
      bikePrice: '',
      carPrice: '',
      carMarker: null,
      kekeMarker: null,
      bikeMarker: null
    };

    this.getLoggedInUser();
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', payload =>
        this.componentDidFocus(payload),
      ),
    ];
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  toggleUpdate() {
    if (this.state.toggleUpdate == true) {
      this.setState({
        toggleUpdate: false,
      });
    } else {
      this.setState({
        toggleUpdate: true,
      });
    }
  }

  showAlert(type, message) {
    Alert.alert(type, message);
  }

  componentDidFocus = () => {
    this.getRiders();

    //this.getLocation();
    const preciseDistance = this.calculatePreciseDistance(
      this.props.navigation.state.params.origin,
      this.props.navigation.state.params.destination,
    );

    this.setState(
      {
        origin: this.props.navigation.state.params.origin,
        destination: this.props.navigation.state.params.destination,
        coordinateDistance: this.calculatePreciseDistance(
          this.props.navigation.state.params.origin,
          this.props.navigation.state.params.destination,
        ),
        kekePrice: (preciseDistance / 1000) * 150,
        bikePrice: (preciseDistance / 1000) * 100,
        carPrice: (preciseDistance / 1000) * 250,
      },
      () => {
        var origin =
          this.state.origin.latitude + ',' + this.state.origin.longitude;
        var destination =
          this.state.destination.latitude +
          ',' +
          this.state.destination.longitude;
        this.getDistance(origin, destination);
      },
    );
  };
  getRiders() {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_riders`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        console.log(res, 'riders');
        this.hideLoader();
        if (res.success) {
          this.setState({
            riders: res.coordinates,
            bikeMarker: res.data.bike,
            kekeMarker: res.data.keke,
            carMarker: res.data.car
          });
        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(
          'Communictaion error',
          'Ensure you have an active internet connection',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Refresh', onPress: () => this.getRiders()},
          ],
          //{ cancelable: false }
        );
      });
  }

  getDistance(origin, destination) {
    console.log(this.state.origin, 'sksks');

    this.showLoader();

    fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co`,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        this.hideLoader();
        //console.log(res.rows[0].elements[0].distance.text, "distance");
        this.setState(
          {
            time: res.rows[0].elements[0].duration.text,
            timeValue: res.rows[0].elements[0].duration.value,
            distance: res.rows[0].elements[0].distance.text,
          },
          () => {
            this.getEstimatedPrice(
              res.rows[0].elements[0].duration.value,
              res.rows[0].elements[0].distance.value,
            );
          },
        );
        console.log(res, 'distance');
      })
      .catch(error => {
        this.hideLoader();
        console.error(error);
        Alert.alert(
          'Distance error',
          'Could not get distance',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Refresh', onPress: () => this.getDistance()},
          ],
          //{ cancelable: false }
        );
        return;
      });
  }

  calculatePreciseDistance(origin, destination) {
    return getPreciseDistance(origin, destination);
  }

  getEstimatedPrice(time, distance) {
    this.showLoader();
    fetch(
      `${SERVER_URL}/mobile/get_ride_share_estimated_fee/${distance}/${time}`,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.hideLoader();
        if (res.success) {
          this.setState({
            price: res.price,
            price2: res.price2,
            price3: res.price3,
          });
        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(
          'Communictaion error',
          'Ensure you have an active internet connection',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Refresh',
              onPress: () => this.getEstimatedPrice(time, distance),
            },
          ],
          //{ cancelable: false }
        );
      });
  }

  async getLoggedInUser() {
    await AsyncStorage.getItem('customer').then(value => {
      if (value) {
        this.setState(
          {
            customer: JSON.parse(value),
          },
          () => {
            this.setState({
              customer_id: this.state.customer.id,
              name:
                this.state.customer.first_name +
                ' ' +
                this.state.customer.last_name,
              phone: this.state.customer.phone1,
            });
          },
        );
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  showLoader() {
    this.setState({
      loaderVisible: true,
    });
  }

  hideLoader() {
    this.setState({
      loaderVisible: false,
    });
  }

  goToInitialRegion() {
    let initialRegion = Object.assign({}, this.state.initialRegion);
    initialRegion['latitudeDelta'] = 0.009922;
    initialRegion['longitudeDelta'] = 0.009421;
    this.mapView.animateToRegion(initialRegion, 3000);
  }
  getLocation() {}

  proceed() {
    this.props.navigation.navigate('RidePaymentMethod', {
      origin: this.state.origin,
      destination: this.state.destination,
      time: this.state.timeValue,
      distance: this.state.distance,
      vehicleTypeId: this.state.vehicleTypeId,
      //coordinate:
    });
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };
  static navigationOptions = {
    header: null,
  };

  select(id) {
    if (id == 13) {
      this.setState({
        bg1: 'rgba(231, 236, 255, 0.69)',
        bg2: '#fff',
        bg3: '#fff',
        vehicleTypeId: 13,
      });
    }
    if (id == 14) {
      this.setState({
        bg1: '#fff',
        bg2: 'rgba(231, 236, 255, 0.69)',
        bg3: '#fff',
        vehicleTypeId: 14,
      });
    }
    if (id == 15) {
      this.setState({
        bg1: '#fff',
        bg2: '#fff',
        bg3: 'rgba(231, 236, 255, 0.69)',
        vehicleTypeId: 15,
      });
    }
  }

  render() {
    const {visible} = this.state;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {this.state.origin && this.state.destination && (
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={[StyleSheet.absoluteFillObject, styles.map]}
            origin={this.state.origin}
            region={this.state.origin}
            followUserLocation={true}
            ref={ref => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}
            //onMapReady={this.goToInitialRegion.bind(this)}
            //initialRegion={this.state.initialRegion}
          >
          

          {this.state. carMarker &&
              this.state.carMarker.map((rider, index) => (
                <Marker coordinate={rider}>
                  <Image
                    source={require('../imgs/car-ico.png')}
                    style={styles.carIco}
                  />
                </Marker>
              ))}


          {this.state.bikeMarker &&
              this.state.bikeMarker.map((rider, index) => (
                <Marker coordinate={rider}>
                  <Image
                    source={require('../imgs/bike.png')}
                    style={[ styles.carIco, {width:25, height:35} ]}
                  />
                </Marker>
              ))}

          {this.state.kekeMarker &&
              this.state.kekeMarker.map((rider, index) => (
                <Marker coordinate={rider}>
                  <Image
                    source={require('../imgs/keke.png')}
                    style={[ styles.carIco, {width:25, height:25} ]}
                  />
                </Marker>
              ))}

            <Marker
              coordinate={this.props.navigation.state.params.origin}></Marker>

            {this.state.destination && (
              <Marker
                coordinate={
                  this.props.navigation.state.params.destination
                }></Marker>
            )}

            <MapViewDirections
              resetOnChange={true}
              origin={this.state.origin}
              destination={this.state.destination}
              mode="DRIVING"
              strokeColor="#0B277F"
              strokeWidth={3}
              // apikey={'AIzaSyAyQQRwdgd4UZd1U1FqAgpRTEBWnRMYz3A'}
              apikey={MAP_API_KEY}

            />
          </MapView>
        )}
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={18}
            color="#000"
            style={styles.menuImage}
          />
        </TouchableOpacity>
        <View style={styles.infoView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => this.select('13')}
              style={[{backgroundColor: this.state.bg1}, styles.row]}>
              <View style={styles.col1}>
                <Image
                  source={require('../imgs/car-1.png')}
                  style={styles.carImage}
                />
              </View>
              <View style={styles.col2}>
                <Text style={styles.price1}>Estimated price:</Text>
                {this.state.timeValue && (
                  <Text style={styles.est}>
                    {Math.ceil(this.state.timeValue / 60)} mins away.
                  </Text>
                )}
              </View>
              <View style={styles.col3}>
                <Text style={styles.pricec1}>
                  ₦
                  {this.state.carPrice &&
                    parseFloat(this.state.carPrice)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.select('14')}
              style={[{backgroundColor: this.state.bg2}, styles.row]}>
              <View style={styles.col1}>
                <Image
                  source={require('../imgs/keke.png')}
                  style={styles.kekeImage}
                />
              </View>
              <View style={styles.col2}>
                <Text style={styles.price2}>Estimated price: </Text>
                {this.state.timeValue && (
                  <Text style={styles.est}>
                    {Math.ceil(this.state.timeValue / 60)} mins away.
                  </Text>
                )}
              </View>
              <View style={styles.col3}>
                <Text style={styles.pricec}>
                  ₦
                  {this.state.kekePrice &&
                    parseFloat(this.state.kekePrice)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.select('15')}
              style={[{backgroundColor: this.state.bg3}, styles.row]}>
              <View style={styles.col1}>
                <Image
                  source={require('../imgs/bike.png')}
                  style={styles.bikeImage}
                />
              </View>
              <View style={styles.col2}>
                <Text style={styles.price3}>Estimated price:</Text>
                {this.state.timeValue && (
                  <Text style={styles.est}>
                    {Math.ceil(this.state.timeValue / 60)} mins away.
                  </Text>
                )}
              </View>
              <View style={styles.col3}>
                <Text style={styles.pricec}>
                  ₦
                  {this.state.bikePrice &&
                    parseFloat(this.state.bikePrice)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                </Text>
              </View>
            </TouchableOpacity>
            {/*this.state.timeValue && <Text style = {styles.est}>Estimated journey duration is {Math.ceil(this.state.timeValue/60)} minutes, based on current traffic info.</Text>*/}
            <TouchableOpacity
              onPress={() => this.proceed()}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Confirm ride</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.state.loaderVisible && (
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        )}
      </View>
    );
  }
}

export default RideConfirm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: '#FFF',
  },
  backImage: {
    width: 18,
    height: 12,
    marginLeft: 20,
    marginTop: 40,
  },
  header: {
    width: '100%',
    height: 110,
    backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  menuImage: {
    //width: 21,
    //height: 15,
    marginLeft: 20,
    marginTop: 69,
  },
  map: {
    height: '65%',
    width: '100%',
    bottom: -40,
  },
  infoView: {
    position: 'absolute',
    bottom: 0,
    marginTop: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    height: '35%',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 25,
    alignItems: 'center',
    //backgroundColor: 'rgba(231, 236, 255, 0.69)',
  },
  col1: {
    width: '25%',
  },
  col2: {
    width: '50%',
  },
  col3: {
    width: '25%',
  },
  carImage: {
    width: 54,
    height: 40,
    alignSelf: 'center',
    //marginTop: 15,
  },
  kekeImage: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 6,
    //marginTop: 15,
  },
  carIco: {
    width: 30,
    height: 15,
  },
  bikeImage: {
    width: 40,
    height: 25,
    alignSelf: 'center',
    paddingTop: 6,
    marginTop: 6,
    marginBottom: 10,
    //marginTop: 20,
  },
  price1: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 3,
  },
  price2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  price3: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  pricec: {
    fontWeight: 'normal',
    textAlign: 'right',
    marginTop: 5,
    paddingRight: 10,
    fontSize: 12,
  },
  pricec1: {
    fontWeight: 'normal',
    textAlign: 'right',
    marginTop: 5,
    paddingRight: 10,
    fontSize: 12,
  },
  est: {
    fontSize: 11,
    color: '#282828',
    //width: '80%',
    //alignSelf: 'center',
    //marginTop: 15,
    //textAlign: 'center',
  },
  submitButton: {
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },

  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    elevation: 2,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999999999999999999999999,
    //height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
