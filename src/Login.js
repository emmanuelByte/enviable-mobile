import React, { Component  } from 'react';
import { AppState, View, Platform, Text, Alert, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';

export class Login extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      email1: '',
      token: '',
    }
    this.getLoggedInUser();
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
    AsyncStorage.getItem('pushToken').then((value) => {
      this.setState({
        token: value
      })
    });
    await AsyncStorage.getItem('customer').then((value) => {
      if(value){
        AsyncStorage.getItem('loginvalue').then((value) => {
          if(value){
            this.setState({
              email: value
            })
          }  
          this.props.navigation.navigate('Home') 
        });
      }else{
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
      loaderVisible: true
    });
  }
  hideLoader(){
    this.setState({
      loaderVisible: false
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

  login(){
    console.log(this.state.email, 'email');
    console.log(this.state.token, 'password');
      this.showLoader();
      fetch(`${SERVER_URL}/mobile/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            push_token: this.state.token,
            device: Platform.OS
        })
      }).then((response) => response.json())
          .then((res) => {
            this.hideLoader();
            if(res.success){
              AsyncStorage.setItem('customer', JSON.stringify(res.customer)).then(() => {
                AsyncStorage.setItem('loginvalue', this.state.email).then(() => {
                  this.setState({
                    password: ''
                  })
                  this.props.navigation.navigate('Home')
                });
                //this.showAlert("error", res.error)
              });
            }else{
              this.showAlert("Error", res.error)
            }
    }).done();
  }

  forgot(){
      this.showLoader();
      fetch(`${SERVER_URL}/mobile/forgot_password_post`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: this.state.email1,
        })
      }).then((response) => response.json())
          .then((res) => {
            console.log(res);
            this.hideLoader();
            if(res.success){
              this.showAlert("success", res.success)
            }else{
              this.showAlert("Error", res.error)
            }
    }).done();
  }
  

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}  colors={['#2BBAD8', '#2BBAD8']} style={styles.headerView}>
          <StatusBar translucent={true}  backgroundColor={'#2BBAD8'}  />
          <Text style = {styles.headerText}>Welcome To Rickreen</Text>
          <Text style = {styles.headerText1}>Log in to your account</Text>
          {/*
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} ><Text style = {styles.headerText2}>Back to home</Text></TouchableOpacity>
          */}
        </LinearGradient>
        <View style = {styles.bottomView}>
        <Text style = {styles.label}>Email</Text>
        <TextInput
                          style={styles.input}
                          placeholder="Email/Phone"
                          onChangeText={(text) => this.setState({email: text})}
                          underlineColorAndroid="transparent"
                          value={this.state.email}
                          //keyboardType={'email-address'}
                          autoCapitalize = "none"
                        />
        <Text style = {styles.label}>Password</Text>
        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          onChangeText={(text) => this.setState({password:text})}
                          underlineColorAndroid="transparent"
                          autoCapitalize = "none"
                          value={this.state.password}
                          secureTextEntry={true} 
                        />
        <TouchableOpacity style = {styles.forgotView}  onPress={() => this.setState({'forgotVisible': true})}>
          <Text style = {styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => this.login()} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Login</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style = {styles.forgotView} onPress={() => this.props.navigation.navigate('Register')}>
          <Text style = {styles.createText}>New user? Create an account.</Text>
        </TouchableOpacity>
        </View>


        {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }

        <Modal
          isVisible={this.state.forgotVisible}
          onBackdropPress={() => {
            this.setState({ forgotVisible: false });
          }}
          height= {'100%'}
          width= {'100%'}
          style={styles.modal}
        >
          <View style={styles.forgotModalView}>
          <Text style = {styles.headerText7}>Forgot password</Text>
          <Text style = {styles.headerText8}>Type in the email you registered with and we will send your login details there</Text>

          <Text style = {styles.label1}>Email</Text>
              <TextInput
                          style={styles.input1}
                          onChangeText={(text) => this.setState({email1: text})}
                          underlineColorAndroid="transparent"
                          keyboardType={'email-address'}
                          value={this.state.email1}
                        />
          <TouchableOpacity  onPress={() => this.forgot()} style={styles.submitButton1}>
          <Text style={styles.submitButtonText}>Reset password</Text>
          
        </TouchableOpacity>
          </View>
        </Modal>
        
      </View>
    )
  }
}

export default Login

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "rgba(126,83,191, 0.1)",
  },
  headerView: {
    width: '100%',
    height: '40%',
    borderBottomLeftRadius: 32,
    zIndex: 1
  },
  loaderImage: {
    width: 19,
    height: 19,
    zIndex: 9999999999999999999,
    alignSelf: 'center',
    marginTop: '-60%'
  },
  headerText: {
    color: '#fff',
    paddingLeft: 20,
    marginTop: '40%',
    fontSize: 18,
    fontWeight: '700',
  },
  headerText1: {
    color: '#fff',
    paddingLeft: 20,
    fontSize: 14
  },

  headerText7: {
    color: '#333',
    paddingLeft: 20,
    fontWeight: '700',
    marginTop: 5,
    fontSize: 15
  },
  headerText8: {
    color: '#333',
    paddingLeft: 20,
    fontSize: 12
  },
  headerText2: {
    color: '#fff',
    paddingLeft: 20,
    fontSize: 12,
    textAlign: 'right',
    marginRight: 30,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    minHeight: '60%',
    marginTop: 20,
    zIndex: 99999
  },
  logoImage: {
    width: 75,
    height: 78,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  input: {
    width: '85%',
    height: 50,
    backgroundColor: 'rgba(126,83,191, 0.1)',
    borderRadius: 7,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 25,
    color: '#444'
  },
  input1: {
    width: '90%',
    height: 40,
    backgroundColor: 'rgba(126,83,191, 0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 25,
    color: '#222'
  },
  forgotText: {
    textAlign: 'right',
    marginRight: 30,
    color: '#2BBAD8',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '700',
  },
  createText: {
    textAlign: 'center',
    color: '#2BBAD8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  
submitButton: {
  marginTop: 20,
  backgroundColor: '#2BBAD8',
  //opacity: 0.7,
  borderRadius: 7,
  width: '85%',
  alignSelf: 'center',
  paddingTop: 12,
  paddingBottom: 13,
},
submitButton1: {
  marginTop: 20,
  backgroundColor: '#2BBAD8',
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