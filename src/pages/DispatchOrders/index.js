import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import {NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from '../../config/server';
import { poppins } from '../../config/fonts';
import { connect } from 'react-redux';

export class DispatchOrders extends Component {
  constructor(props) {
    super();

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
      deliveryInfo: false,
    }
     
  }

   
   
   

  

   
   
   
   

   
   
   
   
   
  componentDidMount() {
     
    this.setState({
      customer: this.props.user
    }, ()=>{
      this.getOrders(this.props.user.id);

    });
    

}

  getOrders(id){
    this.showLoader();
    console.log(`${SERVER_URL}/mobile/get_dispatch_orders/${this.state.customer.id}`);
    fetch(`${SERVER_URL}/mobile/get_dispatch_orders/${this.state.customer.id}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((res) => {
     
       
       this.hideLoader();
       if(res.success){
          this.setState({
            orders: res.orders
          });
       }else{
         Alert.alert('Error', res.error);
       }
   })
   .catch((error) => {
      console.error(error);
      Alert.alert(
       "Something happened",
       "Unable to get Dispatch Orders at the moment",
       [
         {
           text: "Ok",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "Refresh", onPress: () => this.getOrders() }
       ],
     );
    });
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

   
   
   
   
   
   
   
   
   
   
   
          
   
   
   
   
   
displayStatus(order_status, payment_status){
  if(order_status == "Cancelled"){
    return(
      <Text style={{color: '#ED4515'}}>Cancelled</Text>
    )
  }
  else if(payment_status == "Pending"){
    return(
      <Text style={{color: '#0B277F', width: 90, borderRadius: 10, alignSelf: 'flex-end', textAlign: 'center', paddingTop: 5, paddingBottom: 5,}}>Pay now</Text>
      
    )
  } else if(order_status == "Pending"){
    return(
      <Text style={{color: '#EDBD15'}}>Pending </Text>
    )
  }else if(order_status == "Delivered"){
    return(
      <Text style={{color: '#3EC628'}}>Delivered</Text>
    )
  }
  else if(order_status == "Rider accepted"){
    return(
      <Text style={{color: '#EDBD15'}}>Rider accepted</Text>
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
  
}

gotoOrderDetails(order){
  this.props.navigation.navigate('DispatchOrderDetails', {
    orderId: order.id,
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
  
 

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <View style={styles.header}>
        <TouchableOpacity  onPress={() => this.props.navigation.pop()}>
        <Icon name="arrow-back" size={25} color="#000"  style = {styles.menuImage}/>
        </TouchableOpacity>
          <Text style = {styles.headerText}>Order history</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DispatchCartSummary')} style = {styles.cartView}>
          <Image source = {require('@src/images/cart.png')}  style = {styles.cartImage} />
          </TouchableOpacity>
        </View>
         
        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
          {this.state.orders && this.state.orders.map((order, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => this.gotoOrderDetails(order) }>
              <View style={styles.itemView}>
                <View style={styles.item1}>
                  <Text style = {styles.orderNumber}>#{order.order_number}</Text>
                  <Text style = {styles.date}><TimeAgo time={order.created_at} /></Text>
                </View>
                <View style={styles.item2}>
                  <Text style = {styles.label}>{this.displayStatus(order.status, order.payment_status)} </Text>
                  <Text style = {styles.price}>₦{parseFloat(order.delivery_fee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
          </View>
          
        </ScrollView>

        {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}
const mapStateToProps = (state, props) => {
  return {user: state.user.value, ...props};
}

export default connect(mapStateToProps)(DispatchOrders);

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
    zIndex: 0,
     
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
  orderNumber: {
    color: '#000',
    fontFamily: poppins

  },
  date: {
    color: '#999',
    paddingTop: 10,
    fontFamily: poppins

  },
  price: {
    color: '#000',
    textAlign: 'right',
    paddingTop: 10,
    fontFamily: poppins

  },
  item1: {
    width: '60%',
    fontFamily: poppins

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
    fontFamily: poppins
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
    marginTop: 50,
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
    marginTop: 50,
    width: '80%',
    fontFamily: poppins

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