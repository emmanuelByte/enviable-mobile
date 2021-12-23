import React, {Component} from 'react';
import {
  AppState,
  View,
  Text,
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
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {SERVER_URL} from './config/server';
var moment = require('moment');
export class SpecialMovement extends Component {
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
      orders: false,
      email: '',
      location: '',
      service: '',
      note: '',
      vehicle_type: '',
      password: '',
      total: false,
      email1: '',
      customer: false,
      cartItems: false,
      deliveryInfo: false,
      fromDate: new Date(),
      toDate: new Date(),
      vs: [
        {label: 'Event', value: 'Event'},
        {label: 'Wedding ceremony', value: 'Wedding ceremony'},
        {label: 'Burial', value: 'Burial'},
        {label: 'Birthday Party', value: 'Birthday Party'},
        {label: 'Relocation', value: 'Relocation'},
        {label: 'Other', value: 'Other'},
      ],
      vs1: [
        {label: 'Car', value: 'Car'},
        {label: 'Pickup truck', value: 'Pickup truck'},
        {label: 'Bus', value: 'Bus'},
        {label: 'SUV', value: 'SUV'},
      ],
    };
    //this.getLoggedInUser();
  }

  async componentDidFocus() {
    await this.getLoggedInUser();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.subs.forEach(sub => sub.remove());
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentWillMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', payload =>
        this.componentDidFocus(payload),
      ),
    ];
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  getOrders() {
    this.showLoader();
    fetch(
      `${SERVER_URL}/mobile/get_special_movements/${this.state.customer.id}`,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        console.log(res, 'orders');
        this.hideLoader();
        if (res.success) {
          this.setState({
            orders: res.special_movements,
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
            {text: 'Refresh', onPress: () => this.getOrders()},
          ],
          //{ cancelable: false }
        );
      });
  }

  hireDriver() {
    if (
      this.state.location == '' ||
      this.state.service == '' ||
      this.state.note == '' ||
      this.state.vehicle_type == ''
    ) {
      this.showAlert(
        'Info',
        'Kindly provide location and service, note and vehicle type',
      );
      return;
    }
    this.setState({
      rateVisible: false,
    });
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/create_special_movement`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.customer.id,
        location: this.state.location,
        note: this.state.note,
        service: this.state.service,
        vehicle_type: this.state.vehicle_type,
        fromDate: moment(this.state.fromDate).format('YYYY/MM/DD'),
        toDate: moment(this.state.toDate).format('YYYY/MM/DD'),
      }),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.getOrders();
        this.hideLoader();
        if (res.success) {
          Alert.alert('Success', res.success);
        } else {
          this.showAlert('Error', res.error);
        }
      })
      .done();
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
  displayNoData() {
    var data = this.state.orders.length;
    console.log(data, 'hdhdhdhd');
    if (data < 1) {
      return (
        <View style={styles.noView}>
          <Image
            source={require('./imgs/no.png')}
            style={styles.noImage}></Image>
          <Text style={styles.ndt}>You have no request at the moment...</Text>
        </View>
      );
    }
  }

  onFromChange = (event, selectedDate) => {
    var currentDate = selectedDate || new Date();
    this.setState(
      {
        fromDate: currentDate,
        showFrom: false,
      },
      () => {},
    );
  };
  onToChange = (event, selectedDate) => {
    var currentDate = selectedDate || new Date();
    this.setState(
      {
        toDate: currentDate,
        showTo: false,
      },
      () => {},
    );
  };

  async getLoggedInUser() {
    await AsyncStorage.getItem('customer').then(value => {
      if (value) {
        this.setState(
          {
            customer: JSON.parse(value),
          },
          () => {
            this.getOrders();
            this.setState({
              customer_id: this.state.customer.id,
            });
          },
        );
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }
  displayStatus(order_status) {
    if (order_status == 'Cancelled') {
      return <Text style={{color: '#ED4515'}}>Cancelled</Text>;
    } else if (order_status == 'Pending') {
      return (
        <Text
          style={{
            color: '#0B277F',
            width: 90,
            borderRadius: 10,
            alignSelf: 'flex-end',
            textAlign: 'center',
            paddingTop: 5,
            paddingBottom: 5,
          }}>
          Pending
        </Text>
      );
    } else if (order_status == 'Pending') {
      return <Text style={{color: '#EDBD15'}}>Pending </Text>;
    } else if (order_status == 'Completed') {
      return <Text style={{color: '#3EC628'}}>Completed</Text>;
    }
  }

  gotoOrderDetails(order) {
    this.props.navigation.navigate('SpecialMovementDetails', {
      orderId: order.id,
    });
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
        <StatusBar translucent={true} backgroundColor={'#0B277F'} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <Icon
              name="arrow-back"
              size={18}
              color="#000"
              style={styles.menuImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Hire a car</Text>
        </View>

        <TouchableOpacity
          style={styles.specialmvmt}
          onPress={() => this.setState({rateVisible: true})}>
          <Text style={styles.requestText}>Request for a car</Text>
        </TouchableOpacity>

        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            {this.state.orders && this.displayNoData()}
            {this.state.orders &&
              this.state.orders.map((order, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => this.gotoOrderDetails(order)}>
                  <View style={styles.itemView}>
                    <View style={styles.item1}>
                      <Text style={styles.orderNumber}>
                        #{order.order_number}
                      </Text>
                      <Text style={styles.label}>{order.location} </Text>
                    </View>
                    <View style={styles.item2}>
                      <Text style={styles.price}>
                        {this.displayStatus(order.status)}
                      </Text>
                      <Text style={styles.date}>
                        <TimeAgo time={order.created_at} />
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
          </View>
        </ScrollView>
        {this.state.loaderVisible && (
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        )}

        <Modal
          isVisible={this.state.rateVisible}
          onBackdropPress={() => {
            this.setState({rateVisible: false});
          }}
          onBackButtonPress={() => {
            this.setState({rateVisible: false});
          }}
          height={'100%'}
          width={'100%'}
          style={styles.modal}>
          
          <KeyboardAvoidingView behavior="padding">

          <View style={styles.rateModalView}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
              <Text style={styles.headerText7}>Special movement</Text>

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  this.setState({location: text});
                }}
                underlineColorAndroid="transparent"
                //placeholder={'Location'}
                //keyboardType={'numeric'}
                //min={1}
                //value={this.state.review}
              />

              <Text style={styles.inputLabel}>From</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => this.setState({showFrom: true})}>
                <Text style={styles.dateText}>
                  {moment(this.state.fromDate).format('YYYY/MM/DD')}
                </Text>
              </TouchableOpacity>
              {this.state.showFrom && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.fromDate}
                  mode={'date'}
                  //is24Hour={true}
                  display="default"
                  onChange={this.onFromChange}
                />
              )}
              <Text style={styles.inputLabel}>To</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => this.setState({showTo: true})}>
                <Text style={styles.dateText}>
                  {moment(this.state.toDate).format('YYYY/MM/DD')}
                </Text>
              </TouchableOpacity>
              {this.state.showTo && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.toDate}
                  mode={'date'}
                  //is24Hour={true}
                  display="default"
                  onChange={this.onToChange}
                />
              )}

              <Text style={styles.inputLabel}>Vehicle type</Text>
              <TouchableOpacity style={[styles.input]}>
                <RNPickerSelect
                  placeholder=""
                  style={pickerSelectStyles}
                  selectedValue={this.state.vehicle_type}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({vehicle_type: itemValue})
                  }
                  items={this.state.vs1}
                  returnKeyType={'done'}
                />
              </TouchableOpacity>
              <Text style={styles.inputLabel}>Service</Text>
              <TouchableOpacity style={[styles.input]}>
                <RNPickerSelect
                  placeholder=""
                  style={pickerSelectStyles}
                  selectedValue={this.state.service}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({service: itemValue})
                  }
                  items={this.state.vs}
                  returnKeyType={'done'}
                />
              </TouchableOpacity>
              <Text style={styles.inputLabel}>Note</Text>
              <TextInput
                style={styles.inputk}
                onChangeText={text => {
                  this.setState({note: text});
                }}
                underlineColorAndroid="transparent"
                //placeholder={'What do you need the driver for?'}
                multiline={true}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.hireDriver()}>
                <Text style={styles.submitButtonText}>
                  Request for a car{' '}
                </Text>
              </TouchableOpacity>
            {/* </ScrollView> */}
          </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}

export default SpecialMovement;

const styles = StyleSheet.create({
  specialmvmt: {
    backgroundColor: '#0B277F',
    width: 230,
    position: 'absolute',
    bottom: 150,
    right: 20,
    padding: 8,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: '#f8f8f8',
  },
  cView: {
    minHeight: 1200,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    height: 110,
    zIndex: 0,
    //backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  cartImage: {
    width: 21,
    height: 15,
    marginRight: 30,
    marginTop: 75,
  },
  descContent: {
    color: '#535871',
    textAlign: 'justify',
  },
  itemView: {
    width: '95%',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
    //marginRight: 20,
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
    //flexDirection: 'row',
  },
  requestText: {
    color: 'white',
    // width: '95%',
    borderRadius: 10,
    // textAlign: 'right',
    //alignSelf: 'flex-end',
  },

  orderNumber: {
    color: '#000',
  },
  date: {
    color: '#999',
    paddingTop: 10,
    textAlign: 'right',
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    //paddingTop: 10,
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

  rateModalView: {
    // width: '100%',
    // height: '100%',
    // opacity: 0.9,
    alignSelf: 'center',
    height: 670,
    width: '90%',
    //marginRight: '10%',
    backgroundColor: '#FFF',
    paddingTop: 18,
    paddingBottom: 38,
  },
  headerText7: {
    color: '#333',
    //paddingLeft: 20,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  itemNameText: {
    paddingTop: 10,
    fontWeight: 'bold',
  },
  itemPriceText: {
    //paddingTop: 4,
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
    width: '75%',
  },
  itemRatingText: {
    width: '25%',
    fontSize: 12,
    color: '#585757',
    textAlign: 'right',
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  col1: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col2: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col3: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  col4: {
    //width: '20%',
    borderRadius: 18,
    textAlign: 'center',
  },
  sView: {},
  bImage1: {
    width: '100%',
    height: 220,
    //opacity: 0.6,
    overflow: 'hidden',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 75,
  },
  noView: {
    width: '100%',
    marginTop: '20%',
  },
  noImage: {
    width: 140,
    height: 150,
    alignSelf: 'center',
  },
  ndt: {
    textAlign: 'center',
    color: '#a8a8a8',
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
    marginTop: -60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#000',
    marginTop: 73,
    width: '80%',
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    //flexDirection: 'row',
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
  segmentText: {
    //textAlign: 'center',
    paddingRight: 10,
    marginRight: 10,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },

  label: {
    color: '#454A65',
    marginTop: 10,
    fontSize: 12,
    //width: '50%',
    //textAlign: 'right'
  },
  labelZ: {
    color: '#454A65',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 13,
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
  inputLabel: {
    color: '#454A65',
    fontWeight: '700',
    //marginTop: 10,

    fontSize: 12,
    width: '90%',
    alignSelf: 'center',
    //textAlign: 'right'
  },
  dateText: {
    paddingTop: 10,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#F9F9FB',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#000',
  },
  inputk: {
    width: '90%',
    height: 80,
    backgroundColor: '#F9F9FB',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#000',
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
  locImageView: {
    marginTop: -14,
  },
  locImage: {
    //marginTop: -7,
    width: 10,
    height: 10,
    width: 10,
    paddingRight: 4,
  },
  submitButton: {
    elevation: 2,
    marginTop: 10,
    backgroundColor: '#0B277F',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

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
});
