import React, {Component} from 'react';
import {
  AppState,
  View,
  Platform,
  Text,
  Alert,
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {SERVER_URL} from '@src/config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import {
  Settings,
  LoginManager,
  LoginButton,
  AccessToken,
} from 'react-native-fbsdk-next';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import fonts from '../../config/fonts';
import colors from '../../config/colors';

export class Register extends Component {
  constructor(props) {
    super();
    // this.handleBackPress = this.handleBackPress.bind(this);
    // this.registerWithGoogle = this.registerWithGoogle.bind(this);
    // this.signOut = this.signOut.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      loaderVisible: false,
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
    };
  
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

 
  showLoader() {
    this.setState({
      visible: true,
    });
  }
  hideLoader() {
    this.setState({
      visible: false,
    });
  }

  sendVerification(email, phone){

    this.showLoader();
    // alert(email +phone);
    fetch(`${SERVER_URL}/mobile/verify_phone`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
          phone: phone
      })
    }).then((response) => response.json())
        .then((res) => {

          this.hideLoader();
          if(res.success){
            this.props.navigation.navigate('VerifyPhone', {
              email: this.state.email,
              phone: phone
            }) 
          }else{
            this.showAlert("Error", res.error);
            // console.log(res, "error response")
          }
  })
  .catch(e=>console.log('Caught an error while sending verification eeeemail', e));
  
  }


  register() {

    if(this.state.email == ''||  this.state.firstName == "" || this.state.lastName == "" || this.state.phone == "" || this.state.password == ""){
      Alert.alert('Required', 'All fields are required!');
      return;
    }
   

    this.showLoader();
    console.log({
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      // cityId: this.state.cityId,
      password: this.state.password,
      push_token: this.state.token,
      referralCode: this.state.referralCode,
      user_id: this.state.customer.id,
      device: Platform.OS});
      
    fetch(`${SERVER_URL}/mobile/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        // cityId: this.state.cityId,
        password: this.state.password,
        push_token: this.state.token,
        referralCode: this.state.referralCode,
        user_id: this.state.customer.id,
        device: Platform.OS,
      }),
    })
      .then(response =>{
        // console.log(response.text())
        return response.json()
      })
      //  response.json())
      .then(res => {
        // console.log(res);
        if (res.success) {
          
          this.sendVerification(this.state.email, this.state.phone);


        } else {
          this.hideLoader();
          this.showAlert('Error', res.error);
        }
      }).catch(_=> {
        this.hideLoader();
        this.showAlert('Error', "Error on register");
        console.log(_, 'error on register');
      })
      .done();

  }

 
  showLoader() {
    this.setState({
      visible: true,
    });
  }
  hideLoader() {
    this.setState({
      visible: false,
    });
  }
  render() {
    const {visible} = this.state;
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#0B277F', '#0B277F']}
        style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar translucent={true} backgroundColor={'#0B277F'} />
          <TouchableOpacity
            style={{marginTop:20}}
            onPress={() => this.props.navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={18}
              color="#fff"
              style={styles.backImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Let's create your account</Text>
          <View style={styles.bottomView}>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label1}>First name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  onChangeText={text => this.setState({firstName: text})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ccc"
                  value={this.state.firstName}
                  //keyboardType={'email-address'}
                />
              </View>
              <View style={styles.col50}>
                <Text style={styles.label1}>Last name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  onChangeText={text => this.setState({lastName: text})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ccc"
                  value={this.state.lastName}
                  //keyboardType={'email-address'}
                />
              </View>
            </View>
          
           
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={text => this.setState({email: text})}
              underlineColorAndroid="transparent"
              placeholderTextColor="#ccc"
              value={this.state.email}
              keyboardType={'email-address'}
              autoCapitalize="none"
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              onChangeText={text => this.setState({phone: text})}
              underlineColorAndroid="transparent"
              minLength={11}
              maxLength={11}
              value={this.state.phone}
              keyboardType={'phone-pad'}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={text => this.setState({password: text})}
              underlineColorAndroid="transparent"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
              secureTextEntry={true}
            />
         
            <TouchableOpacity style={styles.forgotView}>
              <Text style={styles.forgotText}>
                By tapping continue, you agree to Enviable's{' '}
                <Text style={styles.forgotText1}>
                  Terms of Service and privacy policies
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.register()}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>
          
          </View>
         
        </ScrollView>
        {this.state.visible && (
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        )}
      </LinearGradient>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    marginBottom: 100,
    //backgroundColor: "#fff",
  },
  backImage: {
    width: '100%',
    //height: 12,
    marginLeft: 20,
    marginVertical: 40,
    fontFamily: fonts.poppins.regular,
    fontSize:30

  },
  headerText: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 15,
    color: '#fff',
    fontFamily: fonts.poppins.regular
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
  rowa: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 100,
  },
  facebookLogin: {
    width: '50%',
    overflow: 'hidden',
  },
  facebookLoginButton: {
    width: 135,
    height: 45,
    alignSelf: 'flex-end',
    backgroundColor: '#0B277F',
  },
  fImage: {
    width: 24,
    height: 24,
    marginTop: 9,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  gImage: {
    width: 24,
    height: 24,
    marginTop: 9,
    marginLeft: 10,
  },

  label1: {
    color: '#fff',
    paddingLeft: 10,
    marginTop: 10,
    fontSize:12,
    fontFamily: fonts.poppins.regular

  },
  label: {
    color: '#fff',
    paddingLeft: 15,
    marginTop: 10,
    fontSize:12,
    fontFamily: fonts.poppins.regular

  },
  input: {
    width: '90%',
    height: 45,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    // lineHeight:45,
    paddingHorizontal: 10,
    color: 'black',
    fontFamily: fonts.poppins.regular
  },
  input1: {
    width: '9%',
    height: 45,
    backgroundColor: '#aaa',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 25,
    color: '#222',
    fontFamily: fonts.poppins.regular

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
    fontFamily: fonts.poppins.regular,
    color: '#333',
  },
  forgotText: {
    //textAlign: 'center',
    marginRight: 20,
    marginLeft: 20,
    color: '#fff',
    fontSize: 10,
    marginTop: 10,
    fontFamily: fonts.poppins.regular

  },
  forgotText1: {
    //textAlign: 'center',
    //marginRight: 30,
    color: '#ccc',
    fontSize: 10,
    fontFamily: fonts.poppins.regular

  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
    color: '#fff',
    marginBottom: 20,
  },

  createText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    fontFamily: fonts.poppins.regular

  },
  col50: {
    width: '50%',
  },

  submitButton: {
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
    marginBottom: 20,
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
    fontFamily: fonts.poppins.regular

  },
  loaderImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    zIndex: 99999999999999,
  },
  modal: {
    margin: 0,
    padding: 0,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
