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
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import PaystackWebView from 'react-native-paystack-webview';

import {SERVER_URL} from '../../config/server';
import fonts, { poppins } from '../../config/fonts';

export class RidePaymentMethod extends Component {
  constructor(props) {
    super();
     
    this.state = {
       coupon_status: null,
 
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
      price: '',
      timeValue: false,
      paymentMethod: '',
      userCards: [],
      coupon:'',
      color:'black',
      coupon_id: null  
 
    };
    this.getLoggedInUser();
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
     
    this.setState(
      {
        origin: this.props.route.params.origin,
        destination: this.props.route.params.destination,
        distance: this.props.route.params.distance,
        time: this.props.route.params.time,
        vehicleTypeId: this.props.route.params.vehicleTypeId,
      },
      () => {},
    );
  };

  getUserCards() {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_user_cards/${this.state.customer.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.hideLoader();
        console.log(res, 'kkk');
        if (res.success) {
          this.setState({
            userCards: res.user_cards,
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
            {text: 'Refresh', onPress: () => this.getUserCards()},
          ],
           
        );
      });
  }
  removeCard() {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/remove_user_card/${this.state.customer.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.hideLoader();
        console.log(res, 'kkk');
        if (res.success) {
          this.getUserCards();
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
            {text: 'Try again', onPress: () => this.removeCard()},
          ],
           
        );
      });
  }

  submit(paymentMethod) {
    this.showLoader();

    fetch(`${SERVER_URL}/mobile/place_ride_share_order`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.customer.id,
        pickup_address: this.state.origin.address,
        pickup_longitude: this.state.origin.longitude,
        pickup_latitude: this.state.origin.latitude,
        vehicleTypeId: this.state.vehicleTypeId,
        delivery_address: this.state?.destination?.address,
        delivery_longitude: this.state?.destination?.longitude,
        delivery_latitude: this.state?.destination?.latitude,
        paymentMethod: paymentMethod,
        distance: this.state.distance,
        time: this.state.time,
        coupon_id: this.state.coupon_id
 
      }),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.hideLoader();
        if (res.success) {
          console.log(res.success);
          this.setState(
            {
              orderId: res.order_id,
            },
            () => {
              this.showAlert('Success', res.success);

              this.props.navigation.navigate('RideOrderDetails', {
                orderId: res.order_id,
              });
            },
          );
        } else {
          console.log(res.error, 'req');
        }
      })
      .done();
  }

  verifyTransaction() {
    console.log(this.state.trn_ref, 'this.state.trn_ref');
    this.showLoader();

    fetch(`${SERVER_URL}/mobile/verify_transaction`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.customer.id,
        reference: this.state.trn_ref,
      }),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.hideLoader();
        if (res.success) {
          this.showAlert('success', res.success);
          this.getUserCards();
          this.openPayModal();
        } else {
          this.showAlert('Error', res.error);
        }
      })
      .done();
  }

  async getLoggedInUser() {
    await AsyncStorage.getItem('customer').then(value => {
      if (value) {
        this.setState(
          {
            customer: JSON.parse(value),
          },
          () => {
            this.setRef();
            this.getUserCards();
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
  setRef() {
    this.setState({
      trn_ref: Math.floor(1000000000 + Math.random() * 9000000000),
    });
  }

  openPayModal() {
    this.setState({
      forgotVisible: true,
    });
  }

  proceed() {
    if (this.state.fromLatitude == '') {
      this.showAlert('Info', 'Kindly provide a pickup address');
      return;
    } else if (this.state.toLatitude == '') {
      this.showAlert('Info', 'Kindly provide a destination address');
      return;
    } else {
    }
  }

  formatCoupon = (textValue) => {
    this.setState({ coupon: textValue.toUpperCase() });
  }

  displayPayButton() {
    if (this.state.customer && this.state.userCards.length == 0) {
      return (
        <View style={styles.row}>
          <View style={styles.col1}>
            <Image
              source={require('../../images/card.png')}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.col2}>
            <PaystackWebView
              buttonText="Add your credit/debit card"
              textStyles={styles.price}
               
              showPayButton={true}
              paystackKey="pk_live_6b3b23bc38a669799804cdc53316494a4678dcdb"
              amount={10}
              billingEmail={this.state.customer.email}
              billingMobile={this.state.customer.phone1}
              billingName={this.state.customer.first_name}
              refNumber={this.state.trn_ref}
              ActivityIndicatorColor="green"
              handleWebViewMessage={e => {
                 
                 
                console.log(e);
              }}
              onCancel={e => {
                 
                this.setRef();
                console.log(e);
              }}
              onSuccess={e => {
                console.log(e);
                console.log(e.transactionRef.transaction, 'dkksk');
                this.setState(
                  {
                    reference: e.transactionRef.transaction,
                  },
                  () => {
                    this.verifyTransaction();
                  },
                );
              }}
              autoStart={false}
            />
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.openPayModal()}
          style={styles.row}>
          <View style={styles.col1}>
            <Image
              source={require('../../images/card.png')}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.col1}>
            <Text style={styles.price}>Pay with card</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  applyCoupon(){
    this.showLoader();
    // alert(this.state.coupon);
    this.setState({coupon_status:'Checking coupon validity...'});
    console.log(`https://api.ets.com.ng/customers/check_coupon/${this.state.coupon.toUpperCase()}/${this.state.customer.id}`);
    fetch(`https://api.ets.com.ng/customers/check_coupon/${this.state.coupon.toUpperCase()}/${this.state.customer.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.hideLoader();

        if (res.success) {

          this.setState({
            coupon_status: 'Coupon Applied',
            color: 'green',
            coupon_id: res.coupon.id
          });
        } else {
          this.setState({
            coupon_status: 'Coupon expired',
          });
          // Alert.alert('Error', res.error);
        }
      })
      .catch(error => {
        console.error(error+'errorf');
        Alert.alert(
          'Communictaion error',
          'Ensure you have an active internet connection',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Refresh', onPress: () => this.getUserCards()},
          ],
           
        );
      });
    

    this.hideLoader()
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
    const {visible} = this.state;
    return (
      <ScrollView style={styles.body}>
      <KeyboardAvoidingView >
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={25}
            color="#000"
            style={styles.menuImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>How would you like to pay?</Text>
        <Image source={require('../../images/cc.png')} style={styles.ccImage} />
        {this.state.userCards && this.displayPayButton()}
        <TouchableOpacity
          onPress={() => this.submit('Pay with cash')}
          style={styles.row}>
          <View style={styles.col1}>
            <Image
              source={require('../../images/cash.png')}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.col2}>
            <Text style={styles.price}>Pay with cash</Text>
          </View>
        </TouchableOpacity>


        <View style={[styles.rowCoupon]}>
           <TextInput 
      onChangeText={textValue => this.formatCoupon(textValue)}
      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
      returnKeyLabel={"Send"}
      returnKeyType={"go"}
      
      value={this.state.coupon} placeholder='Apply Coupon code' style={{color:'#0B277F', fontSize:12, fontFamily:poppins, height:'90%', flex:8}} placeholderTextColor="grey" />

        <TouchableOpacity onPress={()=>this.applyCoupon()} style={{flex:4,  borderRadius:10}}>
            <Text style={{textAlign:'center',  color:'#0B277F',fontSize:10, fontFamily:fonts.poppins.bold}}>APPLY COUPON</Text>

            </TouchableOpacity>
         

        </View>
     
        <Text style={{textAlign:'center', marginTop:20, color:this.state.color, }}>
              {this.state.coupon_status}
          </Text>
        

        {this.state.loaderVisible && (
          <View  style={styles.loading}>
          <ActivityIndicator size="large" color="black" />

          </View>

        )}

        <Modal
          isVisible={this.state.forgotVisible}
          onBackdropPress={() => {
            this.setState({forgotVisible: false});
          }}
          height={'100%'}
          width={'100%'}
          style={styles.modal}>
          <View style={styles.forgotModalView}>
            <Text style={styles.headerText7}>
              Would you like to pay with this card?
            </Text>
            {this.state.userCards &&
              this.state.userCards.map((userCard, index) => (
                <View>
                  <View style={styles.statusView}>
                    <Text style={styles.text}>
                      {userCard.authorization.bin}******
                      {userCard.authorization.last4}
                    </Text>
                  </View>
                  <View style={styles.row4}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({forgotVisible: false}, () => {
                          this.removeCard();
                        });
                      }}
                      style={styles.submitButton2}>
                      <Text style={styles.submitButtonText}>Change card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({forgotVisible: false}, () => {
                          this.submit('Pay with card');
                        });
                      }}
                      style={styles.submitButton1}>
                      <Text style={styles.submitButtonText}>Choose</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </Modal>
      </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export default RidePaymentMethod;

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
    marginTop: 49,
  },
  map: {
    height: '65%',
    width: '100%',
  },
  infoView: {
    position: 'absolute',
    bottom: 0,
    marginTop: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    height: '36%',
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  rowCoupon: {
    width: '90%',
    // alignContent:'center',
    alignItems:'center',
    flexDirection: 'row',
    paddingLeft: 20,
    alignSelf: 'center',

    paddingHorizontal:10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    borderColor:'#0B277F', borderWidth:1, height:60, paddingVertical:0
  },
  row4: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
     
    backgroundColor: '#fff',
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  col1: {
    width: '15%',
    fontFamily:poppins
  },
  ccImage: {
    width: 200,
    height: 121,
    alignSelf: 'center',
    marginTop: '15%',
    marginBottom: '20%',
  },
  price: {
    fontSize: 14,
     
     
    paddingLeft: 10,
    fontFamily:poppins

  },
  cardImage: {
    width: 32,
    height: 20,
    alignSelf: 'center',
     
  },
  est: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
     
  },
  submitButton: {
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },

  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 8,
    color: '#000',
    fontFamily:poppins
  },

  modal: {
    margin: 0,
    padding: 0,
  },
  modalView: {
     
     
     
    alignSelf: 'center',
    height: 50,
    width: 100,
    backgroundColor: '#FFF',
    paddingTop: 18,
  },
  label: {
    color: '#4B4A4A',
    marginTop: 15,
    paddingLeft: 30,
  },
  label1: {
    color: '#333',
    marginTop: 15,
    paddingLeft: 20,
  },
  headerText7: {
    color: '#333',
     
     
    marginTop: 5,
    fontSize: 14,
    fontFamily:poppins

  },
  statusView: {
    backgroundColor: '#E9FBFF',
    marginTop: 20,
    padding: 20,
  },
  forgotModalView: {
     
     
     
    alignSelf: 'center',
    height: 280,
    width: '90%',
    backgroundColor: '#FFF',
    padding: 18,
  },
  submitButton1: {
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 2,
    width: '50%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  submitButton2: {
    marginTop: 20,
    backgroundColor: 'brown',
    borderRadius: 2,
    width: '48%',
    marginRight: 10,
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
    height:'100%',
    top: 0,
    bottom: 0,
    

    zIndex: 9999999999999999999999999,
     
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(1,1,1,0.5)',

  },
});
