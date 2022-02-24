import React, { Component } from 'react';
import {
  View,
  Linking,
  Text,
  Alert,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { OpenMapDirections } from 'react-native-navigation-directions';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { PROVIDER_GOOGLE, Marker, MarkerAnimated, AnimatedRegion } from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');
import MapViewDirections from 'react-native-maps-directions';
import { Rating,  } from 'react-native-ratings';

import { SERVER_URL } from '../../config/server';
import fonts, { poppins } from '../../config/fonts';
import { MAP_VIEW_KEY } from '../../config/keys';

export class RideOrderDetails extends Component {
  constructor(props) {
    super();

    this.ratingCompleted = this.ratingCompleted.bind(this);

    this.state = {
      visible: false,
      loaderVisible: false,
      loaderVisible: false,
      order: false,
      rider: false,
      origin: false,
      destination: false,
      time: false,
      rating: 0,
      vs: false,
      rateVisible: false,
       driver: false,
      coupon_percentage:0, 
      coupon: null
 
    };
  }






  handleBackPress = () => {
    this.props.navigation.navigate('Home');
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


    this.getOrder(this.props.route.params.orderId);
    // this.getCoupon(this.props.route.params.orderId);


    setInterval(() => {
      this.updateDriverLocation(this.props.route.params.orderId);

    }, 10000)
  };

 
  getCoupon(){


    fetch(`https://api.ets.com.ng/customers/check_coupon/${this.state.coupon.toUpperCase()}/${this.state.customer.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.hideLoader();

        if (res.success && res.coupon.amount >0) {

          this.setState({
            coupon_percentage: (res.coupon.amount * 100),
            color: 'green',
            coupon_id: res.coupon.id
          });
        
          // Alert.alert('Error', res.error);
        }
      })
      .catch(error => {
        console.log('Error on ACTIVITING coupon')
      });
    

    this.hideLoader()
  }


  getDistance(origin, destination) {

    fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co`,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        this.hideLoader();
        this.setState({
          time: res.rows[0].elements[0].duration.text,
        });
      })
      .catch(error => {
        this.hideLoader();

        Alert.alert(
          'Distance error',
          'Could not get distance',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Refresh',
              onPress: () => this.getDistance(origin, destination),
            },
          ],
        );
        return;
      });
  }

  updateDriverLocation(orderId) {
    fetch(`${SERVER_URL}/mobile/get_ride_share_order/${orderId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {

        if (res.success) {
          if (res.rider.longitude != null) {

            var origin =
              JSON.parse(res.rider.latitude) +
              ',' +
              JSON.parse(res.rider.longitude);

          }
          else {
            var origin =
              JSON.parse(res.order.pickup_latitude) +
              ',' +
              JSON.parse(res.order.pickup_longitude);

          }

          var destination =
            JSON.parse(res.order.delivery_latitude) +
            ',' +
            JSON.parse(res.order.delivery_longitude);

          this.getDistance(origin, destination);

          if (res.rider.longitude != null) {
            if (this.marker) {
              let newCoordinate = {
                longitude: parseFloat(res.rider.longitude), latitude: parseFloat(res.rider.latitude)
              }
              this.marker.animateMarkerToCoordinate(newCoordinate, 1000);
            }

            this.setState({
              order: res.order,
              rider: res.rider,

            });
          }


        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch(error => {

        Alert.alert(
          'Communictaion error',
          'Ensure you have an active internet connection',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Refresh', onPress: () => this.updateDriverLocation(orderId) },
          ],
        );
      });
  }

  getOrder(orderId) {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_ride_share_order/${orderId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {

        this.hideLoader();
        if (res.success) {
          var origin =
            JSON.parse(res.order.pickup_latitude) +
            ',' +
            JSON.parse(res.order.pickup_longitude);
          var destination =
            JSON.parse(res.order.delivery_latitude) +
            ',' +
            JSON.parse(res.order.delivery_longitude);
          this.getDistance(origin, destination);
          var origin = {
            latitude: JSON.parse(res.order.pickup_latitude),
            longitude: JSON.parse(res.order.pickup_longitude),
            latitudeDelta: 0.009922,
            longitudeDelta: 0.009421,
          };
          var destination = {
            latitude: JSON.parse(res.order.delivery_latitude),
            longitude: JSON.parse(res.order.delivery_longitude),
            latitudeDelta: 0.009922,
            longitudeDelta: 0.009421,
          };

          if (res.rider.longitude != null) {
            this.setState({
              order: res.order,
              rider: res.rider,
              origin: origin,
              destination: destination,
               coupon: res.coupon
 


            });
          }
          else {
            this.setState({
              order: res.order,
              rider: res.rider,
              origin: origin,
              destination: destination,
               coupon:res.coupon


            });
          }


        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch(error => {

        Alert.alert(
          'Communictaion error',
          'Ensure you have an active internet connection',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Refresh', onPress: () => this.getOrder(orderId) },
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
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }
  ratingCompleted(rating) {
    this.setState({
      rating: rating,
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
  use() {


    const startPoint = {
      latitude: parseFloat(this.state.order.pickup_latitude),
      longitude: parseFloat(this.state.order.pickup_longitude),
    }

    const endPoint = {
      latitude: parseFloat(this.state.order.delivery_latitude),
      longitude: parseFloat(this.state.order.delivery_longitude),
    }

    const transportPlan = 'w';
    if (this.state.order.status == "Rider accepted") {
      OpenMapDirections(startPoint, endPoint, transportPlan).then(res => {

      });

    }
  }

  changeStatus(status) {

    this.showLoader();
    fetch(
      `${SERVER_URL}mobile/cancel_ride_share/${this.state.order.id}/${this.state.customer.id}/rider_cancelled_order`,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {

        this.hideLoader();
        if (res.success) {
          this.getOrder(this.props.route.params.orderId);
          this.showAlert('Success', res.success);
        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch(error => {
        this.hideLoader();

        this.showAlert('Error', 'An unexpected error occured');
      });
  }

  displayButton() {
    if (
      this.state.order.status == 'Looking for rider' ||
      this.state.order.status == 'Rider accepted' ||
      this.state.order.status == 'Rider arrived at location' ||
      this.state.order.status == 'Ride started'
    )
      return (
        <TouchableOpacity
          onPress={() => this.changeStatus('cancel')}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>End ride</Text>
        </TouchableOpacity>
      );
  }

  displayRatingButton() {

    if (
      this.state.order &&
      this.state.order.status == 'Ride completed' &&
      this.state.order.rated == 'No'
    ) {
      return (
        <View>
          <TouchableOpacity
            style={styles.addView7}
            onPress={() => this.setState({ rateVisible: true })}>
            <Text style={styles.est1}>Rate this driver? </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (
      this.state.order &&
      this.state.order.status == 'Ride completed'
    ) {
    } else {
      return (
        <Text style={styles.est}>
          Estimated journey duration is{' '}
          {Math.ceil(this.state.order.estimated_time / 60)} minutes, based on
          current traffic info.{' '}
          {this.state.time && 'Arrival of ride will take ' + this.state.time}
        </Text>
      );
    }
  }
  rateRider() {
    if (this.state.rating === 0) {
      Alert.alert('One more thing', 'Please rate your driver.');
      return;
    }
    this.setState({
      rateVisible: false,
    });
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rateRider`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.customer.id,
        orderId: this.state.order.id,
        type: 'Ride-share',
        rating: this.state.rating,
        review: this.state.review,
      }),
    })
      .then(response => response.json())
      .then(res => {

        this.getOrder(this.state.order.id);
        this.hideLoader();
        if (res.success) {
          Alert.alert('Success', res.success);
        } else {
          this.showAlert('Error', res.error);
        }
      }).catch(err => console.log('rate driver error', err))
      .done();
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

  render() {
    const { visible } = this.state;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {this.state.origin && this.state.destination && (
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={[StyleSheet.absoluteFill, styles.map]}
            origin={this.state.origin}
            region={this.state.origin}
            followUserLocation={true}
            ref={ref => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}



          >
            <Marker coordinate={this.state.origin}></Marker>
            {
              this.state.driver !== false ? (
                <MarkerAnimated
                  ref={marker => {
                    this.marker = marker;
                  }}
                  coordinate={{
                    longitude: this.state.driver.longitude,
                    latitude: this.state.driver.latitude
                  }}

                >
                  <Image style={{ width: 35, height: 15 }} source={require('../../images/car-ico.png')} />
                </MarkerAnimated>
              )
                : null
            }

            <Marker coordinate={this.state.destination}></Marker>
            <MapViewDirections
              resetOnChange={true}
              origin={this.state.origin}
              destination={this.state.destination}
              mode="DRIVING"
              strokeColor="brown"
              strokeWidth={3}
              apikey={MAP_VIEW_KEY}

            />
          </MapView>
        )}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Dashboard')}>
          <Icon
            name="arrow-back"
            size={30}
            color="#000"
            style={styles.menuImage}
          />
        </TouchableOpacity>

        <View style={styles.infoView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.order && (
              <View>
                <TouchableOpacity onPress={() => this.use()}>
                  <Text style={styles.use}>Use google navigation</Text>

                </TouchableOpacity>
                {this.state.rider && (
                  <View style={styles.row}>
                    <View style={styles.col1}>
                      <Image
                        source={{ uri: SERVER_URL + this.state.rider.photo }}
                        style={styles.carImage}
                      />
                      <View style={styles.rView}>
                        <Text style={styles.rText}>
                          {this.state.rider.rating}{' '}
                          <Text style={styles.sText}>* </Text>
                        </Text>
                      </View>
                    </View>
                    <View style={styles.col2}>
                      <Text style={styles.price}>
                        {this.state.rider.first_name}{' '}
                        {this.state.rider.last_name}
                      </Text>
                      <Text style={styles.plate}>
                        {this.state.rider.car_description}{' '}
                      </Text>
                      <Text style={styles.plate}>
                        {this.state.rider.plate_no}{' '}
                      </Text>
                    </View>
                  </View>
                )}
                {!this.state.rider && (
                  <View style={styles.row}>
                    <View style={styles.col1}>
                      <Image
                        source={require('../../images/round-profile.png')}
                        style={styles.carImage}
                      />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                      <Text style={styles.price}>XXXXX XXXXX</Text>
                      <Text style={styles.plate}>XXXXX</Text>
                    </View>
                  </View>
                )}

                {this.state.rider ? <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('tel:' + this.state.rider.phone1)
                  }
                  style={styles.row1}>
                  <View style={styles.col11}>
                    <Image
                      source={require('../../images/pho.png')}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={styles.col21}>
                    <Text style={styles.price1}>{this.state.rider.phone1} Call driver </Text>
                  </View>
                  <View style={styles.col22}>
                    {this.state.order.price && (
                       <View>
                      <Text style={styles.price2}>
                        Pay: ₦
                        {this.state.coupon?
                          parseFloat(this.state.order.price - (this.state.order.price*this.state.coupon.discount/100) )
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                      :
                      parseFloat(this.state.order.price)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                      }
                    {"\n"}
                    <Text style={{textDecorationLine:'line-through'}}>₦{parseFloat(this.state.order.price)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                      }</Text>
                        {/* {} */}

                      </Text>
                      <Text style={[styles.price2, {color:'green',fontSize:10}]}>
                        {this.state.coupon ?'Coupon Discount Applied!':null}
                        
                      </Text>
                      </View>
                      
  
                    )}
                  </View>
                </TouchableOpacity>
                  : null
                }
                <View style={styles.statusView}>
                  <Text style={styles.statusText}>
                    {this.state.order.status}
                  </Text>
                </View>
                {this.displayRatingButton()}

                {this.displayButton()}
              </View>
            )}
          </ScrollView>
        </View>
        <Modal
          isVisible={this.state.rateVisible}
          onBackdropPress={() => {
            this.setState({ rateVisible: false });
          }}
          onBackdropPress={() => {
            this.setState({ rateVisible: false });
          }}
          height={'100%'}
          width={'100%'}
          style={styles.modal}>
          <View style={styles.rateModalView}>

            {this.state.rider && (
              <Image
                source={{ uri: SERVER_URL + this.state.rider.photo }}
                style={styles.rImage}
              />
            )}

            {this.state.rider && (
              <Text style={styles.headerText7}>
                {this.state.rider.first_name} {this.state.rider.last_name}
              </Text>
            )}
            <Rating
              startingValue={0}
              ratingColor={'#0B277F'}
              ratingBackgroundColor={'#0B277F'}
              imageSize={20}
              showRating={false}
              onFinishRating={this.ratingCompleted}
              style={{ paddingVertical: 10 }}
            />
            <TextInput
              style={styles.input}
              onChangeText={text => {
                this.setState({ review: text });
              }}
              underlineColorAndroid="transparent"
              placeholder={'Leave a review'}


              multiline={true}
              value={this.state.review}
            />

            <TouchableOpacity
              style={styles.addView3}
              onPress={() => this.rateRider()}>
              <Text style={styles.addText}>Rate rider </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {this.state.loaderVisible && (
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        )}
      </View>
    );
  }
}

export default RideOrderDetails;

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
    marginTop: 39,
  },
  map: {
    height: '100%',
    width: '100%',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  input: {
    width: '90%',

    height: 80,
    backgroundColor: 'rgba(126,83,191, 0.1)',
    borderRadius: 7,


    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 15,
    color: '#444',
  },
  infoView: {
    position: 'absolute',
    bottom: 0,
    marginTop: -30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    height: '46%',
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  col1: {
    width: '30%',
  },
  carImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 15,
  },
  statusView: {
    backgroundColor: '#E9FBFF',
    padding: 20,
  },
  statusText: {
    color: '#8D9092',
    fontFamily: poppins
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 13,
    fontFamily: fonts.poppins.bold,

  },
  price2: {
    fontSize: 14,
    textAlign: 'right',


    marginTop: 2,
    fontFamily: fonts.poppins.regular,

  },
  plate: {
    fontSize: 12,
    color: '#848484',


    fontFamily: poppins
  },
  est: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: poppins,
    fontSize: 12,

  },
  est1: {
    width: '100%',
    alignSelf: 'flex-end',
    marginTop: 15,
    marginLeft: 20,
    color: '#282828',
    textAlign: 'right',
    fontFamily: poppins
  },
  use: {
    color: '#0B277F',
    textAlign: 'right',
    paddingRight: 20,
  },
  rView: {
    backgroundColor: '#0B277F',
    width: 35,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 4,
  },
  rText: {
    fontFamily: poppins,
    color: '#fff',
    textAlign: 'center',
    fontSize: 9,
    paddingLeft: 6,
  },
  sText: {



    paddingTop: 10,

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
    fontFamily: poppins
  },

  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },

  row1: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 9999999999,
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 15,
  },
  col11: {
    width: '5%',
  },
  col21: {
    width: '35%',
  },
  col22: {
    width: '60%',
  },
  ccImage: {
    width: 160,
    height: 150,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 15,
  },
  price1: {
    fontSize: 14,
    marginTop: 3,
    paddingLeft: 10,
  },
  cardImage: {
    width: 20,
    height: 20,

    marginTop: 3,
  },






  label1: {
    color: '#333',
    marginTop: 15,

    textAlign: 'center',
  },
  rateModalView: {



    alignSelf: 'center',
    height: 340,
    width: '90%',
    marginRight: '10%',
    backgroundColor: '#FFF',
    paddingTop: 18,
    paddingBottom: 38,
  },
  headerText7: {
    color: '#333',
    fontWeight: '700',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  rImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 15,
  },
  headerText8: {
    color: '#333',
    paddingLeft: 20,
    fontSize: 12,
  },
  addView3: {
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  addText: {
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    width: '100%',
    height: 40,
    backgroundColor: '#EFF0F3',
    borderRadius: 8,
    marginTop: -5,
    color: '#aaa',
  },
  inputIOS: {
    width: '100%',
    height: 40,
    borderColor: '#777',
    borderRadius: 8,
    marginTop: -5,
    color: '#aaa',
  },
});
