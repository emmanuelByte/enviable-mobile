import React, { Component  } from 'react';
import { AppState, View, Platform, Text, Alert, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import {NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from '../config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';

export class EmailRegistration extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      cityId: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      email1: '',
      customer: '',
      token: '',
      referralCode: '',
      pickupLocationPlaceholder: '',
      visible1: false,
    }
    this.getLoggedInUser();
    this.getCities();
  }

  async componentDidMount() {
    
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
         { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
     );
    return true
  }

  componentDidMount() {
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
        this.props.navigation.navigate('Home')
    
      }else{
        AsyncStorage.getItem('pushToken').then((value) => {
          this.setState({
            token: value
          })
        });
        AsyncStorage.getItem('loginvalue').then((value) => {
          if(value){
            this.setState({
              email: value
            })
          }   
        });
      }
    });
  }
  showLoader(){
    this.setState({
      visible: true
    });
  }
  hideLoader(){
    this.setState({
      visible: false
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
      );
    });
  }

  sendVerification(){
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/verify_phone`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          phone: this.state.phone,
       })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            this.showAlert("success", res.success);
            this.setState({
              customer:  res.customer
            }, ()=> {
              AsyncStorage.setItem('enviable', JSON.stringify(res.customer)).then(() => {
                  this.props.navigation.navigate('VerifyPhone', {
                    phone: this.state.phone,
                  })
              });
            });
          }else{
            if(res.customer.phone_verification == "No"){
              AsyncStorage.setItem('enviable', JSON.stringify(res.customer)).then(() => {
                this.props.navigation.navigate('VerifyPhone', {
                  phone: this.state.phone,
                })
              });
            }else{
              AsyncStorage.setItem('enviable', JSON.stringify(res.customer)).then(() => {
                this.showAlert("Info", "Looks like we have your number already.")
                this.props.navigation.navigate('Home')
              });
            }
          }
  }).done();
  
}
onPickupCancel = () => {
  this.setState({
    visible1: false
  });
}
onPickupSelect = (city) => {
  
  this.setState({
    cityId: city.id,
    pickupLocationPlaceholder: city.label,
    visible1: false 
  }, ()=> {  })
  
}

 
  
  showLoader(){
    this.setState({
      visible: true
    });
  }
  hideLoader(){
    this.setState({
      visible: false
    });
  }
  render() {
    const { visible } = this.state;
    return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}}  colors={['#0B277F', '#0B277F']} style={styles.body}>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
        
          <Text style = {styles.headerText}>Welcome</Text>
            <View style = {styles.bottomView}>
              <Text style = {styles.label}>Enter phone number</Text>
              <TextInput
                            style={styles.input}
                             onChangeText={(text) => this.setState({phone: text})}
                            underlineColorAndroid="transparent"
                            minLength={11}
                            maxLength={11}
                            keyboardType={'phone-pad'}
                          />
                          
              
             
              <TouchableOpacity  onPress={() => this.sendVerification()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.forgotView} onPress={() => this.props.navigation.navigate('Login')}>
              <Text style = {styles.createText1}>Have an account? <Text style = {styles.createText}>Login instead</Text></Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
          {this.state.visible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </LinearGradient>
    )
  }
}

export default EmailRegistration

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    marginBottom: 100,
   },
  backImage: {
    width: 18,
     marginLeft: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 25,
    fontWeight: 'bold',
    marginTop: '40%',
    color: '#fff',
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
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
  },



  label1:{
    color: '#fff',
    paddingLeft: 10,
    marginTop: 10,
  },
  label:{
    color: '#fff',
    width: '90%',
    alignSelf: 'center',
     marginTop: 10,
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#081c5c',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 10,
    color: '#fff',
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
  forgotText: {
    textAlign: 'center',
     color: '#fff',
    fontSize: 12,
    marginTop: 10,
  },
  forgotText1: {
    textAlign: 'center',
     color: '#0B277F',
    fontSize: 12,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
    color: '#fff',
    marginBottom: 100,
  },
  
  createText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  col50: {
    width: '50%',
  },
  
submitButton: {elevation: 2,
  marginTop: 40,
  backgroundColor: '#fff',
  borderRadius: 10,
  width: '90%',
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
  color: '#0B277F',
  textAlign: 'center',
  fontWeight: 'bold'
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
  
  alignSelf: 'center',
  height: 50,
  width: 100,
  backgroundColor: '#FFF',
  paddingTop: 18,
},


forgotModalView: {
 
  alignSelf: 'center',
  height: 280,
  width: '90%',
  backgroundColor: '#FFF',
  paddingTop: 18,
},
loading: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
   alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
})