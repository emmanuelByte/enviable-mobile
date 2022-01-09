import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Picker, TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SERVER_URL } from '../config/server';
import FAB from 'react-native-fab'
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';

export class EatDetails extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      myParams: props.navigation.state.params,
      email: '',
      password: '',
      email1: '',
      quantity: 1,
      rating: 5,
      review: '',
      vs: false,
    }
    this.getLoggedInUser();
     
  }

  async componentWillMount() {
    console.log(this.state.myParams, "this.state.myParams");
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
  async addToCart(){
    var cart = [];
    var product = this.state.myParams.merchantProduct;
    product.qty = this.state.quantity;
    await AsyncStorage.getItem('cart').then((value) => {
      if(value){
        var parsedValue = JSON.parse(value);
        var cartItem = parsedValue.find(obj => obj.id == this.state.myParams.merchantProduct.id);
        console.log(cartItem, "cartItem");
        
        if(cartItem != null){
          var foundIndex = parsedValue.findIndex(x => x.id == this.state.myParams.merchantProduct.id);
          cartItem.qty = this.state.quantity;
          parsedValue[foundIndex] = cartItem;
           
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
    await AsyncStorage.getItem('cart').then((value) => {
      console.log(JSON.parse(value), "cart");
    
      Alert.alert(
        "Success",
        "Item has been added to cart. Go to cart now?",
        [
          {
            text: "Stay here",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
           
          { text: "Go to cart", onPress: () => this.props.navigation.navigate('Cart') }
        ],
         
      );
    });
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
  
  rateProduct(){
    this.setState({
      forgotVisible: false,
    })
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rateMerchant`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userId: this.state.customer.id,
          productId: this.state.myParams.merchantProduct.id,
          rating: this.state.rating,
          review: this.state.review,
      })
    }).then((response) => response.json())
        .then((res) => {
          console.log(res);
          this.hideLoader();
          if(res.success){
            Alert.alert(
              "Success",
              res.success,
            );
            this.setState(prevState => ({
              myParams: {
                ...prevState.myParams,
                merchantProduct: {
                  ...prevState.myParams.merchantProduct,
                  rating: res.rating
                }
              }
            }))
          }else{
            this.showAlert("Error", res.error)
          }
    }).done();
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
  increaseQuantity(){
    var qty = this.state.quantity;
    var newQty = qty + 1;
    this.setState({
      quantity: newQty
    })
  }
  decreaseQuantity(){
    var qty = this.state.quantity;
    if(qty == 1){

    }else{
      var newQty = qty - 1;
      this.setState({
        quantity: newQty
      })
    }
  }
  

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
          <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={18} color="#0B277F"  style = {styles.menuImage}/>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.cartFabView} onPress={() => this.props.navigation.navigate('Cart')} >
          <FAB style = {styles.cartFab} size={12} buttonColor="#0B277F" iconTextColor="#FFFFFF" onClickAction={() => {this.props.navigation.navigate('Cart')}} visible={true} iconTextComponent={<Icon  name="shopping-cart"/>} />

          </TouchableOpacity>
        <View style = {styles.bottomView}>
          <View style={styles.item1}>
              <Image source = {{uri: `${SERVER_URL+ '/'+this.state.myParams.merchantProduct.image}`}}  style = {styles.itemImage} />
              <View style={styles.ib}>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemNameText}>{this.state.myParams.merchantProduct.name}</Text>
                  <TouchableOpacity onPress={() => this.setState({forgotVisible: true})}>
                    <Text style={styles.itemRatingText}>{this.state.myParams.merchantProduct.rating}* Rate prdouct</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPriceText}>₦{parseFloat(this.state.myParams.merchantProduct.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemVendorText}>{this.state.myParams.merchantProduct.merchant_name}</Text>
                </View>
              </View>
          </View>
          <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
            <View style={styles.cView}>
              <View style={styles.itemView}>
                <View style={styles.item}>
                 
                  <Text style={styles.descText}>Description</Text>
                  <Text style={styles.descContent}>{this.state.myParams.merchantProduct.description}</Text>
                </View>
              </View>
              <View style={styles.actionView}>
                <View style={styles.counterView}>
                <TouchableOpacity style={styles.textView} onPress={() => this.decreaseQuantity()}>
                  <Text style={styles.minusText}>-</Text>
                </TouchableOpacity>
                  <Text style={styles.counterText}>{this.state.quantity}</Text>
                  <TouchableOpacity style={styles.textView}  onPress={() => this.increaseQuantity()}>
                  <Text style={styles.plusText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback style={styles.addView} onPress={() => this.addToCart()}>
                  <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                    <Text style={styles.addText}>Add to cart</Text>
                  </LinearGradient>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
          <Modal
            isVisible={this.state.forgotVisible}
            onBackdropPress={() => {
              this.setState({ forgotVisible: false });
            }}
            height= {'100%'}
            width= {'100%'}
            style={styles.modal}
          >
            <View style={styles.forgotModalView}>
            <Text style = {styles.headerText7}>Rate Product</Text>
            <Text style = {styles.headerText8}>Kindly rate this product</Text>

              <Text style = {styles.label1}>Rating</Text>
              <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                    placeholder=''
                    style={pickerSelectStyles}
                    selectedValue={this.state.rating}  
                    onValueChange={(itemValue, itemIndex) => this.setState({rating: itemValue})}
                    items={[
                      { label: '5*', value: '5' },
                      { label: '4*', value: '4' },
                      { label: '3*', value: '3' },
                      { label: '2*', value: '2' },
                      { label: '1*', value: '1' },
                    ]}
                    returnKeyType={ 'done' }
                    />
               
              </TouchableOpacity>
              <Text style = {styles.label1}>Review</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {this.setState({review: text}) }}
                underlineColorAndroid="transparent"
                
                value={this.state.review}
              />
              
              <TouchableOpacity style={styles.addView3} onPress={() => this.rateProduct()}>
                <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient4}>
                  <Text style={styles.addText}>Rate product </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        

        {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default EatDetails

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
     
  },
  cView: {
    minHeight: 900,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  backFabView: {
    position: 'absolute',
    bottom: 180,
     
    alignItems: 'flex-start',
     
    width: 100,
    zIndex: 999999999999999999999999,
    elevation: 10,
     
  },
  cartFabView: {
    position: 'absolute',
    bottom: 180,
    right: 0,
    alignItems: 'flex-end',
     
    width: 100,
    zIndex: 999999999999999999999999,
    elevation: 10,
     
  },
  backFab: {
     
     
     
  },
  cartFab: {
     
     
  },
  actionView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 40,
  },
  counterView: {
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    borderColor: '#888888',
    flexDirection: 'row',
    width: '49%',
    height: 40,
    paddingTop: 5,
  },
  minusText: {
    textAlign: 'center',
     
    fontSize: 16,
    marginTop: 2,
    
  },
  textView: {
    textAlign: 'center',
    width: '33%',
    
  },
  counterText: {
    textAlign: 'center',
    width: '34%',
    fontSize: 16,
    marginTop: 2,
  },
  plusText: {
    textAlign: 'center',
     
    fontSize: 16,
    marginTop: 2,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
  },
  addView: {
    width: '49%',
    height: 40,
  },
  addGradient: {
    borderRadius: 10,
    width: '49%',
    height: 40,
    elevation: 2,
    paddingTop: 7,
  },
  header: {
    width: '100%',
    height: 170,
    backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#fff',
    marginTop: 67,
    width: '80%',
  },
  cartView: {
    width: '90%',
  },
  cartImage: {
    width: 30,
    height: 21,
    marginRight: 30,
    alignSelf: 'flex-end',
    marginTop: 51,
     
  },
  itemImage: {
    width: '100%',
    height: 202,
    alignSelf: 'center',
    borderColor: '#Fefefe',
    borderWidth: 1,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  
  bImage: {
    width: '100%',
    height: 300,
     
    overflow: 'hidden',
    flexDirection: 'row',
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    
    marginLeft: 20,
    marginTop: 51,
     
     
     
     
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  
  itemView: {
    flexDirection: 'row',
    width: '95%',
     
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: 20,


  },
  item1: {
    width: '100%',
    marginBottom: 20,
    borderColor: '#fff',
     
    borderRadius: 14,
     
    paddingBottom: 15,
     
    

  },
  item: {
    width: '100%',
    marginLeft: 0,
    marginRight: 10,

  },
  itemNameText: {
    paddingTop: 10,
    width: '75%',
  },
  itemPriceText: {
     
     
    fontWeight: 'bold',
    paddingLeft: 14,
    color: '#585757',
    
  },
  ib: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  itemBottom: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 15,
    
    paddingRight: 15,
  },
  itemVendorText: {
    color: '#0B277F',
    fontSize: 12,
    width: '75%',
  },
  itemRatingText: {
     
    fontSize: 12,
    paddingTop: 10,
    color: '#585757',
    textAlign: 'right',
  },

  descText: {
    marginTop: 5,
  },
  descContent: {
    color: '#535871',
    textAlign: 'justify',
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
  height: 330,
  width: '90%',
  backgroundColor: '#FFF',
  paddingTop: 18,
},
headerText7: {
  color: '#333',
  paddingLeft: 20,
  fontWeight: '700',
  marginTop: 5,
  fontSize: 15
},
headerText8: {
  color: '#333',
  paddingLeft: 20,
  fontSize: 12
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
addView3: {
  width: '90%',
  height: 40,
  alignSelf: 'center',
  marginTop: 40,
  marginBottom: 40,
},
addGradient4: {
  borderRadius: 10,
  width: '100%',
  height: 40,
  paddingTop: 7,
  marginBottom: 40,
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

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    width: '100%',
    height: 40,
    backgroundColor: '#EFF0F3',
     
    borderRadius: 8,
    marginTop: -5,
    color: '#aaa',
  },
  inputIOS: {
    width: '100%',
    height: 40,
    borderColor: '#777',
     
    borderRadius: 8,
    marginTop: -5,
    color: '#aaa',
  },
})