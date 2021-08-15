import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from '../config/server';
const zeroPad = (num, places) => String(num).padStart(places, '0')
export class RideOrders extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      radioButtons: ['Option1', 'Option2', 'Option3'],
      checked: 0,
      toggleUpdate: false,
      visible: false,
      forgotVisible: false,
      orders: false,
      displayOrders: false,
      email: '',
      password: '',
      sortStatus: 'All',
      total: false,
      email1: '',
      customer: false,
      user: false,
      cartItems: false,
      deliveryInfo: false,
    }
    //this.getLoggedInUser();
  }

  async componentDidFocus(){
    await this.getLoggedInUser();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.subs.forEach(sub => sub.remove());
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
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
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
          this.getOrders();
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
displayStatus(order_status){
  if(order_status == "Pending"){
    return(
      <Text style={{color: '#EDBD15'}}>Pending </Text>
    )
  }else if(order_status == "Delivered"){
    return(
      <Text style={{color: '#3EC628'}}>Pending</Text>
    )
  }
  else if(order_status == "Rider confirmed"){
    return(
      <Text style={{color: '#EDBD15'}}>Rider confirmed</Text>
    )
  }
  else if(order_status == "Merchant confirmed"){
    return(
      <Text style={{color: '#EDBD15'}}>Merchant confirmed</Text>
    )
  }
  else if(order_status == "In transit"){
    return(
      <Text style={{color: '#EDBD15'}}>In transit</Text>
    )
  }
  else if(order_status == "Merchant rejected"){
    return(
      <Text style={{color: '#ED4515'}}>Merchant rejected</Text>
    )
  }
  else if(order_status == "Cancelled"){
    return(
      <Text style={{color: '#ED4515'}}>Cancelled</Text>
    )
  }
}

displayCategoryText(sortStatus){
  if(this.state.sortStatus == sortStatus){
    return (
      <Text style={[styles.segmentText, styles.linkHighlight ]}>{sortStatus}</Text>
    )
  }else{
    return (
    <Text style={[styles.segmentText]}>{sortStatus}</Text>
    )
  }
}

gotoOrderDetails(order){
    this.props.navigation.navigate('RideOrderDetails', {
      orderId: order.id,
    });
}
executeSortStatus(){
  if(this.state.sortStatus == "All"){
  var result = this.state.orders;
  }else{
    var result = this.state.orders.filter(obj => {
      return obj.order_details_status === this.state.sortStatus
    }) 
  }
  this.setState({
    displayOrders: result
  })
}
getOrders(){
  this.showLoader()
  fetch(`${SERVER_URL}/mobile/get_ride_share_orders/${this.state.customer.id}`, {
    method: 'GET'
 })
 .then((response) => response.json())
 .then((res) => {
   this.hideLoader()
   console.log(res);
   if(res.success){
        this.setState({
          orders:  res.orders,
          displayOrders: res.orders,
        });
     }else{
       Alert.alert('Error', res.error);
     }
 })
 .catch((error) => {this.hideLoader();
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
       { text: "Refresh", onPress: () => this.getOrders() }
     ],
     //{ cancelable: false }
   );
  });
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
        <StatusBar translucent={true}  backgroundColor={'#2BBAD8'}  />
        <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#2BBAD8', '#2BBAD8']} style={styles.header}>
        <TouchableOpacity  onPress={() => this.props.navigation.goBack()}>
        <Icon name="arrow-back" size={18} color="#fff"  style = {styles.menuImage}/>
        </TouchableOpacity>
          <Text style = {styles.headerText}>Order history</Text>
        </LinearGradient>
        
        <View style = {styles.bottomView}>
          <ScrollView  showsVerticalScrollIndicator={false}>
            <View style={styles.sView}>
                  {this.state.displayOrders && this.state.displayOrders.map((displayOrder, index) => (
                  <View  style = {styles.card} key={index} >
                    <View  style = {styles.cardRow}>
                      <View  style = {styles.col1}>
                        <Text style={styles.tHead}>Request no</Text>
                        <Text style={styles.tText}>#{zeroPad(displayOrder.id, 6)} </Text>
                        <Text style={styles.tHead}>Pick up</Text>
                        <Text style={styles.tText}>{displayOrder.pickup_address}</Text>
                        <Text style={styles.tHead}>Destination</Text>
                        <Text style={styles.tText}>{displayOrder.delivery_address}</Text>
                      
                      </View>
                    </View>
                    <TouchableWithoutFeedback style={styles.addView} onPress={() => this.gotoOrderDetails(displayOrder) }>
                      <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#2BBAD8', '#2BBAD8']} style={styles.addGradient}>
                        <Text style={styles.addText}>See details</Text>
                      </LinearGradient>
                    </TouchableWithoutFeedback>
                  </View>
                  ))}
                </View>
          </ScrollView>
        </View>
        {this.state.visible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
      </View>
    )
  }
}

export default RideOrders

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
    height: 110,
    backgroundColor: '#2BBAD8',
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
    width: '95%',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
    //marginRight: 20,
    //flexDirection: 'row',
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
    color: '#000',
    marginBottom: 10,
  },
  pName: {
    color: '#000',
    width: '100%',
  },
  date: {
    width: '40%',
    color: '#e21515',
    //paddingTop: 10,
    
  },
  desc: {
    color: '#999',
    //paddingTop: 10,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    paddingTop: 10,
  },
  item1: {
    width: '100%',
    flexDirection: 'row',
  },
  item11: {
    width: '100%',
    flexDirection: 'row'
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '100%',
    flexDirection: 'row'
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
    width: '30%',
    overflow: 'hidden',
  },
  contentCol3: {
    width: '70%',
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
  itemImage: {
    width: 80,
    height: 80,
    //alignSelf: 'center',
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    
    flexDirection: 'row',
    marginTop: 20,
  },
  rowh: {
    width: '100%',
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginTop: 10,
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
    marginLeft: 20,
    marginTop: 74,
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
  sView: {
    marginBottom: 250,
    flex:1,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 20,
    elevation: 2,
    marginTop: 15,
  },
  cardRow: {
    flexDirection: 'row',
  },
  col1: {
    width: '100%',
    // borderRightWidth: 1,
    // borderRightColor: '#a9a9a9' ,
  },
  col2: {
    width: '50%',
    paddingLeft: 15
  },
  tHead: {
    color: '#000' ,
    marginTop: 10,
  },
  tText: {
    color: '#555' ,
    fontSize: 13,
  },
  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addView: {
    width: '100%',
    height: 40,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
    marginTop: 10,
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
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#fff',
    marginTop: 73,
    width: '80%',
  },
  headerText1: {
    fontSize: 20,
    paddingLeft: 20,
    color: '#fff',
    fontWeight: "bold",

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
    color: '#000',
  },
  linkHighlight: {
    color: '#2BBAD8',
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
    width: '60%',
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
submitButton: {
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