import React, { Component  } from 'react';
import { AppState, View, Platform, Text, Alert, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import CodeInput from 'react-native-code-input';

export class VerifyPhone extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.onFinishCheckingCode = this.onFinishCheckingCode.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      phone: props.navigation.state.params.phone,
      visible1: false,
    }
    // this.getLoggedInUser();
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
        //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      //{ cancelable: false }
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
        // this.setState({
        //   customer: JSON.parse(value)
        // }, () => {
        //   this.setState({
        //     customer_id: this.state.customer.id
        //   })
        // });
          
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


resendVerification(){
  this.showLoader();
  
  fetch(`${SERVER_URL}/mobile/resend_verify_phone`, {
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
          // this.showAlert("success", res.success);
          // this.setState({
          //   customer:  res.customer
          // }, ()=> {
          //   this.showAlert("Success", res.success)
          // });
          this.props.navigation.navigate('Login');
        }else{
          this.showAlert("Error", res.error)
        }
}).done();

}

resendVerificationThruEmail(){
//   this.showLoader();
  
//   fetch(`${SERVER_URL}/mobile/resend_verify_email`, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         email: this.state.phone,
//     })
//   }).then((response) => response.json())
//       .then((res) => {
//         console.log(res);
//         this.hideLoader();
//         if(res.success){
//           this.showAlert("success", res.success);
//           this.setState({
//             customer:  res.customer
//           }, ()=> {
//             this.showAlert("Success", res.success)
//           });
//         }else{
//           this.showAlert("Error", res.error)
//         }
// }).done();

this.props.navigation.navigate('EmailRegistration', {phone: this.state.phone});

}

verify(){
  this.showLoader();
  if(!this.state.token){
    this.showAlert("Info", "Kindly input token");
    return;
  }
  console.log(this.state.phone, this.state.token)
  
  fetch(`${SERVER_URL}/mobile/verify_token`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        phone: this.state.phone,
        token: this.state.token,
        email: this.state.phone
    })
  }).then((response) => response.json())
      .then((res) => {
        console.log(res);
        this.hideLoader();
        if(res.success){
          this.showAlert("success", res.success);
          AsyncStorage.setItem('customer', JSON.stringify(res.customer)).then(() => {
            this.setState({
              customer:  res.customer
            }, ()=> {
                    this.props.navigation.navigate('Home')
            });
          })
        }else{
          this.showAlert("Error", res.error)
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
onFinishCheckingCode(code){
  console.log(code, 'code')
  this.setState({
    token: code
  }, ()=> {
    this.verify();
  })
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
          
          <TouchableOpacity style = {styles.menuImageView}onPress={() => this.props.navigation.goBack()} >
          <Icon name="arrow-back" size={18} color="#fff"  style = {styles.backImage}/>
          </TouchableOpacity>
          
          <Text style = {styles.headerText}>Verification</Text>
          
            <View style = {styles.bottomView}>
            <Text style = {styles.label}>Enter the 5 digits code sent to your{`\n`} phone number (or email)</Text>
              <View  style={styles.cv}>
                <CodeInput
                  ref="codeInputRef2"
                  secureTextEntry
                  activeColor='#081c5c'
                  inactiveColor='#081c5c'
                  autoFocus={false}
                  inputPosition='center'
                  borderType={'square'}
                  space={25}
                  codeLength={5}
                  inputPosition={'full-width'}
                  size={35}
                  onFulfill={(code) => this.onFinishCheckingCode(code)}
                  containerStyle={{ marginTop: 40, marginBottom: 20, paddingBottom: 0, height: 0, }}
                  codeInputStyle={{ backgroundColor: '#081c5c', color: '#fff' }}
                />
              </View>
                          
              
             
              <TouchableOpacity  onPress={() => this.verify()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => this.resendVerification()} >
                <Text style = {styles.headerText6}>Resend now </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity  onPress={() => this.resendVerificationThruEmail()} >
                <Text style = {styles.headerText6}>Resend via Email </Text>
              </TouchableOpacity> */}
              
            </View>

          </ScrollView>
          {this.state.visible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </LinearGradient>
    )
  }
}

export default VerifyPhone

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    marginBottom: 100,
    //backgroundColor: "#fff",
  },
  backImage: {
    width: 18,
    //height: 12,
    marginLeft: 20,
    marginTop: 60,
  },
  headerText6: {
    color: '#fff',
    //paddingLeft: 20,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 25,
    fontWeight: 'bold',
    marginTop: '20%',
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
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
  },

  cv: {
    width: '85%',
    alignSelf: 'center'
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
    //paddingLeft: 15,
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
    color: '#444',
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
    //marginRight: 30,
    color: '#fff',
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
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  //height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
}
})