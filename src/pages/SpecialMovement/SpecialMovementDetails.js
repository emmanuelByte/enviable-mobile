import React, { Component } from 'react';
import { View, Text, Alert, Linking, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import TimeAgo from 'react-native-timeago';
import { SERVER_URL } from '@src/config/server';
import PaystackWebView from "react-native-paystack-webview";



export class SpecialMovementDetails extends Component {
  constructor(props) {
    super();
    this.state = {
      checked: 0,
      visible: false, loaderVisible: false,
      forgotVisible: false,
      email: '',
      email1: '',
      customer: false,
      orderId: false,
      cartItems: false,
      deliveryInfo: false,
      orderParam: false,
      orderDetails: false,
      trn_ref: false,
      rating: 5,
      review: '',
      vs: false,
    }
  }

  componentDidMount() {

    this.setState({
      orderId: this.props.route.params.orderId,
    }, () => {
      this.getOrderDetails(this.state.orderId);
    })
  }



  getOrderDetails(order_id) {
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/get_special_movement_details/${order_id}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((res) => {
        this.hideLoader();
        if (res.success) {
          this.setState({
            orderParam: res.special_movement,

          }, () => {

          });
        } else {
          Alert.alert('Error', res.error);
        }
      })
      .catch((error) => {
        this.hideLoader();
        Alert.alert(
          "Communictaion error",
          "Ensure you have an active internet connection",
          [
            {
              text: "Ok",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Refresh", onPress: () => this.getOrderDetails() }
          ],
        );
      });
  }

  cancelSpecialMovement() {
    if (this.state.orderParam.status != "Pending") {
      return;
    }
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/cancel_special_movement/${this.state.orderParam.order_number}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "orders");
        this.hideLoader();
        if (res.success) {
          this.showAlert("Info", res.success);
          this.getOrderDetails(this.state.orderParam.id)
        }
      })
      .catch((error) => {
        console.error(error);
        this.showAlert("Error", "An unexpected error occured")
      });
  }



  showAlert(type, message) {
    Alert.alert(
      type,
      message,
    );
  }


  displayRatingButton() {
    if (this.state.orderParam && this.state.orderParam.status == "Delivered" && this.state.orderParam.rated == "No") {
      return (
        <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center' }}>
          <TouchableOpacity style={styles.addView7} onPress={() => this.setState({ forgotVisible: true })}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
              <Text style={styles.addText}>Rate rider </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
  }

  showLoader() {
    this.setState({
      loaderVisible: true
    });
  }
  hideLoader() {
    this.setState({
      loaderVisible: false
    });
  }



  payWithCash() {
    this.showLoader();

    fetch(`${SERVER_URL}/mobile/pay_dispatch_cash`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.state.customer.id,
        order_number: this.state.orderParam.order_number,
        amount: this.state.orderParam.delivery_fee,
        payment_method: "Pay with cash",
      })
    }).then((response) => response.json())
      .then((res) => {
        this.hideLoader();
        if (res.success) {
          this.showAlert("success", res.success);
          this.getOrderDetails(this.state.orderParam.id)
        } else {
          this.showAlert("Error", res.error)
        }
      }).done();
  }

  payWithCard() {
    this.showLoader();

    fetch(`${SERVER_URL}/mobile/pay_dispatch_card`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.state.customer.id,
        order_number: this.state.orderParam.order_number,
        trn_ref: this.state.trn_ref,
        amount: this.state.orderParam.delivery_fee,
        payment_method: "Pay with card",
      })
    }).then((response) => response.json())
      .then((res) => {
        console.log(res);
        this.hideLoader();
        if (res.success) {
          this.showAlert("success", res.success);

          this.getOrderDetails(this.state.orderParam.id)
        } else {
          this.showAlert("Error", res.error)
        }
      }).done();
  }


  rateRider() {
    this.setState({
      forgotVisible: false,
    })
    this.showLoader();
    fetch(`${SERVER_URL}/mobile/rateRider`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.state.customer.id,
        orderId: this.state.orderParam.id,
        type: "Dispatch",
        rating: this.state.rating,
        review: this.state.review,
      })
    }).then((response) => response.json())
      .then((res) => {
        console.log(res);
        this.getOrderDetails(this.state.orderParam.id)
        this.hideLoader();
        if (res.success) {
          Alert.alert(
            "Success",
            res.success,
          );
        } else {
          this.showAlert("Error", res.error)
        }
      }).done();
  }


  displayButton() {
    if (this.state.orderParam && this.state.orderParam.payment_status == "Pending") {
      return (
        <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center' }}>
          <TouchableOpacity style={styles.addView} onPress={() => this.payWithCash()}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
              <Text style={styles.addText}>Pay offline </Text>
            </LinearGradient>
          </TouchableOpacity>
          {this.state.customer && this.state.trn_ref &&
            <View style={styles.addGradient1}>
              <PaystackWebView
                buttonText="Pay online"
                textStyles={styles.addText1}
                btnStyles={styles.addGradient6}
                showPayButton={true}
                paystackKey="pk_live_6b3b23bc38a669799804cdc53316494a4678dcdb"
                amount={Math.floor(this.state.orderParam.delivery_fee)}
                billingEmail={this.state.customer.email}
                billingMobile={this.state.customer.phone1}
                billingName={this.state.customer.first_name}
                refNumber={this.state.trn_ref}
                ActivityIndicatorColor="green"
                handleWebViewMessage={(e) => {
                   
                  console.log(e);
                }}
                onCancel={(e) => {
                   
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
      )
    }
  }

  displayReceipt() {
    if (this.state.orderParam.status != "Pending" && this.state.orderParam.status != "Cancelled") {
      return (
        <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center' }}>
          <TouchableOpacity style={styles.addView8} onPress={() => Linking.openURL(`http://rickreen.com/mobile/dispatch_order_details_pdf/${this.state.orderParam.id}`)}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['brown', '#800020']} style={styles.addGradient}>
              <Text style={styles.addText}>Download order details </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      )
    }
  }

  render() {
    const { visible } = this.state;
    return (
      <View style={styles.body}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" size={18} color="000" style={styles.menuImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Order summary</Text>
        </View>

        <ScrollView style={styles.sView} showsVerticalScrollIndicator={false}>
          <View style={styles.cView}>
            <View style={styles.itemView4}>


              <View style={styles.item31}>
                <Text style={styles.label60}>Tracking No</Text>
                <Text style={styles.txt60}>#{this.state.orderParam && this.state.orderParam.order_number}</Text>
              </View>
              <View style={styles.item31}>
                <Text style={styles.label60}>Status</Text>
                <Text style={styles.txt60}>{this.state.orderParam && this.state.orderParam.status}</Text>
              </View>
              <Text style={styles.txt601}><TimeAgo time={this.state.orderParam && this.state.orderParam.created_at} /></Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.topic}>Other information</Text>
              <View style={styles.item1}>
                <Text style={styles.label10}>From</Text>
                <Text style={styles.label20}>To</Text>
              </View>
              <View style={styles.item2}>
                <Text style={styles.txt10}>{this.state.orderParam && this.state.orderParam.date_from}</Text>
                <Text style={styles.txt20}>{this.state.orderParam && this.state.orderParam.date_to}</Text>
              </View>
              <View style={styles.item3}>
                <Text style={styles.label}>Vehicle type</Text>
                <Text style={styles.txt}>{this.state.orderParam && this.state.orderParam.vehicle_type}</Text>
              </View>
              <View style={styles.item3}>
                <Text style={styles.label}>Service</Text>
                <Text style={styles.txt}>{this.state.orderParam && this.state.orderParam.service}</Text>
              </View>
              <View style={styles.item3}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.txt}>{this.state.orderParam && this.state.orderParam.location}</Text>
              </View>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.topic}>Note</Text>

              <View style={styles.item3}>
                <Text style={styles.txt}>{this.state.orderParam && this.state.orderParam.note}</Text>
              </View>
            </View>

            {
              this.state.orderParam.status === "Pending" ? <TouchableOpacity style={{ width: '80%', marginVertical: 20, marginHorizontal: '10%' }} onPress={() => this.cancelSpecialMovement()}>
                <Text style={{ height: 50, textAlign: 'center', borderRadius: 10, lineHeight: 40, color: 'white', backgroundColor: '#0B277F' }}>Cancel Order</Text>
              </TouchableOpacity>
                : null
            }

          </View>

        </ScrollView>


        {this.state.loaderVisible &&
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        }




      </View>
    )
  }
}

export default SpecialMovementDetails

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#f8f8f8",
  },
  cView: {
     
    width: '95%',
    alignSelf: 'center',
    marginBottom: 250,
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
  topic: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  topic1: {
    fontWeight: 'bold',
    paddingBottom: 10,
    fontSize: 12,
  },
  item31: {
    flexDirection: 'row',
  },
  itemView: {
    width: '95%',
    marginTop: 15,
    alignContent: 'center',
    alignSelf: 'center',
    padding: 10,
     
     
    backgroundColor: '#fff',
  },
  itemView4: {
    width: '95%',
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: 25,
    marginLeft: 30,
     
  },
  center: {
    alignSelf: 'center',
     
    marginBottom: 5,
    flexDirection: 'row',
     
  },
  wait: {
    color: '#252969',
    fontSize: 12,
     
    paddingTop: 10,
     
    marginBottom: 20,
  },
  addView8: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  itemView1: {
    width: '95%',
    marginTop: 10,
    alignContent: 'flex-start',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
     
     

     
  },
  item1: {
    width: '100%',
    flexDirection: 'row',
  },
  item11: {
    width: '100%',
    marginLeft: 30,
    alignSelf: 'center',
    marginBottom: 10,
     
     
  },
  item22: {
    flexDirection: 'row',
  },
  item2: {
    width: '100%',
    flexDirection: 'row',
  },
  item3: {
    width: '100%'
  },

  item36: {
    width: '50%',
    marginTop: 10,
  },

  addText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  addText1: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0B277F',
  },
  addView: {
    width: '49%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  addView3: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  addView7: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  addGradient4: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
    marginBottom: 20,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  addGradient1: {
    width: '50%',
    paddingLeft: 10,
  },
  addGradient6: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#0B277F',
    borderRadius: 8,
     
    paddingTop: 7,
    marginTop: 20,
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
  sView: {

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

  label10: {
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '60%',
  },
  label20: {
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '38%',
  },
  label40: {
    color: '#000',
    marginTop: 1,
    fontSize: 14,
    paddingBottom: 3,
     
  },
  label50: {
    color: '#454A65',
    marginTop: 3,
    fontSize: 12,
    fontWeight: 'bold',
  },
  label70: {
    fontWeight: 'bold',
    paddingBottom: 6,
  },
  label60: {
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '40%',
  },
  label88: {
     
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 12,
    width: '100%',
  },
  label: {
    color: '#454A65',
    marginTop: 1,
    fontSize: 12,
    width: '50%',
  },
  labelZ: {
    color: '#454A65',
    width: '50%',
     
    marginTop: 1,
    fontSize: 13,
  },
  labelZZ: {
    color: '#454A65',
    width: '50%',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 13,
  },
  txt10: {
    color: '#3D3838',
    width: '60%',
    marginBottom: 15,
    fontSize: 12,
  },
  txt20: {
    marginBottom: 15,
    color: '#3D3838',
    width: '38%',
    fontSize: 12,
  },
  txt601: {
    color: '#888',
    width: '100%',
    paddingTop: 3,
  },
  txt60: {
    color: '#3D3838',
    width: '50%',
    fontSize: 12,
  },
  txt61: {
    color: 'red',
    width: '50%',
    fontSize: 12
  },
  txt: {
    color: '#3D3838',
    fontSize: 12,
    marginBottom: 15,
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

  submitButton: {
    elevation: 2,
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
  },
  mLoading: {
    position: 'absolute',
    elevation: 2,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999999999999999999999999,
     
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)"
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
  spinnerTextStyle: {
    color: 'brown',
    textAlign: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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