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
import {SERVER_URL} from '../../config/server';
import { connect } from 'react-redux';
import { poppins } from '../../config/fonts';
var moment = require('moment');

import { withNavigationFocus } from "react-navigation";

class Hires extends Component {
  constructor(props) {
    super();
     
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      loaderVisible: false,
      forgotVisible: false,
      orders: false,
      email: '',
      password: '',
      total: false,
      email1: '',
      customer: false,
      cartItems: false,
      deliveryInfo: false,
      fromDate: new Date(),
      toDate: new Date(),
      service:'',
      location:''
    };
  }




  componentDidMount(){
    this.setState({customer: this.props.user}, ()=>{
      this.getOrders();
    })
  }

  componentDidUpdate(prevProps, prevState){
    if((prevState.rateVisible !== this.state.rateVisible) && this.state.rateVisible === false){
       
      this.getOrders();
    }
  }

  componentWillUnmount(){
    
  }

  getOrders() {
    this.showLoader();
     
    fetch(`${SERVER_URL}/mobile/get_hires/${this.state.customer.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.hideLoader();
        if (res.success) {
          this.setState({
            orders: res.hires,
          });
        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(
          'Something happened!',
          error,
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Refresh', onPress: () => this.getOrders()},
          ],
        );
      });
  }

  hireDriver() {
    if (this.state.location === "" || this.state.fromDate === '' || this.state.toDate=== ""  || this.state.service === "") {
      this.showAlert('Info', 'Kindly provide all information');
      return;
    }
    this.setState({
      rateVisible: false,
    });
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/create_hire`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.customer.id,
        location: this.state.location,
        service: this.state.service,
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


  showAlert(type, message) {
    Alert.alert(type, message);
  }
  displayNoData(data) {
     
    console.log(data, 'hdhdhdhd');
    if (data.length < 1) {
      return (
        <View style={styles.noView}>
          <Image
            source={require('@src/images/no.png')}
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

  displayStatus(order_status) {
  const case_items = {
    'Cancelled':'#ED4515',
    'Pending':'#0B277F',
    'Completed': '#3EC628'
  }

  return <Text style={{color: case_items[order_status]}}>{order_status}</Text>;

  }

  gotoOrderDetails(order) {
    this.props.navigation.navigate('HireDetails', {
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




  render() {
    const {visible} = this.state;
    return (
      <View style={styles.body}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.pop()}>
            <Icon
              name="arrow-back"
              size={25}
              color="#000"
              style={styles.menuImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Hires</Text>
        </View>
        <TouchableOpacity
          style={styles.specialmvmt}
          onPress={() => this.setState({rateVisible: true})}>
          <Text style={styles.requestText}>Hire a Driver </Text>
        </TouchableOpacity>
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>

            {this.state.orders && this.displayNoData(this.state.orders)}
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
            <KeyboardAvoidingView behavior="position">

          <View style={styles.rateModalView}>

            <Text style={styles.headerText7}>Hire a driver</Text>

            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                this.setState({location: text});
              }}
              underlineColorAndroid="transparent"
              
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
                display="default"
                onChange={this.onToChange}
              />
            )}
            <Text style={styles.inputLabel}>
              What do you need the driver for?
            </Text>
            <TextInput
              style={styles.inputk}
              onChangeText={text => {
                this.setState({service: text});
              }}
              underlineColorAndroid="transparent"
              multiline={true}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.hireDriver()}>
              <Text style={styles.submitButtonText}>Hire a driver </Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>

        </Modal>
      </View>
    );
  }
}
const mapStateToProps = (state, others) =>{
  return {user: state.user.value, ...others}
}

export default connect(mapStateToProps)(Hires);


const styles = StyleSheet.create({
  specialmvmt: {
    backgroundColor: '#0B277F',
    width: 150,
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
    height: 100,
    zIndex: 0,
    flexDirection: 'row',
  },
  cartImage: {
    width: 21,
    height: 15,
    marginRight: 30,
    marginTop: 50,
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
  requestText: {
    color: 'white',
    borderRadius: 10,
    zIndex: 10,
    fontFamily:poppins,

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
    alignSelf: 'center',
    height: 600,
    width: '90%',
    backgroundColor: '#FFF',
    paddingTop: 18,
    paddingBottom: 38,
  },
  headerText7: {
    color: '#333',
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
    fontFamily:poppins,
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
  sView: {},
  bImage1: {
    width: '100%',
    height: 220,
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
    marginTop: 50,
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
    fontSize: 18,
    paddingLeft: 10,
    color: '#000',
    marginTop: 50,
    width: '80%',
    fontFamily:poppins,
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontFamily:poppins
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
  segmentText: {
    paddingRight: 10,
    marginRight: 10,
  },
  contentText: {
    fontWeight: 'bold',
    fontFamily:poppins,
  },
  contentText1: {
    color: '#5D626A',
  },

  label: {
    color: '#454A65',
    marginTop: 10,
    fontSize: 12,
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
    fontFamily:poppins,
  },
  inputLabel: {
    color: '#454A65',
    fontWeight: '700',

    fontSize: 12,
    width: '90%',
    alignSelf: 'center',
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
    fontFamily:poppins,

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
    height:'100%',
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
