import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from './config/server';
import PaystackWebView from "react-native-paystack-webview";

export class Transactions extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,loaderVisible: false,
      forgotVisible: false,
      orders: false,
      email: '',
      password: '',
      total: false,
      email1: '',
      customer: false,
      cartItems: false,
      transactions: false,
      transactions1: false,
      balance: false,
      creditTransactions: false,
      debitTransactions: false,
      deliveryInfo: false,
      trn_ref: new Date().getTime(),
      index1: true,
      index2: false,
      index3: false,
      amount: '1000',
      visible: false,loaderVisible: false,
      background1: '#fff',
      background2: 'transparent',
      color1: '#0B277F',
      color2: '#fff',
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

  componentWillMount(){
    
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  getTransactions(){
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/get_transactions/${this.state.customer.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       //console.log(res.transactions.length, "Transactions");
       this.hideLoader();
       if(res.success){
          this.setState({
            transactions:  res.transactions,
            balance: res.balance,
            transactions1:  res.credit_transactions,
            creditTransactions:  res.credit_transactions,
            debitTransactions:  res.debit_transactions,
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
         { text: "Refresh", onPress: () => this.getTransactions() }
       ],
       //{ cancelable: false }
     );
    });
  }

  changeView(index){
    if(index == 1){
      this.setState({
        transactions1: this.state.creditTransactions,
        background1: '#fff',
        color1: '#0B277F',
        color2: '#fff',
        background2: 'transparent',
      })
    }
    if(index == 2){
      this.setState({
        transactions1: this.state.debitTransactions,
        background1: 'transparent',
        color1: '#fff',
        color2: '#0B277F',
        background2: '#fff',
      })
    }
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
          this.getTransactions();
          this.setState({
            customer_id: this.state.customer.id
          })
        });
          
      }else{
        this.props.navigation.navigate('Login')
      }
    });
  }
displayStatus(type){
  if(type == "Credit"){
    return(
      <Text style={{backgroundColor: 'green', width: 70, borderRadius: 10, alignSelf: 'flex-end', textAlign: 'center', paddingTop: 5, paddingBottom: 5, color: '#fff'}}>Credit </Text>
    )
  }else if(type == "Debit"){
    return(
      <Text style={{backgroundColor: 'brown', width: 70, borderRadius: 10, alignSelf: 'flex-end', textAlign: 'center', paddingTop: 5, paddingBottom: 5, color: '#fff'}}>Debit</Text>
    )
  }
}

gotoOrderDetails(order){
  this.props.navigation.navigate('MerchantOrderDetails', {
    order: order,
  });
}

payWithCard(){
  this.setState({
    forgotVisible: false,
  })
  this.showLoader();
  
  fetch(`${SERVER_URL}/mobile/fund_wallet`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user_id: this.state.customer.id,
        trn_ref: this.state.trn_ref,
        amount: this.state.amount,
        payment_method: "Pay with card",
    })
  }).then((response) => response.json())
      .then((res) => {
        console.log(res);
        this.hideLoader();
        if(res.success){
          this.showAlert("success", res.success);
          // this.setState(prevState => ({
          //   orderParam: {
          //     ...prevState.orderParam,           // copy all other key-value pairs of food object
          //     payment_status: "Completed",
          //     payment_method: "Pay with card",
          //   }
          // }))
          this.getTransactions()
        }else{
          this.showAlert("Error", res.error)
        }
}).done();
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

displayNoTrans(){
  if(this.state.transactions && this.state.transactions.length < 1){
    return(
      <Text style={styles.red} >You have no transaction at this moment</Text>
    )
  }
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
            <Text style = {styles.headerText}>Transactions</Text>
        </View> 
        <ImageBackground source = {require('./imgs/eclipse.png')} style = {styles.bImage} >
          <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#0B277F', '#0B277F']} style={styles.bImage1}>
          
            <Text style = {styles.headerText0}>Current Balance </Text>
            <Text style = {styles.headerText1}>₦ {this.state.balance && parseFloat(this.state.balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            <View  style = {styles.row}>
                <TouchableOpacity onPress={() => this.changeView(1)}  style = {[styles.colk, {backgroundColor: this.state.background1}]}>
                  <Text style={[styles.segmentText, {color: this.state.color1}]}>Credit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeView(2)}  style = {[styles.coll, {backgroundColor: this.state.background2}]}>
                  <Text style={[styles.segmentText1, {color: this.state.color2}]}>Debit</Text>
                </TouchableOpacity>
                
              </View>
          </LinearGradient>
        </ImageBackground>
        {/*
        <TouchableOpacity  onPress={() => this.setState({forgotVisible: true})} style={styles.submitButton1}>
          <Text style={styles.submitButtonText}>Fund wallet</Text>
          </TouchableOpacity>
        */}
        <Text style = {styles.headerText5}>Transactions</Text>
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
          {this.displayNoTrans()}
          {this.state.transactions1 && this.state.transactions1.map((transaction, index) => (
            <TouchableWithoutFeedback key={index}>
              <View style={styles.itemView}>
                <View style={styles.item1}>
                  <Text style = {styles.orderNumber}>#{transaction.trn_ref}</Text>
                  <Text style = {styles.date}><TimeAgo time={transaction.created_at} /></Text>
                </View>
                <View style={styles.item2}>
                  {this.displayStatus(transaction.type)}
                  <Text style = {styles.price}>₦{parseFloat(transaction.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
            
            
            
          </View>

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
            <Text style = {styles.headerText7}>Fund wallet</Text>
            <Text style = {styles.headerText8}>Type in the amount you want to fund your wallet with. Minimum amount is N1,000.</Text>

            <Text style = {styles.label1}>Amount</Text>
                <TextInput
                            style={styles.input1}
                            onChangeText={(text) => {if(text == '' || text < 1){this.setState({amount: 1000,trn_ref:new Date().getTime()}) }else{this.setState({amount: text,trn_ref:new Date().getTime()})}}}
                            underlineColorAndroid="transparent"
                            keyboardType={'numeric'}
                            min={1}
                            value={this.state.amount}
                          />
              {this.state.customer && this.state.trn_ref && this.state.amount && 
                  <View style={styles.addGradient1}>
                  <PaystackWebView
                    buttonText="Pay with card"
                    textStyles={styles.addText1}
                    btnStyles={styles.addGradient6}
                    showPayButton={true}
                    paystackKey="pk_test_9b06080a0fde87971069a48fcb91e958720cede4"
                    amount={Math.floor(this.state.amount)}
                    billingEmail="paystackwebview@something.com"
                    billingMobile={this.state.customer.phone1}
                    billingName={this.state.customer.first_name}
                    refNumber={this.state.trn_ref}
                    ActivityIndicatorColor="green"
                    handleWebViewMessage={(e) => {
                      // handle the message
                      console.log(e);
                    }}
                    onCancel={(e) => {
                      // handle response here
                      console.log(e);
                    }}
                    onSuccess={(e) => {
                      console.log(e);
                      this.payWithCard();
                    }}
                    autoStart={false}
                  />
                </View>
              }
            </View>
          </Modal>
          
        </ScrollView>

        {this.state.visible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default Transactions

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#f8f8f8",
  },
  cView: {
    minHeight: 1200,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 50,
  },
  header: {
    width: '100%',
    //height: 110,
    //backgroundColor: '#0B277F',
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
  row: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 20,
  },
  segmentText: {
    //color: '#0B277F',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: 'center'
  
  },
  segmentText1: {
    //color: '#fff',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 7,
    textAlign: 'center'
  
  },
  colk: {
    width: '50%',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  coll: {
    width: '50%',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  
  },
  col3: {
    width: '33%',
    borderRadius: 18,
  },
  index1: {
    width: '100%',
    marginTop: 20.
  },
  red: {
    textAlign: 'center',
    marginTop: 80,
    color: '#999'
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
  orderNumber: {
    color: '#000'
  },
  date: {
    color: '#999',
    paddingTop: 10,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    paddingTop: 5,
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
  bImage: {
    width: '90%',
    height: 160,
    zIndex:1,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#0B277F',
    borderRadius: 20, 
    borderRadius: 20, 
  },
  bImage1: {
    width: '100%',
    height: 160,
    zIndex:0,
    //opacity: 0.6,
    overflow: 'hidden',
    borderRadius: 20, 
    borderRadius: 20, 
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
  
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 78,
  },
  menuImage: {
    marginLeft: 20,
    marginTop: 56,
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
    marginTop: -50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#000',
    marginTop: 53,
    width: '80%',
  },
  headerText5: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#000',
    marginTop: 10,
    width: '80%',
  },
  headerText0: {
    fontSize: 17,
    //paddingLeft: 10,
    color: '#fff',
    marginTop: 29,
    textAlign: 'center',
  },
  headerText1: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
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
    //width: '50%',
    textAlign: 'right'
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
    width: '90%',
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
  backgroundColor: '#0B277F',
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
addGradient: {
  borderRadius: 10,
  width: '100%',
  height: 40,
  paddingTop: 7,
},
addGradient1: {
  width: '100%',
  //paddingLeft: 10,
},
addText1: {
  textAlign: 'center',
  fontSize: 16,
  color: '#0B277F',
},
addGradient6: {
  borderRadius: 10,
  width: '90%',
  alignSelf: 'center',
  height: 40,
  borderWidth: 1,
  borderColor: '#0B277F',
  borderRadius: 8,
  //backgroundColor: 'green',
  paddingTop: 7,
  marginTop: 20,
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