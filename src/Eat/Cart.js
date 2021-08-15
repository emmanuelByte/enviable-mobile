import React, { Component  } from 'react';
import { AppState, View, Text, Alert, TouchableWithoutFeedback, Image, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from '../config/server';

export class Cart extends Component {
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
      email1: '',
      customer: false,
      cartItems: false,
    }
    this.getLoggedInUser();
  }

  componentWillMount() {
    this.getCart();
  }

  async getCart(){
    await AsyncStorage.getItem('cart').then((value) => {
      if(value){
        this.setState({
          cartItems: JSON.parse(value)
        })
      }
    });
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
  async removeItem(cartItemId){
    var cartItems1 = this.state.cartItems;
    var cartItems1 = cartItems1.filter(cartItem1 => cartItem1.id != cartItemId);
    await AsyncStorage.setItem('cart', JSON.stringify(cartItems1)).then(() => {
      //this.props.navigation.navigate('DispatchCartSummary');
      this.setState({
        cartItems: cartItems1
      })
    });
  }

  async getLoggedInUser(){
    await AsyncStorage.getItem('customer').then((value) => {
      if(value){
        
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }

  async addToCart(dCartItem, dQuantity){
    var cart = [];
    var product = dCartItem;
    product.qty = this.state.dQuantity;
    await AsyncStorage.getItem('cart').then((value) => {
      if(value){
        var parsedValue = JSON.parse(value);
        var cartItem = parsedValue.find(obj => obj.id == dCartItem.id);
        console.log(cartItem, "cartItem");
        
        if(cartItem != null){
          var foundIndex = parsedValue.findIndex(x => x.id == dCartItem.id);
          cartItem.qty = dQuantity;
          parsedValue[foundIndex] = cartItem;
          //cart = newParsedValue;
          AsyncStorage.setItem('cart', JSON.stringify(parsedValue)).then(() => {
            this.showCartAlert();
          })
        }else{
          parsedValue.push(product);
          AsyncStorage.setItem('cart', JSON.stringify(parsedValue)).then(() => {
            this.showCartAlert();
          })
        }
      }else{
        cart.push(product);
        AsyncStorage.setItem('cart', JSON.stringify(cart)).then(() => {
          this.showCartAlert();
        })
      }
    });
    
  }

  async showCartAlert(){
    this.getCart();
    await AsyncStorage.getItem('cart').then((value) => {
      console.log(JSON.parse(value), "cart");
    
      Alert.alert(
        "Success",
        "Item quantity has been updated",
        
      );
    });
  }
  increaseQuantity(cartItem){
    var qty = cartItem.qty;
    var newQty = qty + 1;
    this.addToCart(cartItem, newQty)
  }
  decreaseQuantity(cartItem){
    var qty = cartItem.qty;
    if(qty == 1){

    }else{
      var newQty = qty - 1;
      this.addToCart(cartItem, newQty)
    }
  }
  showLoader(){
    this.setState({
      visible: true
    });
  }
  hideLoader(){
    this.setState({
      visible: false
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
        <StatusBar translucent={true} backgroundColor={'#2BBAD8'}  />
         <TouchableOpacity  style = {styles.row5} onPress={() => this.props.navigation.goBack()}>
          <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
          <Text style = {styles.headerText}>Cart</Text>
        </TouchableOpacity>
          
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            <View style={styles.itemView}>
              {this.state.cartItems && this.state.cartItems.map((cartItem, index) => (
                <View style={styles.item}>
                  <View style={styles.contentCol1}>
                    <Text style={styles.itemNameText}>{cartItem.name}</Text>
                    <Text style={styles.itemPriceText}>₦{parseFloat(cartItem.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                    <View style={styles.counterView}>
                      <TouchableOpacity style={styles.textView} onPress={() => this.decreaseQuantity(cartItem)}>
                        <Text style={styles.minusText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterText}>{cartItem.qty}</Text>
                      <TouchableOpacity style={styles.textView} onPress={() => this.increaseQuantity(cartItem)}>
                        <Text style={styles.plusText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.removeView}  onPress={() => this.removeItem(cartItem.id)}>
                    <Text style = {styles.removeText}> REMOVE FROM CART</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.contentCol2}>
                  <Image source = {{uri: `${SERVER_URL+ '/'+cartItem.image}`}} style = {styles.itemImage} />
                  </View>
                </View>
              ))}
              {this.state.cartItems &&
              <TouchableWithoutFeedback style={styles.addView} onPress={() =>  this.props.navigation.navigate('EatDeliveryAddress') }>
                <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#2BBAD8', '#2BBAD8']} style={styles.addGradient}>
                  <Text style={styles.addText}>Proceed to checkout</Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
              }
              {!this.state.cartItems &&
              <Text style={styles.redText}>You have no item in your cart.</Text>
              }
            </View>
            
          </View>
        </ScrollView>


        
      </View>
    )
  }
}

export default Cart

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#fff",
  },
  cView: {
    minHeight: 900,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    height: 110,
    backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
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
  itemView: {
    width: '90%',
    marginTop: 25,
    alignContent: 'center',
    alignSelf: 'center',
    //marginRight: 20,


  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  redText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#f00',
  },
  addView: {
    width: '60%',
    alignSelf: 'flex-end',
    height: 40,
    marginTop: 15,
  },
  addGradient: {
    borderRadius: 10,
    elevation: 2,
    width: '100%',
    height: 40,
    paddingTop: 7,
    marginTop: 40,
  },
  item: {
    width: '100%',
    marginLeft: 5,
    marginRight: 10,
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#Fefefe',
    paddingLeft: 12,
    paddingBottom: 17,
    borderWidth: 1,
    borderRadius: 8,
    elevation: 2,
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
    //paddingTop: 4,
    fontWeight: 'bold',
    color: '#585757',
  },
  itemBottom: {
    flexDirection: 'row',
    width: '100%',
  },
  itemVendorText: {
    color: '#2BBAD8',
    fontSize: 12,
    width: '75%',
  },
  itemRatingText: {
    width: '25%',
    fontSize: 12,
    color: '#585757',
    textAlign: 'right',
  },
  row5: {
    marginLeft: 20,
    marginTop: 55,
    width: '100%',
    flexDirection: 'row',
    //marginTop: 20,
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
  removeView: {
    position: 'absolute',
    bottom: 0, 
   
  },
  removeText: {
    color: '#c00',
    fontSize: 10,
    
    //paddingBottom: 20,
  },
  itemImage: {
    width: 72,
    height: 72,
    marginTop: 15,
    alignSelf: 'center',
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
    // marginLeft: 20,
    marginTop: 2,
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
    marginBottom: 20,
  },

  textView: {
    textAlign: 'center',
    width: '33%',
    
  },
  minusText: {
    textAlign: 'center',
    //width: '33%',
    fontSize: 13,
    
  },
  counterText: {
    textAlign: 'center',
    width: '34%',
    fontSize: 13,
  },
  plusText: {
    textAlign: 'center',
    //width: '33%',
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
    //marginTop: 23,
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