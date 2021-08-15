import React, { Component  } from 'react';
import { AppState, View, Text, Alert, TouchableWithoutFeedback,Image, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { SERVER_URL } from '../config/server';

export class Merchants extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      email1: '',
      limit: 0,
      merchantProducts: false,
      merchantProductCategories: false,
      cities: false,
      custmer: '',
      customer_id: '',
      categoryMenu: 'All',
      categoryId: "not-set",
      cityId: "not-set",
      searchId: "not-set",
      locationPlaceholder: 'Select location here',
    } 

  }

  async componentWillMount() {
    this.getLoggedInUser();
    this.getMerchants();
    this.getMerchantCategories();
    this.getCities();
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
    await AsyncStorage.getItem('customer').then((value) => {
      if(value){
        this.setState({
          customer: JSON.parse(value)
        }, () => {
          this.setState({
            customer_id: this.state.customer.id
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }

  getCities(){
    fetch(`${SERVER_URL}/mobile/get_cities`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     if(res.success){
          this.setState({
            cities:  res.cities
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getCities() }
       ],
       //{ cancelable: false }
     );
    });
  }


  getMerchants(){
    var limit = this.state.limit;
    var newLimit = limit + 20;
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_merchants/1/${newLimit}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader();
       console.log(res, "res");
       //this.hideLoader();
       if(res.success){
          this.setState({
            merchants:  res.merchants,
            limit: newLimit,
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getMerchants() }
       ],
       //{ cancelable: false }
     );
    });
  }  

  getMerchantCategories(){
    fetch(`${SERVER_URL}/mobile/get_merchant_categories`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
       console.log(res, "res");
       //this.hideLoader();
       if(res.success){
          this.setState({
            merchantCategories:  res.merchant_categories,
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getMerchantCategories() }
       ],
       //{ cancelable: false }
     );
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
  
  displayCategoryText(merchantProductCategoryName){
    console.log(this.state.categoryMenu, "this.state.categoryMenu");
    console.log(merchantProductCategoryName, "merchantProductCategoryName");
    if(this.state.categoryMenu == merchantProductCategoryName){
      return (
        <Text style={[styles.segmentText, styles.linkHighlight ]}>{merchantProductCategoryName}</Text>
      )
    }else{
      return (
      <Text style={[styles.segmentText]}>{merchantProductCategoryName}</Text>
      )
    }
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
  }
  onSelect = (city) => {
    
    this.setState({
      cityId: city.id,
      locationPlaceholder: city.label,
      visible: false 
    }, ()=> { this.executesearch() })
    
  }
  executesearch(){
    this.showLoader();
    var limit = this.state.limit;
    var newLimit = limit + 20;
    if(this.state.searchId == "" || this.state.searchId == "not-set"){
      var search = "not-set";
    }else{
      var search = this.state.searchId
    }
    console.log(`${SERVER_URL}/mobile/get_merchant_products_search/1/${newLimit}/${this.state.cityId}/${search}`);
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/get_merchants_search/1/${newLimit}/${this.state.cityId}/${search}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader();
       console.log(res, "submit res");
       //this.hideLoader();
       if(res.success){
          this.setState({
            merchants:  res.merchants,
            limit: newLimit,
            //searchId:"not-set",
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Communictaion error",
       "Ensure you have an active internet connection",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.executesearch() }
       ],
       //{ cancelable: false }
     );
    });
  }
  gotoEatPage(merchant){
    this.props.navigation.navigate('Eat', {
      merchant: merchant,
    });
  }

  render() {
    //const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#2BBAD8'}  />
        <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
        <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
        </TouchableOpacity>
        {/*
          <TouchableOpacity  onPress={() => this.props.navigation.navigate('Cart')} style = {styles.cartView}>
          <Image source = {require('../imgs/cart.png')} style = {styles.cartImage} />
          </TouchableOpacity>
        */}
        <View style = {styles.bottomView}>
            
            {this.state.visible &&
            <ModalFilterPicker
              style={styles.input}
              onSelect={this.onSelect}
              onCancel={this.onCancel}
              options={this.state.cities}
            />
            }
            <TouchableOpacity onPress={() => this.setState({visible: true})}  >
            <Text style={styles.locSelect}>{this.state.locationPlaceholder}</Text>
              </TouchableOpacity>
              {/*}
              <TouchableOpacity onPress={() => this.setState({cityId: 0, locationPlaceholder: 'All'})}  >
                <Text style = {styles.locationText}> Select all location</Text>
              </TouchableOpacity>
          */}
              
          <View style={styles.dRow}>
            <View style={styles.searchInputView}>
            <TextInput
                    style={styles.searchInput}
                    placeholder="Search restaurant..."
                    onChangeText={(text) => this.setState({search: text, searchId: text}, ()=> {  })}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#000" 
                    value={this.state.search}
                    onSubmitEditing={() => this.executesearch()}
                    //keyboardType={'email-address'}
                  />
                </View>
          </View>
          
          {/*
          <View  style = {styles.row}>
          <ScrollView
            horizontal={true}>
            <TouchableOpacity onPress={() => this.setState({categoryMenu: 'All', categoryId: "not-set"}, ()=> { this.executesearch() })}  style = {styles.col1}>
            {this.displayCategoryText('All')}
            </TouchableOpacity>
            {this.state.merchantCategories && this.state.merchantCategories.map((merchantCategory, index) => (
            <TouchableOpacity key={index} onPress={() => this.setState({categoryMenu: merchantCategory.name, categoryId: merchantCategory.id}, ()=> { this.executesearch() })}  style = {styles.col1}>
              {this.displayCategoryText(merchantCategory.name)}
            </TouchableOpacity>
            ))}
          </ScrollView>
          </View>
            */}
        </View>
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            <View style={styles.itemView}>
            {this.state.merchants && this.state.merchants.map((merchant, index) => (
                <TouchableWithoutFeedback style={styles.i} key={index}  onPress={() => this.gotoEatPage(merchant)}>
                  <View style={styles.item}>
                    <Image source = {{uri: `${SERVER_URL+ '/'+merchant.logo}`}}  style = {styles.itemImage} />
                    <Text style={styles.itemNameText}>{merchant.business_name} </Text>
                    <View style={styles.itemBottom}>
                      <Text style={styles.itemVendorText}>{merchant.city_name}, {merchant.state_name}</Text>
                      <Text style={styles.itemRatingText}>4.5*</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                
              
            ))}
              
            </View>
          </View>
        </ScrollView>
        {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </View>
    )
  }
}

export default Merchants

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#f8f8f8",
  },
  cView: {
    //minHeight: 1200,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
    marginBottom: 150,
  },
  itemImage: {
    width: '100%',
    height: 162,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    height: 170,
    backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  cartImage: {
    width: 21,
    height: 15,
    marginRight: 30,
    marginTop: 71,
  },
  linkHighlight: {
    color: '#2BBAD8',
  },
  itemView: {
    flexDirection: 'row',
    width: '98%',
    marginTop: 25,
    alignContent: 'center',
    alignSelf: 'center',
    //marginRight: 20,
    flexWrap: 'wrap',


  },
  iRating: {
    width: '100%',
    fontSize: 10,
    textAlign: 'right',
    alignSelf: 'flex-end',
    color: '#2BBAD8',
  },
  i: {
    width: '100%',
    //marginRight: 10,
  },
  item: {
    width: '100%',
    marginBottom: 20,
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 1,
    padding: 15,
    //marginLeft: 5,
    

  },
  itemNameText: {
    paddingTop: 10,
    width: '100%',
  },
  itemPriceText: {
    //paddingTop: 4,
    fontWeight: 'bold',
    color: '#585757',
  },
  itemBottom: {
    flexDirection: 'row',
    width: '98%',
  },
  itemVendorText: {
    color: '#585757',
    fontSize: 12,
    width: '75%',
  },
  itemRatingText: {
    width: '25%',
    fontSize: 12,
    color: '#2BBAD8',
    textAlign: 'right',
    paddingRight: 10,
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    
    flexDirection: 'row',
    marginTop: 20,
  },
  dRow: {
    flexDirection: 'row',
    width: '100%',
    //alignSelf: 'center',
  },
  searchImage: {
    width: 40,
    height: 40,
    marginTop: -5,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
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
  sView:{
    
  },
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
    //width: 21,
    //height: 15,
    marginLeft: 20,
    marginTop: 49,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#fff',
    marginTop: 67,
    width: '80%',
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

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
    zIndex: 0,
  },
  locationText: {
    color: '#2BBAD8',
    textAlign: 'right',
    paddingTop: 2,
    marginRight: 10,
    fontSize: 12,
  },
  colImage: {
    width: '35%'
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
    color: '#333',
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },


  label:{
    color: '#333',
    paddingLeft: 18,
    marginTop: 1,
  },
  searchButton: {
    marginLeft: -40,
    zIndex: 99,
    marginTop: 10,
    //width: 4,
  },
  
  searchInputView: {
    width: '100%',
    zIndex: 2,
  },
  searchInput: {
    width: '100%',
    zIndex: 2,
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 1,
    //alignSelf: 'center', 
    marginTop: 5,
    paddingLeft: 10,
    color: '#000',
  },
  locSelect: {
    width: '100%',
    zIndex: 2,
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 1,
    paddingTop: 10,
    //alignSelf: 'center', 
    marginTop: 5,
    paddingLeft: 9,
    color: '#000',
  },
  input: {
    width: '94%',
    height: 40,
    backgroundColor: '#F9F9FB',
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
    color: '#222'
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
submitButton: {elevation: 2,
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