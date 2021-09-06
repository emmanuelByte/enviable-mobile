import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Picker, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { SERVER_URL } from '../config/server';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';

//import { getDistance } from 'geolib';

export class DispatchAddress extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      visible: false,loaderVisible: false,
      visible1: false,
      visible2: false,
      loaderVisible: false,
      dc: false,
      categories: false,
      pickupAddress: '',
      pickupLongitude: '',
      pickupLatitude: '',
      pickupCityId: '',
      pickupStateId: '',
      pickupLocationPlaceholder: '',
      senderName: '',
      senderPhone: '',
      deliveryAddress: '',
      deliveryLongitude: '',
      deliveryLatitude: '',
      deliveryCityId: '',
      deliveryStateId: '',
      deliveryLocationPlaceholder: '',
      receiverName: '',
      receiverPhone: '',
      orderId: 0,
      cities: false,
      customer: false,
      payWithWallet: true,
      payWithCard: false,
      vehicleTypeId: '',
      useAddress: false,
      useAddress1: false,
      vehicleTypeId: 4,
      quantity: 1,
      type: false,
      vs: false,
      vs: false,
    }
    this.getLoggedInUser();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack()
    return true
  }

  componentDidMount() {
    this.getDC();
    // this.setState({
    //   type: this.props.navigation.state.params.type,
    // }, () => {
    
    //})
    this.getCities();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  async getDC(){
    await AsyncStorage.getItem('dispatchCart').then((value) => {
      if(value){
        this.setState({
          dc: JSON.parse(value)
        }, ()=> {
          this.getVehicleTypes();
        });
      }
    });
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
        console.log(value)
        this.setState({
          customer: JSON.parse(value)
        }, () => {
          console.log(this.state.customer, 'sjjjs')
          this.setState({
            customer_id: this.state.customer.id,
            name: this.state.customer.first_name +" "+ this.state.customer.last_name,
            phone: this.state.customer.phone1,
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

  prepareData(data){
    var newData = [];
    for(var i=0;i<data.length;i++){
      var subData = {
        label: data[i].name,
        value: data[i].id
      }
      newData.push(subData)
    }
    this.setState({
      vs: newData
    })
  }

  getVehicleTypes(){
    var type = this.state.dc[0].type;
    fetch(`${SERVER_URL}/mobile/get_vehicle_types`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "vehicle_types");
       //this.hideLoader();
       if(res.success){
          this.setState({
            vehicleTypes:  res.vehicle_types.filter(function(vehicleType){return vehicleType.type ==type}),
          }, ()=> {
            this.prepareData(this.state.vehicleTypes)
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

  getCities(){
    fetch(`${SERVER_URL}/mobile/get_cities`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       
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

  async submit(){
    var d = new Date;
    var t = d.getTime();
    if(this.state.pickupLongitude == ""){
      this.showAlert("Error", "Kindly select a pickup address from sugestions provided");
      return;
    }else if(this.state.pickupLatitude == ""){
      this.showAlert("Error", "Kindly select a pickup address from sugestions provided");
      return;
    }else if(this.state.pickupCityId == ""){
      this.showAlert("Error", "Kindly select a pickup city");
      return;
    }
    else if(this.state.senderName == ""){
      this.showAlert("Error", "Kindly provide a sender's name");
      return;
    }
    else if(this.state.senderPhone == ""){
      this.showAlert("Error", "Kindly provide a sender's phone");
      return;
    }
    if(this.state.deliveryLongitude == ""){
      this.showAlert("Error", "Kindly select delivery address from sugestions provided");
      return;
    }else if(this.state.deliveryLatitude == ""){
      this.showAlert("Error", "Kindly select delivery address from sugestions provided");
      return;
    }else if(this.state.deliveryCityId == ""){
      this.showAlert("Error", "Kindly select a delivery city");
      return;
    }
    else if(this.state.receiverName == ""){
      this.showAlert("Error", "Kindly provide a receiver's name");
      return;
    }
    else if(this.state.receiverPhone == ""){
      this.showAlert("Error", "Kindly provide a receiver's phone");
      return;
    }

    await AsyncStorage.getItem('dispatchCart').then((value) => {
      if(value){
        
          var dispatchCart = JSON.parse(value);
        //   var distance = getDistance(
        //     { latitude: this.state.pickupLatitude, longitude: this.state.pickupLongitude },
        //     { latitude: this.state.deliveryLatitude, longitude: this.state.deliveryLongitude }
        // );
        var ori = this.state.pickupLatitude + "," + this.state.pickupLongitude;
        var des = this.state.deliveryLatitude + "," + this.state.deliveryLongitude;
        var distance = this.getDistance(ori, des, dispatchCart);
          
      }else{
        this.showAlert("Error", "No item was found in your delivery cart");
          this.props.navigation.navigate('DispatchCartSummary');
      }
    });
      
  }
  getDistance(origin, destination, dispatchCart){
    this.showLoader();
     fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       this.hideLoader();
       this.placeOrder(dispatchCart, res.rows[0].elements[0].distance.value);
       //if(res.success){
          return res.rows[0].elements[0].distance.value;
      //  }else{
      //    Alert.alert('Error', res.error);
      //  }
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
         { text: "Refresh", onPress: () => this.getDistance() }
       ],
       //{ cancelable: false }
     );
     return;
    });
  }

  placeOrder(dispatchCart, distance){
    if(this.state.quantity < 1){
      this.showAlert("Error", "Kindly provide quantity");
      return;
    }
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/place_dispatch_order`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_id: this.state.customer.id,
          pickup_address: this.state.pickupAddress,
          pickup_longitude: this.state.pickupLongitude,
          pickup_latitude: this.state.pickupLatitude,
          pickup_city_id: this.state.pickupCityId,
          pickup_state_id: this.state.pickupStateId,
          sender_name: this.state.senderName,
          sender_phone: this.state.senderPhone,
          quantity: this.state.quantity,
          delivery_address: this.state.deliveryAddress,
          delivery_longitude: this.state.deliveryLongitude,
          delivery_latitude: this.state.deliveryLatitude,
          delivery_city_id: this.state.deliveryCityId,
          delivery_state_id: this.state.deliveryStateId,
          receiver_name: this.state.receiverName,
          receiver_phone: this.state.receiverPhone,
          order_id: this.state.orderId,
          vehicle_type_id: this.state.vehicleTypeId,
          cartItems: dispatchCart,
          distance: distance,
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            console.log(res.success);
            this.setState({
              orderId: res.order_id
            }, () => {
              AsyncStorage.removeItem('dispatchCart');
              //this.gotoDispatchSummary(res.order_id)
              this.showAlert("Success", res.success)
              // this.props.navigation.navigate('DispatchOrders', {
              //   orderId: res.order_id,
              // });
              this.props.navigation.navigate('DispatchOrders'); 
            })
          }else{
            console.log(res.error, 'req')
          }
    }).done();
  }

  gotoDispatchSummary(orderId){
    this.props.navigation.navigate('DispatchSummary', {
      orderId: orderId,
    });
  }
  changeStatus = (status) => {
    if(this.state.customer.city_id == null){
      this.showAlert("Info", "Kindly register a new account to use this feature");
      return;
    }
    var label = this.state.cities.find(x => x.id == this.state.customer.city_id);
    this.onPickupSelect(label);
    if(status == true){
      this.setState({
        useAddress: true,
        senderName: this.state.name,
        senderPhone: this.state.phone,
      })
    }else{
      this.setState({
        useAddress: false,
        senderName: '',
        senderPhone: '',
      })
    }
  }
  changeStatus1 = (status) => {
    if(this.state.customer.city_id == null){
      this.showAlert("Info", "Kindly register a new account to use this feature");
      return;
    }
    var label = this.state.cities.find(x => x.id == this.state.customer.city_id);
    this.onDeliverySelect(label);
    if(status == true){
      this.setState({
        useAddress1: true,
        receiverName: this.state.name,
        receiverPhone: this.state.phone,
      })
    }else{
      this.setState({
        useAddress1: false,
        receiverName: '',
        receiverPhone: '',
      })
    }
  }
  
  onPickupCancel = () => {
    this.setState({
      visible1: false
    });
  }
  onPickupSelect = (city) => {
    
    this.setState({
      pickupCityId: city.id,
      pickupLocationPlaceholder: city.label,
      visible1: false 
    }, ()=> {  })
    
  }
  onDeliveryCancel = () => {
    this.setState({
      visible2: false
    });
  }
  onDeliverySelect = (city) => {
    
    this.setState({
      deliveryCityId: city.id,
      deliveryLocationPlaceholder: city.label,
      visible2: false 
    }, ()=> {  })
    
  }
  displayPickeritems(vehicleType){
    return(
      <Picker.Item color="#444" label={vehicleType.name+" - Max weight: "+vehicleType.max_weight+"kg"} key={vehicleType.id} value={vehicleType.id} />
    )
  }
  displayPicker(){
    if(this.state.dc && this.state.dc[0].type == "Courier"){
      return(
        <View>
            <Text style = {styles.label}>Vehicle type</Text>
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
        </View>
      )
    }else{
      // this.setState({
      //   vehicleTypeId: 4
      // })
    }
  }

  render() {
    const { visible1} = this.state;
    const { visible2} = this.state;
    return (
      <View style = {styles.body}>
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
          <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
          <View style={styles.header}>
            <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
            </TouchableOpacity>
            <Text style = {styles.headerText}>Dispatch info</Text>
          </View>
          <View style = {styles.bottomView}>
          <Text style = {styles.subHead}>Vehicle information</Text>
              <Text style = {styles.label1}>Vehicle type</Text>
             <TouchableOpacity style={[styles.input]}>
             <RNPickerSelect
                    placeholder=''
                    style={pickerSelectStyles}
                    selectedValue={this.state.vehicleTypeId}    
                    onValueChange={(itemValue, itemIndex) => this.setState({vehicleTypeId: itemValue})}
                    items={this.state.vs}
                    returnKeyType={ 'done' }
                    />
               {/*
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
                */}
              </TouchableOpacity>
            </View>
            <Text style = {styles.label}>How many trucks do you need?</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                onChangeText={(text) => this.setState({quantity: text})}
                underlineColorAndroid="transparent"
                placeholderTextColor="#ccc" 
                value={this.state.quantity}
                keyboardType={'numeric'}
              />
            <View style = {styles.bottomView}>
            <Text style = {styles.subHead}>Pickup informatin</Text>
            <View  style={styles.mySwitchView}>
              <Text style = {styles.labelo}>Use profile info</Text>
              <CheckBox
                    value={this.state.useAddress}
                    onValueChange={() =>  {this.changeStatus(!this.state.useAddress)}}
                />
            </View>
            <Text style = {styles.label}>City</Text>
              {this.state.visible1 &&
                <ModalFilterPicker
                  style={styles.input}
                  onSelect={this.onPickupSelect}
                  onCancel={this.onCancel}
                  options={this.state.cities}
                />
              }
            <TouchableOpacity onPress={() => this.setState({visible1: true})}  >
              <Text style={styles.locSelect}>{this.state.pickupLocationPlaceholder}</Text>
            </TouchableOpacity>
              <Text style = {styles.label}>Pickup Address</Text>
              <View style={{ paddingTop: 1, flex: 1 }}>
              <GooglePlacesAutocomplete
                  styles={{
                    textInputContainer: {
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      width: '95%',
                      //width: '5%',
                      alignSelf: 'center',
                      backgroundColor: '#fff',
                      padding: 0,
                    },
                    listView: {
                      height: '100%',
                      //width: '100%',
                      elevation: 5,
                      zIndex: 999999,
                      //backgroundColor: '#333',
                    },
                    textInput: {
                      width: '85%',
                      height: 46,
                      backgroundColor: '#EFF0F3',
                      borderRadius: 6,
                      alignSelf: 'center',
                      marginTop: 5,
                      paddingLeft: 10,
                      color: '#444',
                    }
                  }}styles={{
                    textInputContainer: {
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      width: '95%',
                      height: 50,
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderColor: '#ABA7A7',
                      borderWidth: 1,
                      alignSelf: 'center',
                      padding: 0,
                    },
                    listView: {
                      height: '100%',
                      //width: '100%',
                      elevation: 5,
                      zIndex: 999999,
                      //backgroundColor: '#333',
                    },
                    textInput: {
                      // width: '90%',
                       height: 46,
                      // backgroundColor: '#EFF0F3',
                      // borderRadius: 6,
                      // alignSelf: 'center',
                      // marginTop: 5,
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderColor: '#ABA7A7',
                      borderWidth: 1,
                      paddingLeft: 10,
                      color: '#444',
                    }
                  }}
                  query={{
                    key: 'AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co',
                    language: 'en',
                  }}
                  getDefaultValue={() => ''}
                  placeholder=''
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
                      pickupLatitude: details.geometry.location.lat,
                      pickupLongitude: details.geometry.location.lng,
                      pickupAddress: data.description
                    })
                    //Alert.alert("Latitude", `${details.geometry.location.lat}`);
                  }}
                  onFail={(error) => console.error(error)}
                  
                />
                </View>
              <Text style = {styles.label}>Sender's name</Text>
              <TextInput
                            style={styles.input}
                            placeholder=""
                            onChangeText={(text) => this.setState({senderName: text})}
                            underlineColorAndroid="transparent"
                            value={this.state.senderName}
                          />
              <Text style = {styles.label}>Sender's phone</Text>
              <TextInput
                            style={styles.input}
                            placeholder=""
                            onChangeText={(text) => this.setState({senderPhone: text})}
                            underlineColorAndroid="transparent"
                            value={this.state.senderPhone}
                            minLength={11}
                            maxLength={11}
                            keyboardType={'phone-pad'}
                          />
            </View>

            <View style = {styles.bottomView}>
            <Text style = {styles.subHead}>Delivery information</Text>
            {/*
            <View  style={styles.mySwitchView}>
              <Text style = {styles.labelo}>Use profile info</Text>
              <CheckBox
                    value={this.state.useAddress1}
                    onValueChange={() =>  {this.changeStatus1(!this.state.useAddress1)}}
                />
              </View>
            */}
            <Text style = {styles.label}>Delivery City</Text>
              {this.state.visible2 &&
                <ModalFilterPicker
                  style={styles.input}
                  onSelect={this.onDeliverySelect}
                  onCancel={this.onDeliveryCancel}
                  options={this.state.cities}
                />
              }
            <TouchableOpacity onPress={() => this.setState({visible2: true})}  >
              <Text style={styles.locSelect}>{this.state.deliveryLocationPlaceholder}</Text>
            </TouchableOpacity>
              <Text style = {styles.label}>Delivery Address</Text>
              <View style={{ paddingTop: 1, flex: 1 }}>
              <GooglePlacesAutocomplete
                  styles={{
                    textInputContainer: {
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      width: '95%',
                      height: 50,
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderColor: '#ABA7A7',
                      borderWidth: 1,
                      alignSelf: 'center',
                      padding: 0,
                    },
                    listView: {
                      height: '100%',
                      //width: '100%',
                      elevation: 5,
                      zIndex: 999999,
                      //backgroundColor: '#333',
                    },
                    textInput: {
                      // width: '90%',
                       height: 46,
                      // backgroundColor: '#EFF0F3',
                      // borderRadius: 6,
                      // alignSelf: 'center',
                      // marginTop: 5,
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderColor: '#ABA7A7',
                      borderWidth: 1,
                      paddingLeft: 10,
                      color: '#444',
                    }
                  }}
                  query={{
                    key: 'AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co',
                    language: 'en',
                  }}
                  getDefaultValue={() => ''}
                  placeholder=''
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  fetchDetails={true}
                  listViewDisplayed={'auto'}
                  //currentLocation={true}
                  
                  onPress={(data, details) => {
                    // 'details' is provided when fetchDetails = true
                     console.log(data, 'data');
                    // console.log(details, 'details');
                    this.setState({
                      deliveryLatitude: details.geometry.location.lat,
                      deliveryLongitude: details.geometry.location.lng,
                      deliveryAddress: data.description
                    })
                    //Alert.alert("Latitude", `${details.geometry.location.lat}`);
                  }}
                  onFail={(error) => console.error(error)}
                  
                />
                </View>
              <Text style = {styles.label}>Receiver's name</Text>
              <TextInput
                            style={styles.input}
                            placeholder=""
                            onChangeText={(text) => this.setState({receiverName: text})}
                            underlineColorAndroid="transparent"
                            value={this.state.receiverName}
                          />
              <Text style = {styles.label}>Receiver's phone</Text>
              <TextInput
                            style={styles.input}
                            placeholder=""
                            onChangeText={(text) => this.setState({receiverPhone: text})}
                            underlineColorAndroid="transparent"
                            value={this.state.receiverPhone}
                            minLength={11}
                            maxLength={11}
                            keyboardType={'phone-pad'}
                          />
            </View>

            <TouchableOpacity style={styles.addView}  onPress={() => this.submit()}>
                  <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                    <Text style={styles.addText}>Next</Text>
                  </LinearGradient>
                </TouchableOpacity>
          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default DispatchAddress

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
    fontSize: 17,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#000',
    marginTop: 73,
    width: '80%',
  },
  mySwitchView: {
    flexDirection: 'row',
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  header: {
    width: '100%',
    height: 110,
    //backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
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
    //marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 10,
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
    height: 40,
    //backgroundColor: 'rgba(126,83,191, 0.1)',
    borderRadius: 7,
    borderColor: '#ABA7A7',
    borderWidth: 1,
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
  subHead: {
    //marginBottom: 10,
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 10,
    color: '#000',
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
    marginBottom: 50,
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
    fontSize: 12,
    marginTop: 10,
  },
  labelo:{
    color: '#555',
    paddingLeft: 3,
    marginTop: 7,
  },
  input: {
    width: '90%',
    height: 40,
    //backgroundColor: 'rgba(126,83,191, 0.1)',
    borderRadius: 7,
    borderColor: '#ABA7A7',
    borderWidth: 1,
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
    color: '#0B277F',
    fontSize: 12,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 75,

  },
  createText: {
    textAlign: 'center',
    color: '#0B277F',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  col50: {
    width: '50%',
  },
  col25: {
    width: '25%',
  },
  
submitButton: {elevation: 2,
  marginTop: 20,
  backgroundColor: '#0B277F',
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
    borderColor: '#EFF0F3',
    //borderWidth: 1,
    borderRadius: 8,
    marginTop: -1,
    color: '#aaa',
  },
  inputIOS: {
    width: '100%',
    height: 40,
    borderColor: '#777',
    //borderWidth: 1,
    borderRadius: 8,
    marginTop: -1,
    color: '#aaa',
  },
})