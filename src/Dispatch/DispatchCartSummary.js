import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Picker, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { SERVER_URL } from '../config/server';

export class DispatchCartSummary extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      visible: false,loaderVisible: false,
      loaderVisible: false,
      cartItems: false,
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
        //{ text: "Go to home", onPress: () => this.props.navigation.navigate('Home') },
        { text: "Leave", onPress: () => BackHandler.exitApp() }
      ],
      //{ cancelable: false }
    );
    return true
  }

  componentDidMount() {
    this.getDispatchCartDetails();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  async getDispatchCartDetails(){
    await AsyncStorage.getItem('dispatchCart').then((value) => {
      if(value){
        this.setState({
          cartItems: JSON.parse(value)
        }, () => {
          // var total = this.state.cartItems.reduce(function (a, b) { return parseFloat(a) + (parseFloat(b.price) * parseFloat(b.qty)); }, 0);
          // this.setState({
          //   total: total
          // })
        });
      }else{
        this.props.navigation.navigate('home')
      }

    });
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
            customer_id: this.state.customer.id,
            name: this.state.customer.first_name +" "+ this.state.customer.last_name,
            phone: this.state.customer.phone1,
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }

  async removeItem(cartItemId){
    var cartItems1 = this.state.cartItems;
    var cartItems1 = cartItems1.filter(cartItem1 => cartItem1.id != cartItemId);
    await AsyncStorage.setItem('dispatchCart', JSON.stringify(cartItems1)).then(() => {
      //this.props.navigation.navigate('DispatchCartSummary');
      this.setState({
        cartItems: cartItems1
      })
    });
  }
  showLoader(){
    this.setState({
      loaderVisible: true
    });
  }
  hideLoader(){
    this.setState({
      loaderVisible: false,
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
          <View style={styles.header}>
            <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" size={18} color="#000"  style = {styles.menuImage}/>
            </TouchableOpacity>
            <Text style = {styles.headerText}>Dispatch summary</Text>
          </View>
          {this.state.cartItems && this.state.cartItems.map((cartItem, index) => (
            <View style = {styles.cardView}>
              <View style = {styles.labelView}>
                <Text style = {styles.label1}>Item description</Text>
                <Text style = {styles.label2}>Qty</Text>
                {/*<Text style = {styles.label3}>Measurement</Text>*/}
              </View>
              <View style = {styles.textView}>
                <Text style = {styles.text1}>{cartItem.itemDescription}</Text>
                <Text style = {styles.text2}>{cartItem.quantity}</Text>
                {/*<Text style = {styles.text3}>{cartItem.length}cm x {cartItem.width}cm x {cartItem.heigth}cm - {cartItem.length}kg</Text>*/}
              </View>
              <TouchableOpacity style={styles.removeView}  onPress={() => this.removeItem(cartItem.id)}>
              <Icon name="delete" size={18} color="#c00"  style = {styles.removeIcon}/>
              </TouchableOpacity>
            </View>
          ))}
           <TouchableOpacity style={styles.addView1}  onPress={() => this.props.navigation.navigate('NewDispatch')}>
              <Icon name="add" size={24} color="#000"  style = {styles.addIcon}/>
          </TouchableOpacity>
          {this.state.cartItems &&
            <TouchableOpacity style={styles.addView}  onPress={() => this.props.navigation.navigate('DispatchAddress', {
              type: this.state.cartItems[0].type,
            })}>
              <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                <Text style={styles.addText}>Next</Text> 
              </LinearGradient>
            </TouchableOpacity>
          }
          {!this.state.cartItems &&
              <Text style={styles.redText}>You have no item in your cart.</Text>
              }
          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default DispatchCartSummary

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#EFF0F3",
  },
  backImage: {
    width: 18,
    height: 12,
    marginLeft: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#000',
    marginTop: 73,
    width: '80%',
  },
  header: {
    width: '100%',
    height: 110,
    //backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  headerTextZ: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 20,
    color: '#333',
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  cardView: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  labelView: {
    flexDirection: 'row'
  },
  label1: {
    width: '80%',
    fontWeight: 'bold',
  },
  label2: {
    width: '20%',
    fontWeight: 'bold',
  },
  label3: {
    width: '45%',
    fontWeight: 'bold',
  },
  textView: {
    flexDirection: 'row'
  },
  text1: {
    width: '80%',
  },
  text2: {
    width: '20%',
  },
  text3: {
    width: '45%',
  },
  
  locSelect: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    paddingTop: 8,
    color: '#333',
  },
  cardIcon: {
    width: 25,
    height: 17,
    marginTop: 7,
  },
  cardIcon1: {
    width: 25,
    height: 16,
    marginTop: 7,
  },
  cardText: {
    color: '#fff',
    paddingLeft: 5,
    //paddingTop: 5,
  },
  checkIcon: {
    width: 22,
    height: 22,
    alignSelf: 'center',
    // paddingBottom: 5,
    // paddingLeft: 15
    position: 'absolute',
    top: 13,
    right: 17
  },
  cardText: {
    color: '#3D3838',
    paddingLeft: 15,
    paddingTop: 5,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  removeView: {

  },
  removeIcon: {
    alignSelf: 'flex-end',
  },
  addView1: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: 20,
    backgroundColor: '#DCDDE6',
    borderRadius: 25, 
    
  },
  addIcon: {
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  addView: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignContent: 'center',
    alignSelf: 'center',
  },

  redText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#f00',
  },

  
  label:{
    color: '#555',
    paddingLeft: 15,
    marginTop: 10,
  },
  input: {
    width: '90%',
    height: 46,
    backgroundColor: '#EFF0F3',
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 10,
    color: '#333',
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
    textAlign: 'center',
    //marginRight: 30,
    color: '#5B5B5B',
    fontSize: 12,
    marginTop: 10,
  },
  forgotText1: {
    textAlign: 'center',
    //marginRight: 30,
    color: '#0B277F',
    fontSize: 12,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 75,
  },
  createText: {
    textAlign: 'center',
    color: '#0B277F',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  col50: {
    width: '50%',
  },
  col25: {
    width: '25%',
  },
  
submitButton: {elevation: 2,
  marginTop: 20,
  backgroundColor: '#0B277F',
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