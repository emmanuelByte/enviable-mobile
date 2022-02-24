import React, {Component, useEffect, useState} from 'react';
import {
  AppState,
  View,
  Text,
  Share,
  Alert,
  Image,
  TouchableWithoutFeedback,
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
  AsyncStorage,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {SERVER_URL} from '../../config/server';
import ShadowView from 'react-native-simple-shadow-view';
import Card from './Card';
import { connect, useDispatch, useSelector } from 'react-redux';
import { poppins } from '../../config/fonts';
import { logUserOut } from '../../redux/slices/userSlice';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function SideBar({sideMenuState, navigation}){
const [sideMenuModalVisible, setsideMenuModalVisible] = useState(false);
const dispatch = useDispatch();
const user = useSelector(state => state.user);
useEffect(()=>{
  if(sideMenuState !== sideMenuModalVisible){
    setsideMenuModalVisible(sideMenuState);
    
  }
}, [sideMenuState]);

function navigate(location){

setsideMenuModalVisible(false)
navigation.push(location);

}

  return (<>
  {console.log(user.value.first_name, "User djnhfj")}
     <Modal
          isVisible={sideMenuModalVisible}
          onBackdropPress={() => {
            setsideMenuModalVisible(false);
          }}
          height={'100%'}
          width={'100%'}
          style={styles.sideMenuModal}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          swipeDirection={'left'}
          onSwipeComplete={left => {
            setsideMenuModalVisible(false);
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#0B277F', '#0B277F']}
            style={styles.modalContainer}>
            <ScrollView>
              <TouchableOpacity
                onPress={()=> navigate('Profile')}
                style={styles.topRow}>
                <View style={styles.topImageView}>

                  {user.photo_base64 === null ? (
                    <Image
                      source={require('@src/images/round-profile.png')}
                      style={styles.userImage}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: user.value.photo_base64,
                      }}
                      style={styles.userImage}
                    />
                  )}
                </View>
                <View style={styles.topTextView}>
                  {user.value && (
                    <Text style={styles.topTextName}>
                      {user.value.first_name}{' '}
                      {user.value.last_name}
                    </Text>
                  )}
                  <Text style={styles.topLocation}>VIEW PROFILE</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.linkBody}>
                <TouchableOpacity
                  onPress={()=>navigation.navigate('Home')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/dashboard.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Dashboard</Text>
                  </View>
                </TouchableOpacity>


              <TouchableOpacity
                  onPress={()=>navigate('RideShareHome')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/haulage.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Book A Ride</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=>navigate('DispatchOrders')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/haulage.png')}
                      style={styles.dash1}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Your haulages</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=>navigate('RideOrders')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/history-1.png')}
                      style={styles.dash9}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Your rides</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                     
                    navigate('Hires');
                  }}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/hire.png')}
                      style={styles.dashk}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Hire a driver</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                      navigate('SpecialMovement');
                  }}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/ride-icon.png')}
                      style={styles.dashl}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Hire a car</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigate('Transactions')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/wallet.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Transactions</Text>
                  </View>
                </TouchableOpacity>
        
                <TouchableOpacity
                  onPress={()=>navigate('Help')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/helpp.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Help</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                     
                    dispatch(logUserOut());
                     
                     
                  }}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('@src/images/log.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={[{...styles.textLink, color:'red'}]}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </Modal>
  </>)
}

const mapStateToProps= (state, other)=>{
  return {...state,...other}
}
export default connect(mapStateToProps)(SideBar);

 

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sideMenuModal: {
    margin: 0,
  },
  modalContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#407BFF',
    margin: 0,
  },
  modalB: {
    height: '100%',
  },
  body: {
    minHeight: '100%',
     
  },
  bImage: {
    width: '100%',
    height: 220,
    zIndex: 1,
    backgroundColor: 'rgb(126,83,191)',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },
  inviteView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FDF8CC',
    borderRadius: 3,
    flexDirection: 'row',
    marginTop: 20,
  },
  inviteText: {
    width: '60%',
    fontSize: 12,
    
    color: '#6A2CB3',
    paddingTop: 15,
    paddingLeft: 15,
     
  },
  inviteImageView: {
    paddingRight: 20,
    width: '40%',
  },
  inviteImage: {
    width: 88,
    height: 82,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  bImage1: {
    width: '100%',
    height: '100%',
    zIndex: 0,
     
    overflow: 'hidden',
  },
  logoImage: {
     
     
    width: 80,
    height: 80,
     
  },
  menuImage: {
     
     
    width: 22,
    height: 22,
     
  },
  dash: {
    width: 18,
    height: 18,
    marginTop: 13,
    marginBottom: 10,
  },
  dash1: {
    width: 20,
    height: 13,
    marginTop: 15,
    marginBottom: 10,
  },
  dash9: {
    width: 16,
    height: 16,
    marginTop: 15,
    marginBottom: 10,
  },

  dashl: {
    width: 20,
    height: 19,
    marginTop: 10,
    marginBottom: 10,
  },
  dashk: {
    width: 16,
    height: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  menuImageView: {
    zIndex: 999999999999999,
    width: '100%',
     
    height: 15,
    paddingLeft: 20,
    paddingRight: 40,
    paddingBottom: 20,
     
    paddingTop: 40,
     
  },
  bottomView: {
     
    alignSelf: 'center',
     
     
    marginTop: 10,
    marginBottom: 100,
     
     
  },
  tButton: {
     
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
    width: '50%',
     
    marginRight: 5,
    paddingTop: 7,
    paddingBottom: 8,
    marginTop: 10,
    zIndex: 999999999999,
    marginLeft: 20,
  },
  tButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#fff',
    marginTop: 10,
  },
  headerText1: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 30,
  },
  card: {
     
    width: '45%',
    height: 180,
    marginBottom: 13,
    marginLeft: '10%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  card8: {
     
    width: '45%',
    height: 180,
    marginBottom: 13,
    marginLeft: '10%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  card1: {
     
     
    height: 180,
    width: '45%',
    marginBottom: 13,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  colImage: {
    width: '35%',
    alignSelf: 'center',
  },
  colContent: {
     
    flexDirection: 'column',
  },
  tImage1: {
    width: 24,
    height: 30,
    alignSelf: 'flex-end',
  },
  tImage2: {
    width: 35,
    height: 30,
    alignSelf: 'flex-end',
  },
  tImage3: {
     
    width: 37,
    height: 30,
    alignSelf: 'flex-end',
  },
  tImage4: {
    width: 37,
    height: 30,
    alignSelf: 'flex-end',
  },
  cImage: {
    alignSelf: 'center',
    marginTop: 30,
    width: 60,
    height: 60,
  },
  cImage1: {
    alignSelf: 'center',
    marginTop: 30,
    width: 60,
    height: 60,
  },
  cImage2: {
    alignSelf: 'center',
    marginTop: 30,
    width: 60,
    height: 60,
  },
  cImage3: {
    alignSelf: 'center',
    marginTop: 30,
    width: 60,
    height: 60,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#000',
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },
  contentText2: {
    color: '#000',
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },
  contentText3: {
    color: '#000',
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },
  contentText4: {
    color: '#000',
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },

  label: {
    color: '#ddd',
    paddingLeft: 25,
    marginTop: 13,
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#5E4385',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#ccc',
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
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  createText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },

  submitButton: {
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#ED6315',
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
    textAlign: 'center',
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

  top: {
     
    width: '100%',
     
  },

  row: {
    flexDirection: 'row',
    width: '85%',
    alignSelf: 'center',
    marginTop: 10,
  },

  row1: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
  },
  bCol1: {
    width: '50%',
    paddingBottom: 15,
    paddingTop: 15,
  },
  lText1: {
    color: '#0B277F',
     
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  bCol2: {
    width: '50%',
    backgroundColor: '#0B277F',
    borderTopLeftRadius: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  lText2: {
    color: '#fff',
     
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },

  topRow: {
    flexDirection: 'row',
    width: '100%',
    height: 120,
    paddingTop: 50,
  },
  topImageView: {
    paddingLeft: 15,
    width: '25%',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
     
     
  },
  topTextView: {
    paddingLeft: 20,
    paddingTop: 15,
    width: '75%',
  },
  linkItem: {
    width: '100%',
    paddingLeft: 15,
    flexDirection: 'row',
    marginVertical: 5,
  },
  linkBody: {
    paddingTop: 25,
    paddingLeft: 10,
  },
  linkBodyBottom: {
    borderTopColor: '#eee',
    borderTopWidth: 1,
    marginTop: 35,
    paddingLeft: 20,
    paddingTop: 20,
  },
  linkItemBottom: {
    width: '100%',
     
    flexDirection: 'row',
    marginBottom: 5,
  },
  textLink: {
    paddingTop: 3,
    fontSize: 15,
    color: '#fff',
    fontFamily:poppins
  },
  textLinkBottom: {
    paddingTop: 7,
    fontSize: 16,
    color: '#fff',
  },
  current: {
    paddingTop: 0,
    fontSize: 16,
    color: '#cc5490',
  },
  iconView: {
    width: '20%',
  },
  iconViewBottom: {
    width: '20%',
  },
  textView: {
    width: '80%',
    paddingTop: 7,
    fontFamily:poppins
  },
  linkIcon: {
    width: 20,
    height: 20,
     
  },

  profilePix: {
    width: 60,
    height: 60,
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  topBackground: {
    width: '100%',
    height: 80,
    backgroundColor: '#2a486c',
  },

  topLocation: {
    color: '#fff',
    fontSize: 10,
  },
  topTextName: {
    color: '#fff',
    fontFamily:poppins,
    fontWeight: '600',
    fontSize: 14,
  },
});
