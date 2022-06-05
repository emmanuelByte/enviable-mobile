import React, { Component, useEffect, useState } from 'react';
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
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from './Modal';
import TimeAgo from 'react-native-timeago';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { SERVER_URL } from '../../config/server';
import { poppins } from '../../config/fonts';
import ModalForm from './Modal';
import { get, post } from '../../utils/api';
import { useSelector } from 'react-redux';
var moment = require('moment');
import { useIsFocused } from '@react-navigation/native'



const displayStatus = (order_status) => {

  const color_match = {
    'Cancelled': '#ED4515',
    'Pending': '#EDBD15',
    'Completed': 'green'
  };
  return (<Text style={{ color: color_match[order_status] }}>{order_status}</Text>);

}


function displayNoData() {
   
  return (
    <View style={styles.noView}>
      <Image
        source={require('@src/images/no.png')}
        style={styles.noImage}></Image>
      <Text style={styles.ndt}>You have no request at the moment...</Text>
    </View>
  );
}

function SpecialMovement(props) {

  const [specialMovements, setSpecialMovement] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const { value } = useSelector(state => state.user);
  const isFocused = useIsFocused();

  useEffect(() => {
    getOrders();
  }, [showModal, isFocused]);


  function gotoOrderDetails(order) {
     
    props.navigation.navigate('SpecialMovementDetails', {
      orderId: order.id,
    });
  }

  async function processData(data) {
    setShowModal(false);
    setLoader(true);

    const payload = {
      userId: value.id, 
      location: data.location,
      note: data.text, 
      service: data.service,
      vehicle_type: data.vehicleType, 
      fromDate: moment(data.fromDate).format('YYYY/MM/DD'),
      toDate: moment(data.toDate).format('YYYY/MM/DD'),
    }

    try {
      const response = await post('/mobile/create_special_movement', payload);
      await getOrders();
      setLoader(false);
      Alert.alert('Great!', response.success)  

    } catch (error) {
      setLoader(false);
      alert("Oops! We'll fix the issue quick");
    }


  }


  const getOrders = async () => {
    setLoader(true);
    try {
      const response = await get(`/mobile/get_special_movements/${value.id}`, {})
      setLoader(false);
      setSpecialMovement(response.special_movements)  

    } catch (error) {
      setLoader(false);
      alert("Oops! We'll fix the issue quick");

    }

  }


  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.pop()}>
          <Icon
            name="arrow-back"
            size={30}
            color="#000"
            style={[styles.menuImage]}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Hire A Car</Text>
      </View>


      <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
        <ModalForm showModal={showModal} hireDriver={processData} />
        <View style={styles.cView}>
          {specialMovements.length == 0 && displayNoData()}
          {specialMovements.length > 0 &&
            specialMovements.map((order, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => gotoOrderDetails(order)}>
                <View style={styles.itemView}>
                  <View style={styles.item1}>
                    <Text style={styles.orderNumber}>
                      #{order.order_number}
                    </Text>
                    <Text style={styles.label}>{order.location} </Text>
                  </View>
                  <View style={styles.item2}>
                    <Text style={styles.price}>
                      {displayStatus(order.status)}
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


      <TouchableOpacity
        style={styles.specialmvmt}
        onPress={() => setShowModal(new Boolean(true))}>
        <Text style={styles.requestText}>Request for a car</Text>
      </TouchableOpacity>

      {loader === true && (
        <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
      )}
    </>


  )
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
    height: 80,
     
     
     
    alignItems: 'center',
    padding: 10,

     
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
    height: 670,
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
     
    width: '80%',
    fontFamily: poppins
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: 'bold',
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

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    width: '100%',
    height: 40,
    borderColor: '#EFF0F3',
     
    borderRadius: 8,
    marginTop: -1,
    color: '#aaa',
  },
  inputIOS: {
    width: '100%',
    height: 40,
    borderColor: '#777',
     
    borderRadius: 8,
    marginTop: -1,
    color: '#aaa',
  },
});
