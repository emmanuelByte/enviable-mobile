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
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {SERVER_URL} from '../../config/server';
import {forgotPassword, logInUser} from '../../redux/api/userApi'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { poppins } from '../../config/fonts';
// import Auth from '.';

export class Login extends Component {
  constructor(props) {
    super();
    // this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      forgotVisible_disable:false,
      email1: '',
      token: '',
    };
    // this.getLoggedInUser();
  }

  async componentDidMount() {
    // console.log(this.props, "Propertyy herne ");
  }
  
  showAlert(type, message){
    Alert.alert(
      type,
      message,
    );
  }

  showLoader() {
    this.setState({ loaderVisible: true });
  }

  hideLoader() {
    this.setState({
      loaderVisible: false,
    });
  }

 

  async login() {
    // alert("jhfudhudhfd");
    const { email, password, token} = this.state;
    const payload = { email, password, push_token: token, device: Platform.OS };
    
    try {

      this.showLoader();
      const res = (await logInUser(payload));
      // console.log(res, "resulr from kifndj");
      if(!res.success) {
        this.showAlert("error", res.error);
      }
      else if(res.customer.phone_verification === 'No'){
        // this.props.navigation.navigate('VerifyPhone', {
        //   email: res.customer.email,
        //   phone: res.customer.phone1
        // })
        this.sendVerification(res.customer.email, res.customer.phone1)
      }
      else{
         //alert("trying");
         await AsyncStorage.setItem('customer', JSON.stringify(res.customer));
         this.props.dispatch(setUser({user: res.customer, status: true}));
      }

    } catch (error) { 
      console.log(error, "Error here!");
      Alert.alert("error", "Oops! Something went wrong. We'll fix it!");
    }
    this.hideLoader();

  
  }


  sendVerification(email, phone){

    this.showLoader();
    // alert(email +phone);
    //alert('sending verification');
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
          console.log('verification dent', res);
          this.hideLoader();
          if(res.success){
            this.props.navigation.navigate('VerifyPhone', {
              email: email,
              phone: phone
            }) 
          }else{
            this.showAlert("Error", res.error);
            // console.log(res, "error response")
          }
  })
  .catch(e=>console.log('Caught an error while sending verification eeeemail', e));
  
  }
  async forgot() {
    this.showLoader();
    this.setState({forgotVisible_disable: true})
    try {
      const res = await forgotPassword({email: this.state.email1});
      this.setState({forgotVisible: false, forgotVisible_disable:false});
      if (res.success) Alert.alert('Success', 'Password Reset Message Sent');
      else{ 

        this.showAlert('Error', res.error)
    };

    } catch (error) {    

      console.log(error);
      this.showAlert('Error', error);

    }
    this.hideLoader();

  }

  render() {
    const {visible} = this.state;
    return (
     
      <View style={styles.body}>
              <KeyboardAvoidingView behavior="padding" >
        <ImageBackground
          resizeMode={'cover'}
          source={require('@src/images/login-bg1.png')}
          imageStyle={styles.bg1}
          style={styles.headerView}>
          <StatusBar translucent={true} backgroundColor={'#0B277F'} />

          <View style={styles.banner}>
            <View style={styles.banner_row}>
              <Text style={styles.headerText}>Welcome To Enviable</Text>
              <Text style={styles.headerText1}>Log in to your account</Text>
            </View>

            <Image
              source={require('@src/images/log1.png')}
              style={{height: 50, width: 50}}
            />
          </View>
        </ImageBackground>

        <View style={styles.bottomView}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email/Phone"
            onChangeText={text => this.setState({email: text})}
            underlineColorAndroid="transparent"
            value={this.state.email}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={text => this.setState({password: text})}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            value={this.state.password}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.forgotView}
            onPress={() => this.setState({forgotVisible: true})}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ async() => this.login()}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotView}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.createText}>New user? Create an account.</Text>
          </TouchableOpacity>
        </View>
        {this.state.loaderVisible && (
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
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
            <Text style={styles.headerText7}>Forgot password</Text>
            <Text style={styles.headerText8}>
              Type in the email you registered with and we will send your login
              details there
            </Text>

            <Text style={styles.label1}>Email</Text>
            <TextInput
              style={styles.input1}
              onChangeText={text => this.setState({email1: text})}
              underlineColorAndroid="transparent"
              keyboardType={'email-address'}
              value={this.state.email1}
            />
            <TouchableOpacity
              onPress={() => this.forgot()}
              disabled={this.state.forgotVisible_disable}
              style={[styles.submitButton1, { flexDirection:'row', justifyContent:'center', backgroundColor: this.state.forgotVisible_disable === true?'grey':'#0B277F'}]}>

              <Text style={styles.submitButtonText}>Reset password</Text>
              {this.state.forgotVisible_disable === true?<ActivityIndicator size={"small"} color={'white'}/>: null}
            </TouchableOpacity>
          </View>
        </Modal>
        </KeyboardAvoidingView>

      </View>

    );
  }
}

const mapStateToProps= (state, other)=>{
  return {...state,...other}
}
export default connect(mapStateToProps)(Login);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingLeft: 20,
    paddingRight: 50,
  },

  banner_row: {
    justifyContent: 'center',
    marginBottom: 75,
  },

  container: {
    width: '100%',
  },

  body: {
    minHeight: '100%',
    backgroundColor: 'rgba(126,83,191, 0.1)',
  },

  headerView: {
    width: '100%',
    height: '40%',
   
    zIndex: 1,
  },

  bg1: {
    resizeMode: 'cover',
    justifyContent: 'center',
    height: '100%',
  },

  loaderImage: {
    width: 19,
    height: 19,
    zIndex: 9999999999999999999,
    alignSelf: 'center',
    marginTop: '-60%',
  },

  headerText: {
    color: '#fff',
    paddingLeft: 20,
    marginTop: '40%',
    fontSize: 18,
    fontFamily:poppins,
    fontWeight: '700',
  },

  headerText1: {
    color: '#fff',
    paddingLeft: 20,
    fontSize: 14,
    fontFamily:poppins,

  },

  headerText7: {
    color: '#333',
    paddingLeft: 20,
    fontWeight: '700',
    marginTop: 5,
    fontSize: 15,
    fontFamily:poppins,

  },

  headerText8: {
    color: '#333',
    paddingLeft: 20,
    fontSize: 12,
    fontFamily:poppins,

  },

  headerText2: {
    color: '#fff',
    paddingLeft: 20,
    fontSize: 12,
    textAlign: 'right',
    marginRight: 30,
    fontFamily:poppins,

  },

  bottomView: {
    width: '100%',
    alignSelf: 'center',
    minHeight: '60%',
    marginTop: 20,
    zIndex: 99999,
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
    color: '#444',
  },

  input1: {
    width: '90%',
    height: 40,
    backgroundColor: 'rgba(126,83,191, 0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 25,
    color: '#222',
  },

  forgotText: {
    textAlign: 'right',
    marginRight: 30,
    color: '#0B277F',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '700',
    fontFamily:poppins,

  },

  createText: {
    textAlign: 'center',
    color: '#0B277F',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    fontFamily:poppins,

  },

  submitButton: {
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 7,
    width: '85%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
    fontFamily:poppins,

  },

  submitButton1: {
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderRadius: 2,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },

  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily:poppins,

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
