import React, {Component} from 'react';
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
import {SERVER_URL} from './config/server';
import ShadowView from 'react-native-simple-shadow-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class Home extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      email1: '',
      customer: false,
      customer_id: '',
      sideMenuModalVisible: false,
      balance: false,
      top: 40,
      photo_base64: '',
    };
    //AsyncStorage.clear();
  }

  async componentWillMount() {}

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    Alert.alert(
      'Confirm exit',
      'Are you sure you want to exit this app?',
      [
        {
          text: 'Stay here',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
        {text: 'Leave', onPress: () => BackHandler.exitApp()},
      ],
      //{ cancelable: false }
    );
    return true;
  };

  async componentDidFocus() {
    await this.getLoggedInUser();
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', payload =>
        this.componentDidFocus(payload),
      ),
    ];
    if (height < 750) {
      this.setState({
        top: '2%',
      });
    }
    // else if(height < 700 && height > 600){
    //   this.setState({
    //     top: '20%'
    //   })
    // }
    else if (height < 750 && height > 650) {
      this.setState({
        top: '2%',
      });
    }
    // else if(height < 750 && height > 700){
    //   this.setState({
    //     top: '10%'
    //   })
    // }
    else if (height > 750) {
      this.setState({
        top: '3%',
      });
    }
    // else if( height > 800){
    //   this.setState({
    //     top: '10%'
    //   })
    // }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
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

  async getLoggedInUser() {
    await AsyncStorage.getItem('customer').then(value => {
      if (value) {
        //this.props.navigation.navigate('Home')
        console.log(JSON.parse(value), 'lllJSON.parse(value)');

        this.setState(
          {
            customer: JSON.parse(value),
          },
          () => {
            //this.getTransactions();
            this.setState({
              customer_id: this.state.customer.id,
            });
          },
        );
      } else {
        //this.props.navigation.navigate('Login')
      }
    });
  }

  getTransactions() {
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_transactions/${this.state.customer.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        console.log(res, 'Transactions');
        this.hideLoader();
        if (res.success) {
          this.setState({
            transactions: res.transactions,
            balance: res.balance,
            transactions1: res.credit_transactions,
            creditTransactions: res.credit_transactions,
            debitTransactions: res.debit_transactions,
          });
        } else {
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
            {text: 'Refresh', onPress: () => this.getTransactions()},
          ],
          //{ cancelable: false }
        );
      });
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Get the Rickreen app from the playstore and register with my refferal code: ' +
          this.state.customer.referral_code +
          ' and win free credit for deliveries',
      });
      if (result.action === Share.sharedAction) {
        console.log(result);
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

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

  showSideMenu() {
    console.log(
      this.state.customer.first_name,
      'this.state.customer.first_name',
    );
    if (this.state.customer.first_name != null) {
      this.setState({
        sideMenuModalVisible: true,
      });
    } else {
      Alert.alert(
        'Info',
        "Kindly log in to your account or creat an account if you haven't done so!",
      );
    }
  }

  hideSideMenu() {
    this.setState({
      sideMenuModalVisible: false,
    });
  }

  displaySignin() {
    if (this.state.customer.first_name == null) {
      return (
        <View style={styles.row1}>
          <TouchableOpacity
            style={styles.bCol1}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.lText1}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bCol2}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.lText2}>Login</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.row1}>
          <TouchableOpacity style={styles.bCol1} onPress={() => this.logout()}>
            <Text style={styles.lText1}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bCol2}
            onPress={() => this.props.navigation.navigate('Profile')}>
            <Text style={styles.lText2}>Profile</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  logout() {
    AsyncStorage.removeItem('customer');
    this.props.navigation.navigate('Login');
  }

  gotoNewDispatch(type) {
    if (this.state.customer.first_name == null) {
      Alert.alert(
        'Info',
        "Kindly log in to your account or creat an account if you haven't done so!",
      );
    } else {
      this.props.navigation.navigate('NewDispatch', {
        type: type,
      });
    }
  }

  gotoPage(page) {
    if (this.state.customer.first_name == null) {
      Alert.alert(
        'Info',
        "Kindly log in to your account or creat an account if you haven't done so!",
      );
    } else {
      this.props.navigation.navigate(page);
    }
  }

  navigateToScreen = route => () => {
    this.hideSideMenu();
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
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} />
        <View style={[styles.bImage1]}>
          <TouchableOpacity
            style={[{marginTop: this.state.top}, styles.menuImageView]}
            onPress={() => this.showSideMenu()}>
            <Image
              source={require('./imgs/home-menu.png')}
              style={styles.menuImage}
            />
          </TouchableOpacity>
          <Image
            source={require('./imgs/logoo.png')}
            style={styles.logoImage}
          />
          {/* this.state.customer && 
              <Text style = {styles.headerText}>Hello {this.state.customer.first_name}! </Text>
              */}
          {/*
            <Image source = {require('./imgs/rickreen-logo.png')} style = {styles.logo} />
              */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.bottomView}>
              <View style={styles.top}>
                <View style={styles.row}>
                  <TouchableWithoutFeedback
                    onPress={() => this.gotoPage('RideShareHome')}>
                    <ShadowView style={styles.card1}>
                      <Image
                        source={require('./imgs/t2.png')}
                        style={styles.tImage2}
                      />
                      <View style={styles.colImage}>
                        <Image
                          source={require('./imgs/hb.png')}
                          style={styles.cImage1}
                        />
                      </View>
                      <View style={styles.colContent}>
                        <Text style={styles.contentText2}>Book a ride</Text>
                      </View>
                    </ShadowView>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => this.gotoPage('SpecialMovement')}>
                    <ShadowView style={styles.card8}>
                      <Image
                        source={require('./imgs/t3.png')}
                        style={styles.tImage3}
                      />
                      <View style={styles.colImage}>
                        <Image
                          source={require('./imgs/hc.png')}
                          style={styles.cImage2}
                        />
                      </View>
                      <View style={styles.colContent}>
                        <Text style={styles.contentText3}>
                          Special movement
                        </Text>
                      </View>
                    </ShadowView>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.row}>
                  <TouchableWithoutFeedback
                    onPress={() => this.gotoPage('Hires')}>
                    <ShadowView style={styles.card1}>
                      <Image
                        source={require('./imgs/t3.png')}
                        style={styles.tImage4}
                      />
                      <View style={styles.colImage}>
                        <Image
                          source={require('./imgs/hd.png')}
                          style={styles.cImage3}
                        />
                      </View>
                      <View style={styles.colContent}>
                        <Text style={styles.contentText4}>Hire a driver</Text>
                      </View>
                    </ShadowView>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => this.gotoNewDispatch('Haulage')}>
                    <ShadowView style={styles.card}>
                      <Image
                        source={require('./imgs/t1.png')}
                        style={styles.tImage1}
                      />
                      <View style={styles.colImage}>
                        <Image
                          source={require('./imgs/ha.png')}
                          style={styles.cImage}
                        />
                      </View>
                      <View style={styles.colContent}>
                        <Text style={styles.contentText1}>Haulage service</Text>
                      </View>
                    </ShadowView>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        {this.displaySignin()}

        <Modal
          isVisible={this.state.sideMenuModalVisible}
          onBackdropPress={() => {
            this.setState({sideMenuModalVisible: false});
          }}
          height={'100%'}
          width={'100%'}
          style={styles.sideMenuModal}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          swipeDirection={'left'}
          onSwipeComplete={left => {
            this.setState({sideMenuModalVisible: false});
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#0B277F', '#0B277F']}
            style={styles.modalContainer}>
            <ScrollView>
              <TouchableOpacity
                onPress={this.navigateToScreen('Profile')}
                style={styles.topRow}>
                <View style={styles.topImageView}>
                  {/* <Image source = {require('./imgs/round-profile.png')} style = {styles.userImage} /> */}

                  {this.state.photo_base64 === null ? (
                    <Image
                      source={require('./imgs/round-profile.png')}
                      style={styles.userImage}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: this.state.customer.photo_base64,
                      }}
                      style={styles.userImage}
                    />
                  )}
                </View>
                <View style={styles.topTextView}>
                  {this.state.customer && (
                    <Text style={styles.topTextName}>
                      {this.state.customer.first_name}{' '}
                      {this.state.customer.last_name}
                    </Text>
                  )}
                  <Text style={styles.topLocation}>VIEW PROFILE</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.linkBody}>
                <TouchableOpacity
                  onPress={this.navigateToScreen('Home')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/dashboard.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Dashboard</Text>
                  </View>
                </TouchableOpacity>

                {/*
              <TouchableOpacity onPress={this.navigateToScreen('MerchantCategories')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="motorcycle" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Short errands</Text>
                </View>
              </TouchableOpacity>
              
              
              <TouchableOpacity onPress={this.navigateToScreen('EatMerchant')} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                <Icon.Button name="restaurant" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >Errand Eat</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity  onPress={() => { this.hideSideMenu(); this.gotoNewDispatch("Courier")}} style = {styles.linkItem}>
                <View style = {styles.iconView}>
                  <Icon.Button name="directions-car" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                  </Icon.Button>  
                </View>
                <View style = {styles.textView}>
                  <Text style = {styles.textLink} >New Dispatch services</Text>
                </View>
              </TouchableOpacity>
              */}

                <TouchableOpacity
                  onPress={this.navigateToScreen('DispatchOrders')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/haulage.png')}
                      style={styles.dash1}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Your haulages</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.navigateToScreen('RideOrders')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/history-1.png')}
                      style={styles.dash9}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Your rides</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({sideMenuModalVisible: false});
                    this.gotoPage('Hires');
                  }}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/hire.png')}
                      style={styles.dashk}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Hire a driver</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({sideMenuModalVisible: false});
                    this.gotoPage('SpecialMovement');
                  }}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/ride-icon.png')}
                      style={styles.dashl}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Special movement</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.navigateToScreen('Transactions')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/wallet.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Transactions</Text>
                  </View>
                </TouchableOpacity>
                {/*<TouchableOpacity onPress={this.navigateToScreen('Feedback')} style = {styles.linkItem}>
                    <View style = {styles.iconView}>
                    <Icon.Button name="notifications" style = {styles.star} size={25} backgroundColor="transparent" color="#fff" >
                      </Icon.Button>  
                    </View>
                    <View style = {styles.textView}>
                      <Text style = {styles.textLink} >Notificatons</Text>
                    </View>
                 </TouchableOpacity>*/}
                <TouchableOpacity
                  onPress={this.navigateToScreen('Help')}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/helpp.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Help</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    AsyncStorage.removeItem('customer');
                    this.hideSideMenu();
                    this.props.navigation.navigate('Login');
                  }}
                  style={styles.linkItem}>
                  <View style={styles.iconView}>
                    <Image
                      source={require('./imgs/log.png')}
                      style={styles.dash}
                    />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.textLink}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </Modal>
      </View>
    );
  }
}

export default Home;

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
    //backgroundColor: "#ebf7fe",
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
    //fontWeight: 'bold',
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
    //opacity: 0.6,
    overflow: 'hidden',
  },
  logoImage: {
    marginTop: -25,
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  menuImage: {
    //marginLeft: 20,
    //marginTop: 69,
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
    //backgroundColor: '#000',
    height: 15,
    paddingLeft: 20,
    paddingRight: 40,
    paddingBottom: 20,
    //marginLeft: 20,
    paddingTop: 40,
    //elevation: 2,
  },
  bottomView: {
    //width: '90%',
    alignSelf: 'center',
    //position: 'absolute',
    //bottom: 0,
    marginTop: 10,
    marginBottom: 100,
    //paddingLeft: 20,
    //paddingRight: 20,
  },
  tButton: {
    //marginTop: 20,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
    width: '50%',
    //alignSelf: 'flex-end',
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
    //flexDirection: 'row',
    width: '45%',
    height: 180,
    marginBottom: 13,
    marginLeft: '10%',
    backgroundColor: '#fff',

    borderRadius: 20,
    padding: 15,
  },
  card8: {
    //flexDirection: 'row',
    width: '45%',
    height: 180,
    marginBottom: 13,
    marginLeft: '10%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
  },
  card1: {
    //flexDirection: 'row',
    //alignSelf: 'flex-end',
    height: 180,
    width: '45%',
    marginBottom: 13,

    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
  },
  colImage: {
    width: '35%',
    alignSelf: 'center',
  },
  colContent: {
    //width: '95%',
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
    //marginTop: 10,
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
    // width: '100%',
    // height: '100%',
    // opacity: 0.9,
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
    // width: '100%',
    // height: '100%',
    // opacity: 0.9,
    alignSelf: 'center',
    height: 280,
    width: '90%',
    backgroundColor: '#FFF',
    paddingTop: 18,
  },

  top: {
    //marginBottom: 60,
    width: '100%',
    //height: '100%'
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
    //width: '50%',
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
    //width: '50%',
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
    //borderColor: '#9c77b1',
    //borderWidth: 6,
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
    marginBottom: 2,
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
    //paddingLeft: 20,
    flexDirection: 'row',
    marginBottom: 5,
  },
  textLink: {
    paddingTop: 3,
    fontSize: 16,
    color: '#fff',
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
  },
  linkIcon: {
    width: 20,
    height: 20,
    //paddingRi: 20,
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
    fontWeight: '600',
    fontSize: 14,
  },
});
