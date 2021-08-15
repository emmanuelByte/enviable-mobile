import React, { Component  } from 'react';
import { AppState, View, Text, Picker, CheckBox, Alert, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { SERVER_URL } from '../config/server';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');
import RNPickerSelect from 'react-native-picker-select';

export class EatDeliveryAddress extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      loaderVisible: false,
      forgotVisible: false,
      name: '',
      phone: '',
      city: '',
      cityId: '',
      address: '',
      cities: false,
      locationPlaceholder: '',
      visible1: false,
      latitude: '',
      longitude: '',
      email: '',
      password: '',
      customer: false,
      email1: '',
      payWithWallet: true,
      payWithCard: false,
      useAddress: false,
      useAddress1: false,
      vehicleTypeId: 1,
      vs: false,
    }
    this.getLoggedInUser();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    Alert.alert(
      "Confirm exit",
      "Are you sure you want to exit this app?",
      [
        {
          text: "Stay here",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      //{ cancelable: false }
    );
    return true
  }

  componentDidMount() {
    this.getCities();
    //this.getVehicleTypes();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  toggleUpdate(){
    if(this.state.toggleUpdate == true){
      this.setState({
        toggleUpdate: false
      })
    }else{
      this.setState({
        toggleUpdate: true
      })
    }
  }
  showAlert(type, message){
    Alert.alert(
      type,
      message,
    );
  }

  async getLoggedInUser(){
    await AsyncStorage.getItem('customer').then((value) => {
      if(value){
        this.setState({
          customer: JSON.parse(value)
        }, () => {
          this.setState({
            customer_id: this.state.customer.id,
            //name: this.state.customer.first_name +" "+ this.state.customer.last_name,
            //phone: this.state.customer.phone1,
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }
  showLoader(){
    this.setState({
      loaderVisible: true
    });
  }
  hideLoader(){
    this.setState({
      loaderVisible: false,
    });
  }
  
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  static navigationOptions = {
      header: null
  }

  getCities(){
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_cities`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader(); 
       console.log(res, "cities");
       //this.hideLoader();
       if(res.success){
          this.setState({
            cities:  res.cities
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getCities() }
       ],
       //{ cancelable: false }
     );
    });
  }
  submit(){
    if(this.state.cityId == ""){
      this.showAlert("Error", "Kindly select a city");
      return;
    }else if(this.state.name == ""){
      this.showAlert("Error", "Kindly provide contact full name");
      return;
    }
    else if(this.state.phone == ""){
      this.showAlert("Error", "Kindly provide your contact phone");
      return;
    }else if(this.state.phone.length != 11){
        this.showAlert('error', 'Kindly ensure mobile number is provided and in the folowing format: 08012345678');
        return;
    }
    else if(this.state.address == ""){
      this.showAlert("Error", "Kindly provide delivery address");
      return;
    }else{
      var deliveryInfo = {};
      deliveryInfo.name= this.state.name;
      deliveryInfo.cityId= this.state.cityId;
      deliveryInfo.phone= this.state.phone;
      deliveryInfo.address= this.state.address;
      deliveryInfo.latitude= this.state.latitude;
      deliveryInfo.longitude= this.state.longitude;
      deliveryInfo.vehicleTypeId= this.state.vehicleTypeId;
      deliveryInfo.locationPlaceholder = this.state.locationPlaceholder;
      if(this.state.payWithCard == true){
        deliveryInfo.paymentMethod = "Pay with card";
      }else{
        deliveryInfo.paymentMethod = "Pay with wallet";
      }
      AsyncStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo)).then(() => {
        this.props.navigation.navigate('EatOrderSummary');
      });
    }
  }
  displayPickeritems(vehicleType){
      return(
        <Picker.Item color="#444" label={vehicleType.name+" - Max weight: "+vehicleType.max_weight+"kg"} key={vehicleType.id} value={vehicleType.id} />
      )
    
  }


  getVehicleTypes(){
    fetch(`${SERVER_URL}/mobile/get_vehicle_types`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "vehicle_types");
       //this.hideLoader();
       if(res.success){
          this.setState({
            vehicleTypes:  res.vehicle_types.filter(function(vehicleType){return vehicleType.type == "Courier"}),
            vehicleTypeId: 1,
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getVehicleTypes() }
       ],
       //{ cancelable: false }
     );
    });
  }

  changeStatus = (status) => {
    if(this.state.customer.city_id == null){
      this.showAlert("Info", "Kindly register a new account to use this feature");
      return;
    }
    var label = this.state.cities.find(x => x.id == this.state.customer.city_id);
    console.log(label, 'label');
    console.log(this.state.customer.city_id, 'c');
    console.log(this.state.cities, 'c');
    this.onSelect(label);
    if(status == true){
      this.setState({
        useAddress: true,
        name: this.state.customer.first_name +" "+ this.state.customer.last_name,
        phone: this.state.customer.phone1,
      })
    }else{
      this.setState({
        useAddress: false,
        name: '',
        phone: '',
      })
    }
  }
 
  
  onCancel = () => {
    this.setState({
      visible: false
    });
  }
  onSelect = (city) => {
    
    this.setState({
      cityId: city.id,
      locationPlaceholder: city.label,
      visible: false 
    }, ()=> {  })
    
  }

  render() {
    const { visible } = this.state;
    const { visible1} = this.state;
    return (
      <View style = {styles.body}>
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
          <StatusBar translucent={true}  backgroundColor={'#2BBAD8'}  />
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
          </TouchableOpacity>
          <Text style = {styles.headerText}>Delivery info</Text>
          {/*
              <Text style = {styles.label1}>Vehicle type</Text>
              <TouchableOpacity style={[styles.input]}>
                <Picker
                  //selectedValue={selectedValue}
                  selectedValue={this.state.vehicleTypeId}  
                  //style={{ height: 100, width: 200 }}
                  style={styles.input}
                  onValueChange={(itemValue, itemIndex) => this.setState({vehicleTypeId: itemValue})}
                >
                  {this.state.vehicleTypes && this.state.vehicleTypes.map(vehicleType => (
                    this.displayPickeritems(vehicleType)
                  ))}
                </Picker>
              </TouchableOpacity>
                  */}
          <View  style={styles.mySwitchView}>
              <Text style = {styles.labelo}>Use profile info</Text>
              <CheckBox
                    value={this.state.useAddress}
                    onValueChange={() =>  {this.changeStatus(!this.state.useAddress)}}
                />
            </View>
            <View style = {styles.bottomView}>
              <View style= {styles.row}>
                <View style= {styles.col50}>
                  <Text style = {styles.label1}>Contact person</Text>
                  <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    onChangeText={(text) => this.setState({name: text})}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#ccc" 
                                    value={this.state.name}
                                    //keyboardType={'email-address'}
                                  />
                </View>
                <View style= {styles.col50}>
                  <Text style = {styles.label}>Contact phone</Text>
                  <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                onChangeText={(text) => this.setState({phone: text})}
                                underlineColorAndroid="transparent"
                                minLength={11}
                                maxLength={11}
                                keyboardType={'phone-pad'}
                                value={this.state.phone}
                              />
                </View>
              </View>
              {this.state.visible &&
              <ModalFilterPicker
                style={styles.input}
                onSelect={this.onSelect}
                onCancel={this.onCancel}
                options={this.state.cities}
              />
            }
              <Text style = {styles.label}>City</Text>
              <TouchableOpacity onPress={() => this.setState({visible: true})}  >
                  <Text style={styles.locSelect}>{this.state.locationPlaceholder}</Text>
              </TouchableOpacity>
              
              <Text style = {styles.label}>Address</Text>
              <View style={{ paddingTop: 1, flex: 1 }}>
              <GooglePlacesAutocomplete
                  styles={{
                    textInputContainer: {
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      width: '95%',
                      alignSelf: 'center',
                      backgroundColor: '#fff',
                      padding: 0,
                    },
                    listView: {
                      height: '100%',
                      //width: '90%',
                      elevation: 5,
                      zIndex: 999999,
                      //backgroundColor: '#333',
                    },
                    textInput: {
                      width: '90%',
                      height: 46,
                      backgroundColor: '#EFF0F3',
                      borderRadius: 6,
                      alignSelf: 'center',
                      marginTop: 5,
                      paddingLeft: 10,
                      color: '#444',
                    }
                  }}
                  query={{
                    key: 'AIzaSyA81Qtd4Z4fpon-FqfJ8Gm90nafat-Kx50',
                    language: 'en',
                  }}
                  getDefaultValue={() => ''}
                  placeholder='Delivery Address'
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  fetchDetails={true}
                  listViewDisplayed={'auto'}
                  textInputProps={{
                    onFocus: () => this.showAlert("Info", "Kindly ensure you including your town in the address, then select form the option provided. This allow us to get an accurate coordinate of the address"),
                  }}
                  //currentLocation={true}
                  
                  onPress={(data, details) => {
                    // 'details' is provided when fetchDetails = true
                     console.log(data, 'data');
                    // console.log(details, 'details');
                    this.setState({
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      address: data.description
                    })
                    //Alert.alert("Latitude", `${details.geometry.location.lat}`);
                  }}
                  onFail={(error) => console.error(error)}
                  
                />
                </View>
                
                {/*
              <TextInput
                      style={styles.input}
                      placeholder="Enter Address"
                      onChangeText={(text) => this.setState({address: text})}
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#ccc" 
                      value={this.state.address}
                      //keyboardType={'email-address'}
                    />
                */}
              {/*
              <Text style = {styles.headerTextZ}>Payment options</Text>
              <TouchableOpacity style = {styles.cardView}   onPress={() => this.setState({payWithWallet: false, payWithCard: true})} >
                <Image source = {require('../imgs/card2.png')} style = {styles.cardIcon1} />
                <Text style = {styles.cardText}>Pay with card</Text>
                {this.state.payWithCard &&
                <Image source = {require('../imgs/check-circle.png')} style = {styles.checkIcon} />
                }
              </TouchableOpacity>
              <TouchableOpacity style = {styles.cardView}  onPress={() => this.setState({payWithCard: false, payWithWallet: true})}>
                <Image source = {require('../imgs/wallet2.png')} style = {styles.cardIcon} />
                <Text style = {styles.cardText}>Pay from wallet</Text>
                {this.state.payWithWallet &&
                <Image source = {require('../imgs/check-circle.png')} style = {styles.checkIcon} />
                }
              </TouchableOpacity>
              */}
              <TouchableOpacity style={styles.addView}  onPress={() => this.submit()}>
                  <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#2BBAD8', '#2BBAD8']} style={styles.addGradient}>
                    <Text style={styles.addText}>Next</Text>
                  </LinearGradient>
                </TouchableOpacity>
             
            </View>
          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default EatDeliveryAddress

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#fff",
  },
  backImage: {
    width: 18,
    height: 12,
    marginLeft: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 8,
    color: '#585757',
  },
  headerTextZ: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 20,
    color: '#333',
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
  },
  cardView: {
    width: 190,
    alignSelf: 'flex-start',
    padding:10,
    //backgroundColor: '#444',
    borderRadius: 2,
    marginTop: 5,
    marginLeft: 15,
    flexDirection: 'row'
  },
  locSelect: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    paddingTop: 8,
    color: '#333',
  },
  cardIcon: {
    width: 25,
    height: 17,
    marginTop: 7,
  },
  cardIcon1: {
    width: 25,
    height: 16,
    marginTop: 7,
  },
  cardText: {
    color: '#fff',
    paddingLeft: 5,
    //paddingTop: 5,
  },
  checkIcon: {
    width: 22,
    height: 22,
    alignSelf: 'center',
    // paddingBottom: 5,
    // paddingLeft: 15
    position: 'absolute',
    top: 13,
    right: 17
  },
  cardText: {
    color: '#3D3838',
    paddingLeft: 15,
    paddingTop: 5,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addView: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
  },



  label1:{
    color: '#555',
    paddingLeft: 10,
    marginTop: 10,
  },
  label:{
    color: '#555',
    paddingLeft: 15,
    marginTop: 10,
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#333',
  },
  input1: {
    width: '9%',
    height: 40,
    backgroundColor: '#aaa',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 25,
    color: '#222'
  },
  mySwitchView: {
    flexDirection: 'row',
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  labelo:{
    color: '#555',
    paddingLeft: 3,
    marginTop: 7,
  },
  forgotText: {
    textAlign: 'center',
    //marginRight: 30,
    color: '#5B5B5B',
    fontSize: 12,
    marginTop: 10,
  },
  forgotText1: {
    textAlign: 'center',
    //marginRight: 30,
    color: '#2BBAD8',
    fontSize: 12,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 51,
  },
  createText: {
    textAlign: 'center',
    color: '#2BBAD8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  col50: {
    width: '50%',
  },
  
submitButton: {elevation: 2,
  marginTop: 20,
  backgroundColor: '#2BBAD8',
  borderRadius: 10,
  width: '80%',
  alignSelf: 'center',
  paddingTop: 12,
  paddingBottom: 13,
},
submitButton1: {
  marginTop: 20,
  backgroundColor: '#e2aa2e',
  opacity: 0.7,
  borderRadius: 2,
  width: '90%',
  alignSelf: 'center',
  paddingTop: 12,
  paddingBottom: 13,
},
submitButtonText: {
  color: '#fff',
  textAlign: 'center'
},
loaderImage: {
  width: 80,
  height: 80,
  alignSelf: 'center',
  zIndex: 99999999999999,
  
},
modal: {
  margin: 0,
  padding: 0
},
modalView: {
  // width: '100%',
  // height: '100%',
  // opacity: 0.9,
  alignSelf: 'center',
  height: 50,
  width: 100,
  backgroundColor: '#FFF',
  paddingTop: 18,
},


forgotModalView: {
  // width: '100%',
  // height: '100%',
  // opacity: 0.9,
  alignSelf: 'center',
  height: 280,
  width: '90%',
  backgroundColor: '#FFF',
  paddingTop: 18,
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
  backgroundColor: 'rgba(0,0,0,0.5)'
}
  
})

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    width: '100%',
    height: 40,
    backgroundColor: '#EFF0F3',
    //borderWidth: 1,
    borderRadius: 8,
    marginTop: -5,
    color: '#aaa',
  },
  inputIOS: {
    width: '100%',
    height: 40,
    borderColor: '#777',
    //borderWidth: 1,
    borderRadius: 8,
    marginTop: -5,
    color: '#aaa',
  },
})