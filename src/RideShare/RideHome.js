import React, { Component  } from 'react';
import { AppState, View, PermissionsAndroid, Text, Alert, Picker, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
navigator.geolocation = require('@react-native-community/geolocation');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export class RideHome extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      visible: false,loaderVisible: false,
      loaderVisible: false,
      latitude: false,
      longitude: false,
      origin: false,
      initialRegion: false,
      fromLatitude: '',
      toLatitude: '',
      fromAddress: '',
      toAddress: '',
      fromText: '',
      toText: '',
      // initialRegion: {
      //   latitude: 6.465422,
      //   longitude: 3.406448,
      //   latitudeDelta: 5,
      //   longitudeDelta: 5
      // },
    }
    this.getLoggedInUser();
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
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
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
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

  goToInitialRegion() {
    let initialRegion = Object.assign({}, this.state.initialRegion);
    initialRegion["latitudeDelta"] = 0.009922;
    initialRegion["longitudeDelta"] = 0.009421;
    this.mapView.animateToRegion(initialRegion, 3000);
  }
  getLocation(){
    //this.showLoader();
    var that =this;
    //Checking for the permission just after component loaded
    if(Platform.OS === 'ios'){
      this.callLocation(that);
    }else{
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //To Check, If Permission is granted
              that.callLocation(that);
            } else {
              alert("Permission Denied");
            }
          } catch (err) {
            alert("err",err);
            console.warn(err)
          }
        }
        requestLocationPermission();
      }
    }

    componentDidFocus = () => {
      this.getLocation();
    }
    callLocation(that){
    //alert("callLocation Called");
      navigator.geolocation.getCurrentPosition(
        //Will give you the current location
         (position) => {
            const currentLongitude = position.coords.longitude;
            const currentLatitude = position.coords.latitude;
            var origin = {
              latitude: currentLatitude,
              longitude: currentLongitude,
              latitudeDelta: 0.009922,
              longitudeDelta: 0.009421,
            }
            that.setState({ 
              origin:origin,
              latitude:currentLatitude,
              longitude:currentLongitude,
              initialRegion: origin
            });
            
         },
         (error) => console.log(error)
      );
      that.watchID = navigator.geolocation.watchPosition((position) => {
        //Will give you the location on location change
          const currentLongitude = position.coords.longitude;
          const currentLatitude = position.coords.latitude;
          
         var origin = {
           latitude: currentLatitude,
           longitude: currentLongitude,
         }
         that.setState({ 
           origin:origin,
           latitude:currentLatitude,
           longitude:currentLongitude
         }, ()=> {
          //this.saveLocation(currentLatitude, currentLongitude)
         });
         
      });
      
   }

   proceed(){
     console.log(this.state.fromText, 'fromText')
     console.log(this.state.toText, 'toText')
     if(this.state.fromLatitude == "" && this.state.fromText != ""){
      this.showAlert("Info", "Kindly provide a pickup address and ensure you select form the option provided");
      return
     }
     else if(this.state.toLatitude == "" && this.state.toText != ""){
      this.showAlert("Info", "Kindly provide a destination address and ensure you select form the option provided");
      return
     }
     else if(this.state.fromLatitude != "" && this.state.toLatitude != ""){
      this.gotoRideconfirm()
     }
     else{
      //this.gotoRideconfirm()
     }
   }

   
  
   gotoRideconfirm(){
     var origin = {
       'latitude': this.state.fromLatitude,
       'longitude': this.state.fromLongitude,
       'latitudeDelta': 0.009922,
       'longitudeDelta': 0.009421,
       'address': this.state.fromAddress,
     }
     var destination = {
      'latitude': this.state.toLatitude,
      'longitude': this.state.toLongitude,
      'latitudeDelta': 0.009922,
      'longitudeDelta': 0.009421,
      'address': this.state.toAddress,
    }
    this.props.navigation.navigate('RideShareConfirm', {
      origin: origin,
      destination: destination,
      //coordinate: 
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


  render() {
    const { visible } = this.state;
    return (
      <View style={[StyleSheet.absoluteFillObject]}>
        { this.state.origin && this.state.initialRegion && 
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={[StyleSheet.absoluteFill, styles.map]}
            origin={this.state.origin}
            region={this.state.initialRegion}
            followUserLocation={true}
            ref={ref => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}
            //onMapReady={this.goToInitialRegion.bind(this)}
            //initialRegion={this.state.initialRegion}
          >
            
          </MapView>
          }
          
          <View style= {styles.infoView}>
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
            <Text style = {styles.menuImage}>Go Back</Text>
        </TouchableOpacity>
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
                  width: '100%',
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
                  backgroundColor: '#EFF0F3',
                  borderRadius: 7,
                  //borderColor: '#ABA7A7',
                  //borderWidth: 1,
                  paddingLeft: 10,
                  color: '#444',
                }
              }}
              query={{
                key: 'AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co',
                language: 'en',
              }}
              getDefaultValue={() => ''}
              placeholder='From'
              minLength={2} // minimum length of text to search
              autoFocus={false}
              fetchDetails={true}
              listViewDisplayed={'auto'}
              onSubmitEditing={() => this.proceed()}
              textInputProps={{
                //onFocus: () => this.showAlert("Info", "Kindly ensure you including your town in the address, then select form the option provided. This allow us to get an accurate coordinate of the address"),
                onChangeText: (text) => this.setState({fromText: text})
              }}
              //currentLocation={true}
              
              onPress={(data, details) => {
                // 'details' is provided when fetchDetails = true
                 console.log(data, 'data');
                // console.log(details, 'details');
                this.setState({
                  fromLatitude: details.geometry.location.lat,
                  fromLongitude: details.geometry.location.lng,
                  fromAddress: data.description
                }, ()=>{
                  this.proceed();
                })
                //Alert.alert("Latitude", `${details.geometry.location.lat}`);
              }}
              onFail={(error) => console.error(error)}
              
            />
            </View>

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
                  width: '100%',
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
                  backgroundColor: '#EFF0F3',
                  borderRadius: 7,
                  //borderColor: '#ABA7A7',
                  //borderWidth: 1,
                  paddingLeft: 10,
                  color: '#444',
                }
              }}
              query={{
                key: 'AIzaSyCJ9Pi5fFjz3he_UkrTCiaO_g6m8Stn2Co',
                language: 'en',
              }}
              getDefaultValue={() => ''}
              placeholder='To'
              minLength={2} // minimum length of text to search
              autoFocus={false}
              fetchDetails={true}
              listViewDisplayed={'auto'}
              onSubmitEditing={() => this.proceed()}
              textInputProps={{
                //onFocus: () => this.showAlert("Info", "Kindly ensure you including your town in the address, then select form the option provided. This allow us to get an accurate coordinate of the address"),
                onChangeText: (text) => this.setState({toText: text})
              }}
              //currentLocation={true}
              
              onPress={(data, details) => {
                // 'details' is provided when fetchDetails = true
                 console.log(data, 'data');
                // console.log(details, 'details');
                this.setState({
                  toLatitude: details.geometry.location.lat,
                  toLongitude: details.geometry.location.lng,
                  toAddress: data.description
                }, ()=>{
                  this.proceed();
                })
                //Alert.alert("Latitude", `${details.geometry.location.lat}`);
              }}
              onFail={(error) => console.error(error)}
              
            />
            </View>
        </View>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default RideHome

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#FFF",
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
    //position: 'absolute',
    paddingTop: 0,
    left: 20,
    color: "#2BBAD8",
    zIndex: 9999999999,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  infoView: {
    position: 'absolute', 
    top: 70, 
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    paddingBottom: 20,
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