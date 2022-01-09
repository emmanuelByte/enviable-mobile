import React, { Component  } from 'react';
import { AppState, View, Text,TouchableWithoutFeedback,  Alert, Image, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from '../config/server';
 

export class EatOrderSummary extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      email: '',
      password: '',
      weight: '',
      total: false,
      email1: '',
      distance: '',
      customer: false,
      cartItems: false,
      deliveryInfo: false,
      loaderVisible:false,
    }
    this.getLoggedInUser();
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
         
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
       
    );
    return true
  }

  componentDidMount() {
    this.getOrderDetails();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  async getOrderDetails(){
    await AsyncStorage.getItem('cart').then((value) => {
      if(value){
        this.setState({
          cartItems: JSON.parse(value)
        }, () => {
          console.log(this.state.cartItems, 'cartItems')
          var total = this.state.cartItems.reduce(function (a, b) { return parseFloat(a) + (parseFloat(b.price) * parseFloat(b.qty)); }, 0);
          var weight = this.state.cartItems.reduce(function (a, b) { return parseFloat(a) + (parseFloat(b.weight) * parseFloat(b.qty)); }, 0);
          this.setState({
            total: total,
            weight: weight,
          })
          AsyncStorage.getItem('deliveryInfo').then((value) => {
            if(value){
              
              this.setState({
                deliveryInfo: JSON.parse(value)
              }, ()=> {
                 
                 
                 
                 
                 
                 
                var ori = this.state.deliveryInfo.latitude + "," + this.state.deliveryInfo.longitude;
                var des = this.state.cartItems[0].merchant_latitude + "," + this.state.cartItems[0].merchant_longitude;
                var distance = this.getDistance(ori, des);
                
              })
            }
          });
        });
      }else{
        this.props.navigation.navigate('home')
      }

    });
  }

  getDeliveryFee(distance){
    if(distance == 0){
      distance = 1;
    }
    console.log(distance, "distance");
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/get_delivery_fee_with_distance_vehicle_type/${distance}/${this.state.deliveryInfo.vehicleTypeId}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
       console.log(res, "dev fee");
       this.hideLoader();
       if(res.success){
          this.setState({ 
            deliveryFee:  res.delivery_fee,
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
         { text: "Refresh", onPress: () => this.getDeliveryFee(distance) }
       ],
        
     );
    });
  }  
  getDistance(origin, destination){
    this.showLoader();
     fetch(`https: 
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       console.log(res, "tance");
       this.hideLoader();
        
        this.getDeliveryFee(res.rows[0].elements[0].distance.value);
        this.setState({
          distance: res.rows[0].elements[0].distance.value
        }, ()=>{
          return res.rows[0].elements[0].distance.value;
        })
        
       
       
       
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
         { text: "Refresh", onPress: () => this.getDistance() }
       ],
        
     );
     return;
    });
  }

  placeOrder(){
     
     
     
     
     
     
     
    var distance = 1;
    if( this.state.distance != 0){
      distance = this.state.distance;
    }
    this.showLoader();
    
    fetch(`${SERVER_URL}/mobile/place_merchant_order`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_id: this.state.customer.id,
          contact_person: this.state.deliveryInfo.name,
          contact_phone: this.state.deliveryInfo.phone,
          address: this.state.deliveryInfo.address + " "+ this.state.deliveryInfo.locationPlaceholder,
          city_id: this.state.deliveryInfo.cityId,
          latitude: this.state.deliveryInfo.latitude,
          longitude: this.state.deliveryInfo.longitude,
          payment_method: this.state.deliveryInfo.paymentMethod,
          cart: this.state.cartItems,
          vehicle_type_id: this.state.deliveryInfo.vehicleTypeId,
          total: this.state.total,
          weight: this.state.weight,
          distance: distance,
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            AsyncStorage.removeItem('cart');
            Alert.alert(
              "Success",
              res.success,
               
               
               
               
               
               
               
               
               
               
            );
            this.props.navigation.navigate('MerchantOrderDetails', {
              orderId: res.order.id,
            });
            
          }else{
            this.showAlert("Error", res.error)
          }
    }).done();
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
  

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
        <View style={styles.header}>
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
          </TouchableOpacity>
          <Text style = {styles.headerText}>Order summary</Text>
          <TouchableOpacity  onPress={() => this.props.navigation.navigate('Cart')} style = {styles.cartView}>
          <Image source = {require('../imgs/cart.png')}  style = {styles.cartImage} />
          </TouchableOpacity>
        </View>
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            <View style={styles.itemView}>
              <View style={styles.item1}>
                <Text style = {styles.label}>Contact Person</Text>
                {this.state.deliveryInfo &&
                <Text style = {styles.txt}>{this.state.deliveryInfo.name} </Text>
                }
              </View>
              <View style={styles.item2}>
                <Text style = {styles.label}>Phone</Text>
                <Text style = {styles.txt}>{this.state.deliveryInfo.phone}</Text>
              </View>
            </View>
            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label}>Address</Text>
                <Text style = {styles.txt}>{this.state.deliveryInfo.address}, {this.state.deliveryInfo.locationPlaceholder}</Text>
              </View>
            </View>
            <View style={styles.itemView}>
              <View style={styles.item3}>
                <Text style = {styles.label}>Payment method</Text>
                <Text style = {styles.txt}>Pay with card</Text>
              </View>
            </View>
            <View style={styles.itemView7}>
              <View style={styles.itemView4}>
                <View style={styles.item3}>
                  <Text style = {styles.label}>Order details</Text>
                  <Text style = {styles.txt}>#0001928888</Text>
                </View>
              </View>
              <View style={styles.itemView1}>
                
                {this.state.cartItems && this.state.cartItems.map((cartItem, index) => (
                  <View style={styles.item11}>
                    <Text style = {styles.label}>{cartItem.name} X {cartItem.qty}</Text>
                    <Text style = {styles.label}>₦{cartItem.price * cartItem.qty}</Text>
                  </View>
                ))}
                <View style={styles.item22}>
                  <Text style = {styles.label}>SubTotal</Text>
                    {this.state.total &&
                    <Text style = {styles.label}>₦{parseFloat(this.state.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                    }
                  </View>
                <View style={styles.item22}>
                  <Text style = {styles.label}>Delivery fee</Text>
                    {this.state.deliveryFee &&
                    <Text style = {styles.label}>₦{parseFloat(this.state.deliveryFee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                    }
                </View>
                <View style={styles.item22}>
                  <Text style = {styles.label}>Total</Text>
                    {this.state.deliveryFee &&
                    <Text style = {styles.labelZ}>₦{parseFloat(this.state.deliveryFee + this.state.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                    }
                </View>
              </View>
            </View>
              <TouchableWithoutFeedback style={styles.addView} onPress={() => this.placeOrder()}>
                <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                  <Text style={styles.addText}>Confirm order</Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            
          </View>
        </ScrollView>
        {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }

        
      </View>
    )
  }
}

export default EatOrderSummary

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    width: '100%',
     
  },
  cView: {
     
    width: '90%',
    alignSelf: 'center',
    alignContent: 'center',
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    height: 110,
     
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
    width: '100%',
    marginTop: 15,
    alignContent: 'center',
    alignSelf: 'center',
     
     
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 4,
    flexDirection: 'row',
  },
  itemView7: {
    width: '100%',
    marginTop: 15,
    alignContent: 'center',
    alignSelf: 'center',
     
     
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 4,
  },
  itemView4: {
     
    width: '90%',
    marginTop: 10,
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
  item1: {
    width: '60%',
  },
  item11: {
    width: '100%',
    flexDirection: 'row'
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '40%',
  },
  item3: {
    width: '100%'
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
    marginTop: 40,
  },
  item: {
    width: '100%',
     
     
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
  sView:{
    
  },
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
    marginTop: 75,
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
    fontWeight: "bold",

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
     
    paddingRight: 10,
    marginRight: 10,
  },
  contentText: {
    fontWeight: 'bold',
  },
  contentText1: {
    color: '#5D626A',
  },


  label:{
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '50%',
  },
  labelZ:{
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
  backgroundColor: 'rgba(0,0,0,0.5)'
}
  
})