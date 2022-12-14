import React, {Component} from 'react';
import {
  AppState,
  View,
  Text,
  Alert,
  Image,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  ImagePickerIOS,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import {SERVER_URL} from '../config/server';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ImgToBase64 from 'react-native-image-base64';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { setUser } from '../redux/slices/userSlice';
import { poppins } from '../config/fonts';
class Profile extends Component {
  constructor() {
    super();
     
    this.handlePhotoSelection = this.handlePhotoSelection.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      cpassword: '',
      visible: false,
      loaderVisible: false,
      passwordView: false,
      profileView: true,
      cities: null,
      visible1: false,
      dp: null,
    };
  }

   
   
   
   

   
   
   

  


  componentDidMount() {
    this.setState({
      firstName: this.props.user.first_name,
      lastName: this.props.user.last_name,
      email: this.props.user.email,
      phone: this.props.user.phone1,
      customer_id: this.props.user.id,
      dp: `${this.props.user.photo}`,
      customer: this.props.user
    })
     
      console.log( `${SERVER_URL}${this.props.user.photo}`, "LOGGER")
      // console.log(customer_id, 'user.id')
  }

   
   
   
   
   
   
   
   
   
   
   
   
   
   

  getBase64ImageFromFile(file) {
     
     
     
     
     

    return ImgToBase64.getBase64String(file);

     

     
     
     
     
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

   
   
   

  updateProfile() {
    this.showLoader();

    fetch(`${SERVER_URL}/mobile/update_profile`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.customer.id,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        password: this.state.password,
         
        photo: this.state.dp,
      }),
    })
      .then(response => response.json())
      .then(async (res) => {

        this.hideLoader();
        if (res.success) {
          this.showAlert('success', res.success);

          await AsyncStorage.setItem('customer', JSON.stringify(res.customer));
          console.log(res, "From customer resoibse")
          this.props.dispatch(setUser({user: res.customer, status: true}));
           
        } else {
          this.showAlert('Error', res.error);
        }
      })
      .catch(e=> {
        this.hideLoader();
        console.log(e, "on update profile")
      });
  }

  updatePassword() {
    if (this.state.password != this.state.cpassword) {
      this.showAlert('Info', 'Provided passwords do not match');
      return;
    }
    if (this.state.password.length < 6) {
      this.showAlert(
        'Info',
        'Provided passwords must have at least 6 characters',
      );
      return;
    }
    this.showLoader();

    fetch(`${SERVER_URL}/mobile/update_password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.customer.id,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(res => {
         
        this.hideLoader();
        if (res.success) {
          this.showAlert('success', res.success);
        } else {
          this.showAlert('Error', res.error);
        }
      })
      .done();
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

  showPassword() {
    this.setState({
      passwordView: true,
      profileView: false,
    });
  }

  showProfile() {
    this.setState({
      passwordView: false,
      profileView: true,
    });
  }

  getCities() {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_cities`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.hideLoader();

        this.hideLoader();
        if (res.success) {
          this.setState(
            {
              cities: res.cities,
            })     
        }
        
      
      
         else {
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
            {text: 'Refresh', onPress: () => this.getCities()},
          ],
           
        );
      });
  }

  handlePhotoSelection() {
    
    launchCamera({mediaType:"photo"}, (response) => {
      if (response && (response.didCancel != undefined || response.assets !== undefined)) {
        console.log('response image', response, response.assets, response.didCancel);

        this.getBase64ImageFromFile(response.assets[0].uri).then(res => {
          this.setState({dp: `data:${response.assets[0].type};base64,${res}`});
        });

        console.log(response, "including erroro object");
      }else if(response.errorCode){
        alert(response.errorMessage + response.errorCode)
        console.log(response.error, response ,"error on loading camera")
      }
    });
  }

  onCancel = () => {
    this.setState({
      visible1: false,
    });
  };

  onPickupSelect = city => {
    this.setState(
      {
        cityId: city.id,
        locationPlaceholder: city.label,
        visible1: false,
      },
      () => {},
    );
  };

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
      <View style={styles.body}>
        {console.log(this.state.firstName, 'user datadahnasdc')}
        {console.log( 'customer id:',this.state.customer_id)}

        <StatusBar translucent={true} backgroundColor={'#0B277F'} />
        <View style={styles.header}>
          <View style={styles.sheader}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="arrow-back"
                size={25}
                color="#fff"
                style={styles.menuImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Profile</Text>
          </View>
        </View>

        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            <View style={styles.topImageView}>
              <TouchableOpacity onPress={this.handlePhotoSelection}>
                {this.state.dp === null ? (
                  <Image
                    source={require('@src/images/round-profile.png')}
                    style={styles.userImage}
                  />
                ) : (
                  <Image
                    source={{
                      uri: `${SERVER_URL}${this.state.dp}`,
                    }}
                    style={styles.userImage}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.topTextView}>
              <Text style={styles.topTextName}>
                <Text style={{marginRight: 10}}>
                  {this.props.user && this.props.user.first_name}{' '}
                  {this.props.user && this.props.user.last_name}
                </Text>
              </Text>

              <Text style={styles.topLocation}>
                {this.state.customer && this.state.customer.email}
              </Text>
            </View>

            {this.state.profileView && (
              <View>
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
                  editable={false}
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
                <View style={styles.row}>
                  <View style={styles.col50}>
                    <TouchableOpacity
                      onPress={() => this.updateProfile()}
                      style={styles.submitButton}>
                      <Text style={styles.submitButtonText}>
                        Update profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.col50}>
                    <TouchableOpacity
                      onPress={() => this.showPassword()}
                      style={styles.submitButton1}>
                      <Text style={styles.submitButtonText1}>
                        Update password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {this.state.passwordView && (
              <View>
                <Text style={styles.headerText5}>Update password</Text>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={text => this.setState({password: text})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ccc"
                  autoCapitalize="none"
                  value={this.state.password}
                  secureTextEntry={true}
                />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={text => this.setState({cpassword: text})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ccc"
                  autoCapitalize="none"
                  value={this.state.cpassword}
                  secureTextEntry={true}
                />
                <View style={styles.row}>
                  <View style={styles.col50}>
                    <TouchableOpacity
                      onPress={() => this.updatePassword()}
                      style={styles.submitButton}>
                      <Text style={styles.submitButtonText}>
                        Update password
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.col50}>
                    <TouchableOpacity
                      onPress={() => this.showProfile()}
                      style={styles.submitButton1}>
                      <Text style={styles.submitButtonText1}>
                        Update profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {this.state.loaderVisible && (
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state, others) =>{
  return {user:state.user.value, ...others}
}

export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
     
  },
  cView: {
     
    width: '95%',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    zIndex: 99999999,
    alignSelf: 'center',
    paddingBottom: 50,
    marginBottom: 250,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    zIndex: 0,
    height: 245,
    backgroundColor: '#0B277F',
  },
  sheader: {
    width: '100%',
    flexDirection: 'row',
    zIndex: 0,
  },
  cartImage: {
    width: 21,
    height: 15,
    marginRight: 30,
    marginTop: 69,
  },
  descContent: {
    color: '#535871',
    textAlign: 'justify',
  },
  topTextName: {
    color: '#545F71',
    textAlign: 'center',
    marginTop: 7,
    fontFamily:poppins,

  },
  topLocation: {
    color: '#545F71',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  segmentText: {
    color: '#fff',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: 'center',
    fontFamily:poppins,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#9c77b1',
    borderWidth: 6,
  },
  colk: {
    width: '50%',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  coll: {
    width: '50%',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  col3: {
    width: '33%',
    borderRadius: 18,
  },
  col50: {
    width: '50%',
  },

  index1: {
    width: '100%',
    marginTop: 20,
  },
  itemView: {
    width: '95%',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
     
    flexDirection: 'row',
  },
  itemView4: {
    width: '90%',
    marginTop: 30,
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
    flexDirection: 'row',
  },
  itemView1: {
    width: '90%',
    marginTop: 10,
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
     
  },
  orderNumber: {
    color: '#000',
  },
  date: {
    color: '#999',
    paddingTop: 10,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    paddingTop: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
     
     
    marginTop: 10,
    alignSelf: 'center',
  },
  item1: {
    width: '60%',
  },
  item11: {
    width: '100%',
    flexDirection: 'row',
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '40%',
  },
  item3: {
    width: '100%',
  },

  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily:poppins,

  },
  addView: {
    width: '80%',
    height: 40,
    alignSelf: 'center',
    marginTop: 40,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  item: {
    width: '100%',
    marginLeft: 5,
    marginRight: 10,
    flexDirection: 'row',
  },
  contentCol1: {
    width: '60%',
    paddingRight: 9,
    overflow: 'hidden',
  },
  contentCol2: {
    width: '40%',
    overflow: 'hidden',
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
  itemNameText: {
    paddingTop: 10,
    fontWeight: 'bold',
  },
  itemPriceText: {
     
    fontWeight: 'bold',
    color: '#585757',
  },
  itemBottom: {
    flexDirection: 'row',
    width: '100%',
  },
  itemVendorText: {
    color: '#0B277F',
    fontSize: 12,
    fontFamily:poppins,

    width: '75%',
  },
  itemRatingText: {
    width: '25%',
    fontSize: 12,
    color: '#585757',
    textAlign: 'right',
  },
  bImage: {
    width: '90%',
    height: 160,
    zIndex: 1,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'rgb(126,83,191)',
    borderRadius: 20,
    borderRadius: 20,
  },
  bImage1: {
    width: '100%',
    height: 160,
    zIndex: 0,
     
    overflow: 'hidden',
    borderRadius: 20,
    borderRadius: 20,
  },

  col1: {
     
    borderRadius: 18,
    textAlign: 'center',
  },
  col2: {
     
    borderRadius: 18,
    textAlign: 'center',
  },
  col3: {
     
    borderRadius: 18,
    textAlign: 'center',
  },
  col4: {
     
    borderRadius: 18,
    textAlign: 'center',
  },
  sView: {
    marginTop: -120,
    zIndex: 9999999999999,
  },

  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 56,
  },
  counterView: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    borderColor: '#888888',
    flexDirection: 'row',
    width: 80,
    height: 27,
    paddingTop: 3,
    marginTop: 5,
  },
  minusText: {
    textAlign: 'center',
    width: '33%',
    fontSize: 13,
  },
  counterText: {
    textAlign: 'center',
    width: '34%',
    fontSize: 13,
  },
  plusText: {
    textAlign: 'center',
    width: '33%',
    fontSize: 13,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: -50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#fff',
    marginTop: 53,
    width: '80%',
  },
  headerText5: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#000',
    marginTop: 10,
    width: '80%',
    fontFamily:poppins,

  },
  headerText0: {
    fontSize: 17,
     
    color: '#fff',
    marginTop: 29,
    textAlign: 'center',
  },
  headerText1: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily:poppins,

  },
  card: {
     
    width: '100%',
    marginBottom: 4,

    borderWidth: 1,
    borderRadius: 9,
    elevation: 1,
    borderColor: '#fefefe',
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 7,
  },
  locationText: {
    color: '#0B277F',
    textAlign: 'right',
    paddingTop: 2,
    marginRight: 10,
    fontSize: 12,
    fontFamily:poppins,

  },
  colImage: {
    width: '35%',
  },
  colContent: {
    width: '65%',
    flexDirection: 'column',
  },
  cImage: {
    alignSelf: 'center',
    marginTop: 5,
  },

  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },

  label: {
    color: '#555',
    paddingLeft: 15,
    marginTop: 10,
    fontFamily:poppins,

  },
  label1: {
    color: '#555',
    paddingLeft: 10,
    marginTop: 10,
    fontFamily:poppins,

  },
  labelZ: {
    color: '#454A65',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 13,
    fontFamily:poppins,

  },
  txt: {
    color: '#3D3838',
  },
  searchInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderRadius: 18,
    elevation: 1,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#ccc',
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#444',
    fontFamily:poppins,

  },
  input1: {
    width: '9%',
    height: 40,
    backgroundColor: '#aaa',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 25,
    color: '#222',
  },
  forgotText: {
    textAlign: 'right',
    marginRight: 30,
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
    fontFamily:poppins,

  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
    fontFamily:poppins,

  },

  createText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    fontFamily:poppins,

  },
  locImageView: {
    marginTop: -14,
  },
  locImage: {
     
    width: 10,
    height: 10,
    width: 10,
    paddingRight: 4,
  },
  submitButton: {
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#0B277F',
    borderWidth: 1,
    borderColor: '#0B277F',
    borderRadius: 10,
    width: '90%',
     
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  submitButton1: {
    marginTop: 20,
    borderColor: '#0B277F',
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
     
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily:poppins,
    fontSize:10


  },
  submitButtonText1: {
    color: '#0B277F',
    textAlign: 'center',
    fontFamily:poppins,
    fontSize:10

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
