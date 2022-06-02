import React, { useEffect, useState } from 'react'
import {
  AppState,
  View,
  Text,
  Alert,
  Picker,
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
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {poppins} from '../../config/fonts';
import {SERVER_URL} from '@src/config/server';
import {get, post} from '../../utils/api';
import {useSelector} from 'react-redux';
import axios from "axios"
var moment = require('moment');

function InterState({navigation}) {
  const [destStates, setDestStates] = useState([]);
  const [statesId, setStatesId] = useState('');
  const [cities, setCities] = useState([]);
  const [citiesId, setCitiesId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [destCitiesId, setDestCitiesId] = useState('');
  const [pickUpCityId, setPickUpCityId] = useState('');
  const [dropOffCityId, setDropOffCityId ] = useState("");
  const [loader, setLoader] = useState(false);
  const [totalAmount, setTotalAmount] = useState({});

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [states2, setStates2] = useState([]);
  const [carType2, setCarType2] = useState([]);
  const [carTypeId, setCarTypeId] = useState('');
  const [showModalSubmit, setShowModalSubmit] = useState(false);

  const {value} = useSelector(state => state.user);

  console.log(value.id, 'wwwww');

  //! get drop down destination states

   const fetchDestCities = async () => {
     try {
       const response = await fetch(
         `${SERVER_URL}/mobile/fetch-city/${destinationId}`,
       );
       const descities = await response.json();
       console.log(descities.data.cities, 'yyyyyy');
       if (descities.success) {
         setDestStates(descities.data.cities);
       } else {
         Alert.alert('Error', response.error);
       }
     } catch (error) {
       console.log(error);
         Alert.alert(
           'Communictaion error',
           'Ensure you have an active internet connection',
           [
             {
               text: 'Ok',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
             },
             {text: 'Refresh', onPress: () => fetchDestCities()},
           ],
         );
     }
   };



  const fetchCities = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/mobile/fetch-city/${statesId}`,
      );
      const getcities = await response.json();
      console.log(getcities.data.cities, 'zzzzzzzzzzzzz');
      if (getcities.success) {
        setCities(getcities.data.cities);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //!  get car type
  const fetchCarType = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/mobile/interstate-cartypes`,
      );
      const result = await response.json();
      // console.log(result.data.car_types, 'zzzzzzzzzzzzz');
      if (result.success) {
        setCarType2(result.data.car_types);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.log(error);
       Alert.alert(
         'Communictaion error',
         'Ensure you have an active internet connection',
         [
           {
             text: 'Ok',
             onPress: () => console.log('Cancel Pressed'),
             style: 'cancel',
           },
           {text: 'Refresh', onPress: () => fetchCarType()},
         ],
       );
    }
  };


  //!get State
  const fetchState = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/mobile/fetch-state`);
      const result = await response.json();
      // console.log(result.data.states, '7777777777777777');
      if (result.success) {
        setStates2(result.data.states);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Communictaion error',
        'Ensure you have an active internet connection',
        [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Refresh', onPress: () => fetchState()},
        ],
      );
    }
  };

 



  //? console for fetch state
  const newState = states2?.map(r => {
    return {
      label: r.name,
      value: r.id,
    };
  });
  console.log(newState, '600');

  //? get cities locations
  const newCities = cities?.map(c => {
    return {
      label: c.location,
      value: c.id,
    };
  });
  console.log(newCities, "700")

  const desCities = destStates?.map(c => {
    return {
      label: c.location,
      value: c.id,
    };
  });
  console.log(desCities, "900")

  //? get car-type label and values
  const newCarType = carType2?.map(v => {
    return {
      label: v.type,
      value: v.id,
    };
  });
  console.log(newCarType, '800');
  //handle changes
  const pickUpChange = value => {
    const stateID = value;
    console.log(stateID, '888');
    setStatesId(stateID);
  };
  const pickupCities = (value, item) => {
    const cityId = value;
    const cityName = item;
    console.log(cityId, cityName,'9999');
    setCitiesId(cityId, cityName);
    setPickUpCityId(cityName);
  };
  console.log(citiesId, 'pick_up_adress')
  console.log(pickUpCityId, 'pick_up_id');


  const handleDestination = value => {
    const destStatesId = value;
    console.log(destStatesId, 'ppppp');
    setDestinationId(destStatesId);
  };
  const handleDestCities = (value,item) => {
    const destCitiesId = value;
    const dropoffId = item;
    console.log(destCitiesId,dropoffId, 'hhhhhh');
    setDestCitiesId(destCitiesId, dropoffId);
    setDropOffCityId(dropoffId);
  };
  console.log(destCitiesId, "drop_off_address");
  console.log(dropOffCityId, 'drop_off_city_id')

  //  handleDatefrom
  const onFromChange = (event, selectedDate) => {
    var currentDate = selectedDate || new Date();
    setFromDate(currentDate);
    setShowFrom(false);
  };
  //handletoDate
  const onToChange = (event, selectedDate) => {
    var currentDate = selectedDate || new Date();
    setToDate(currentDate);
    setShowTo(false);
  };

  //! Api call now
  

  
  async function processData(data) {
    // setShowModal(false);

     if (
       pickUpCityId == '' ||
       dropOffCityId == '' ||
       statesId == '' ||
       destinationId == '' ||
       citiesId == '' ||
       destCitiesId == ''
     ) {
       Alert.alert(
         'Info',
         'Kindly provide pick up city and drop off city'
       );
       setShowModalSubmit(false);
       return;
     } else if (citiesId === destCitiesId){
         Alert.alert(
           'Info',
         'Pick up city and drop off city cannot be same'
         
         )
          setShowModalSubmit(false);
          return;
       } else {
       setLoader(true);
       const payload = {
         user_id: value.id,
         pickup_city_id: citiesId,
         dropoff_city_id: destCitiesId,
         pick_up_state_id: statesId,
         drop_off_state_id: destinationId,
         pick_up_address: citiesId,
         drop_off_address: destCitiesId,
         car_type:carTypeId,
         start_date: moment(fromDate).format('YYYY/MM/DD'),
         return_date: moment(toDate).format('YYYY/MM/DD'),
       };
       try {
         const res = await post('/mobile/book/interstate-trip', payload);
         setLoader(false);
         // Alert.alert('Great!', response.success);
         console.log(res.data, 'XOXOXOXOXO');
         console.log(payload, 'rororor');
         const result = res.data;
         setTotalAmount(result);
         setShowModalSubmit(true);
       } catch (error) {
         setLoader(false);
         alert("Oops! We'll fix the issue quick");
       }
     }
     }



    

  //! end of api call

  useEffect(() => {
    //get all states and cities
    fetchState();
    fetchDestCities();
    fetchCities();
    //car-type
    fetchCarType();
  }, [statesId, destinationId]);
  // useEffect(() => {
  //   //get all states and cities
  //   fetchDestCities();
  //   fetchCities();
  //   //car-type
  // }, [statesId, destinationId]);

  return (
    <View style={styles.body}>
      <Modal
        visible={showModalSubmit}
        onRequestClose={() => setShowModalSubmit(false)}
        transparent
        animationType="slide"
        hardwareAccelerated>
        <View style={styles.centre_view}>
          <View style={styles.submitModel}>
            <View style={styles.submit_title}>
              <Text style={styles.subHead}>ESTIMATED AMOUNT</Text>
            </View>
            <View style={styles.submit_body}>
              <Text style={styles.text}>
                {!totalAmount?.data?.amount ? (
                  <ActivityIndicator />
                ) : (
                  `₦${parseFloat(totalAmount?.data?.amount)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
                )}
              </Text>

              {/* <Text style={styles.text}>N30,000</Text> */}
            </View>
            <View style={styles.submit_button}>
              {!totalAmount?.data?.amount ? (
                <TouchableOpacity
                  style={styles.btn_cancel}
                  onPress={() => setShowModalSubmit(false)}>
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.btn_cancel}
                    onPress={() => setShowModalSubmit(false)}>
                    <Text style={styles.text}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btn_ok}
                    onPress={() => {
                      setShowModalSubmit(false);
                      Alert.alert(
                        'Great!',
                        'Your Inter state request has been received. We will process and get back to you in few mins',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              navigation.navigate('Dashboard');
                            },
                          },
                        ],
                      );
                    }}>
                    <Text style={styles.text}>Ok</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView keyboardShouldPersistTaps="always" listViewDisplayed={false}>
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrow-back"
                size={25}
                color="#000"
                style={styles.menuImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Inter City Movement</Text>
          </View>
          {/* //date and time */}
          <Text style={styles.label}>From</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowFrom(true)}>
            <Text style={styles.dateText}>
              {moment(fromDate).format('YYYY/MM/DD')}
            </Text>
          </TouchableOpacity>
          {showFrom && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fromDate}
              mode={'date'}
              display="default"
              onChange={onFromChange}
            />
          )}

          {/* date and time TO */}
          <Text style={styles.label}>To</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTo(true)}>
            <Text style={styles.dateText}>
              {moment(toDate).format('YYYY/MM/DD')}
            </Text>
          </TouchableOpacity>
          {showTo && (
            <DateTimePicker
              testID="dateTimePicker"
              value={toDate}
              mode={'date'}
              display="default"
              onChange={onToChange}
            />
          )}

          {/* end of date and time picker */}
          {/* selection of car Type */}
          <View style={styles.bottomView}>
            <Text style={styles.label1}>Vehicle type</Text>
            <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select your Car Type',
                  value: null,
                }}
                style={pickerSelectStyles}
                selectedValue={carTypeId}
                onValueChange={(itemValue, itemIndex) =>
                  setCarTypeId(itemValue)
                }
                items={newCarType}
                returnKeyType={'done'}
              />
            </TouchableOpacity>
          </View>
          {/* end of car type */}

          {/* get states drop down */}

          <View style={styles.bottomView}>
            <Text style={styles.subHead}>Pick-up Detail</Text>
            <Text style={styles.label1}>State</Text>
            <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select Pick-up State',
                  value: null,
                }}
                style={pickerSelectStyles}
                selectedValue={statesId}
                onValueChange={value => pickUpChange(value)}
                items={newState}
                returnKeyType={'done'}
              />
            </TouchableOpacity>
          </View>

          {/* end of state drop down */}

          {/* pick cities  */}

          <View style={styles.bottomView}>
            <Text style={styles.label1}>City</Text>
            <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select Pick-up City',
                  value: null,
                }}
                style={pickerSelectStyles}
                selectedValue={citiesId}
                onValueChange={value => pickupCities(value)}
                items={newCities}
                returnKeyType={'done'}
              />
            </TouchableOpacity>
          </View>

          {/* end of cities */}

          {/* destination state */}
          <View style={styles.bottomView}>
            <Text style={styles.subHead}>Destination Details</Text>
            <Text style={styles.label1}>State</Text>
            <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select destination State',
                  value: null,
                }}
                style={pickerSelectStyles}
                selectedValue={destinationId}
                onValueChange={(value, item) => handleDestination(value, item)}
                // onValueChange={(itemValue, itemIndex) => setStatesId(itemValue)}
                items={newState}
                returnKeyType={'done'}
              />
            </TouchableOpacity>
          </View>

          {/* end of destination state */}
          {/* destination cities */}
          <View style={styles.bottomView}>
            <Text style={styles.label1}>City</Text>
            <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select destination city',
                  value: null,
                }}
                style={pickerSelectStyles}
                selectedValue={destCitiesId}
                // onValueChange={value => console.log(value, "900990")}
                onValueChange={(value, index) => handleDestCities(value, index)}
                items={desCities}
                returnKeyType={'done'}
              />
            </TouchableOpacity>
          </View>
          {/* end of destination cities */}
          <TouchableOpacity
            style={styles.addView}
            onPress={() => {
              setShowModalSubmit(true);
              processData();
              console.log('click');
            }}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#0B277F', '#0B277F']}
              style={styles.addGradient}>
              <Text style={styles.addText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 20,
  },
  header: {
    width: '100%',
    height: 110,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 17,
    fontFamily: poppins,
    paddingLeft: 10,
    color: '#000',
    marginTop: 20,
    width: '80%',
  },
  label1: {
    color: '#555',
    paddingLeft: 10,
    marginTop: 10,
  },
  input: {
    width: '90%',
    height: 40,
    borderRadius: 7,
    borderColor: '#ABA7A7',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#333',
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 10,
  },
  subHead: {
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 10,
    color: '#000',
  },
  locSelect: {
    width: '90%',
    height: 40,
    borderRadius: 7,
    borderColor: '#ABA7A7',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    paddingTop: 8,
    color: '#333',
  },
  label: {
    color: '#555',
    paddingLeft: 15,
    fontSize: 12,
    marginTop: 10,
    fontFamily: poppins,
  },
  addView: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily: poppins,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },

  //model
  text: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
    margin: 5,
    textAlign: 'center',
    fontFamily: poppins,
  },
  submitModel: {
    width: 300,
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  centre_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  submit_title: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  submit_body: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit_button: {
    flexDirection: 'row',
    height: 50,
  },
  btn_cancel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  btn_ok: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c4c4',
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



export default InterState
