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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {SERVER_URL} from '../../config/server';
import {getPreciseDistance} from 'geolib';
import { MAP_API_KEY } from '../config/keys';
import { MAP_VIEW_KEY } from '../../config/keys';
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
       
       
       
       
       
       
      kekePrice: '',
      bikePrice: '',
      carPrice: '',
      carMarker: null,
      kekeMarker: null,
      bikeMarker: null
    };

  }

   
   
   
   

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentDidMount() {
     
    this.componentDidFocus();

     
     
     
     
     
     
     
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
    this.getLoggedInUser();
    fetch(SERVER_URL+'/app/trip_settings', {method:'GET'})
    .then((v)=>v.json())
    .then(v=>{
      console.log(v, "v from prices")
      this.getRiders();

     
      const preciseDistance = this.calculatePreciseDistance(
        this.props.route.params.origin,
        this.props.route.params.destination,
      );
  
      console.log(preciseDistance, 'preciwsedistance')
      this.setState(
        {
          origin: this.props.route.params.origin,
          destination: this.props.route.params.destination,
          coordinateDistance: this.calculatePreciseDistance(
            this.props.route.params.origin,
            this.props.route.params.destination,
          ),
          kekePrice: (preciseDistance / 1000) * v['14']['pricePerKm'],
          bikePrice: (preciseDistance / 1000) * v['15']['pricePerKm'],
          carPrice: (preciseDistance / 1000) * v['13']['pricePerKm'],
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



    })
 

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
           
        );
      });
  }

  getDistance(origin, destination) {
    console.log(this.state.origin, 'sksks');

    this.showLoader();
    console.log(origin,destination, "destination origin combo")
    fetch(
       
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co`,

       
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        this.hideLoader();
         
        console.log(res.rows[0].elements[0].distance.text, "distance");
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
        console.error(error, "error here");
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
            provider={PROVIDER_GOOGLE}  
            style={[StyleSheet.absoluteFillObject, styles.map]}
            origin={this.state.origin}
            region={this.state.origin}
            followUserLocation={true}
            ref={ref => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}
             
             
          >
          

          {this.state. carMarker &&
              this.state.carMarker.map((rider, index) => (
                <Marker key={index} coordinate={rider}>
                  <Image
                    source={require('../../images/car-ico.png')}
                    style={styles.carIco}
                  />
                </Marker>
              ))}


          {this.state.bikeMarker &&
              this.state.bikeMarker.map((rider, index) => (
                <Marker key={index} coordinate={rider}>
                  <Image
                    source={require('../../images/bike.png')}
                    style={[ styles.bikeImage ]}
                  />
                </Marker>
              ))}

          {this.state.kekeMarker &&
              this.state.kekeMarker.map((rider, index) => (
                <Marker key={index} coordinate={rider}>
                  <Image
                    source={require('../../images/keke.png')}
                    style={[styles.kekeImage]}
                  />
                </Marker>
              ))}

            <Marker
              coordinate={this.props.route.params.origin}></Marker>

            {this.state.destination && (
              <Marker
                coordinate={
                  this.props.route.params.destination
                }></Marker>
            )}

            <MapViewDirections
              resetOnChange={true}
              origin={this.state.origin}
              destination={this.state.destination}
              mode="DRIVING"
              strokeColor="#0B277F"
              strokeWidth={3}
              apikey={MAP_VIEW_KEY}
               

            />
          </MapView>
        )}
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={30}
            color="#000"
            style={styles.menuImage}
          />
        </TouchableOpacity>
        <View style={styles.infoView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding:10}}>
              <Text style={{ fontSize:10, textAlign:'center', fontWeight:'bold'}}>The price is estimated and may change by the end of the trip</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.select('13')}
              style={[{backgroundColor: this.state.bg1}, styles.row]}>
              <View style={styles.col1}>
                <Image
                  source={require('../../images/car-1.png')}
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
                  source={require('../../images/keke.png')}
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
                  source={require('../../images/bike.png')}
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
     
     
    marginLeft: 20,
    marginTop: 30,
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
    height: '40%',
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
     
  },
  kekeImage: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 6,
     
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
     
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
