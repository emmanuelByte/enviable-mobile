import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Picker, Image, Button, TextInput, StyleSheet, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { SERVER_URL } from '../../config/server';
import RNPickerSelect from 'react-native-picker-select';
import { poppins } from '../../config/fonts';

export class NewDispatch extends Component {
  constructor(props) {
    super();
    this.handleBackPress = this.handleBackPress.bind(this);
    this.state = {
      visible: false,loaderVisible: false,
      loaderVisible: false,
      
      categories: false,
      itemDescription: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      quantity: '',
      dispatchItemCategoryId: '',
      customer: false,
      payWithWallet: true,
      payWithCard: false,
      type: false,
      weightLabel: false,
      vs: false,
      vs: false,
    }
    this.getLoggedInUser();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack()
    return true
  }

  componentDidMount() {
    this.setState({
      type: this.props.route.params.type,
    }, () => {
      if(this.state.type == "Haulage"){
        this.setState({
          weightLabel: "Tonnage"
        })
      }else{
        this.setState({
          weightLabel: "KG"
        })
      }
      this.getCategories();
    });
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

  prepareData(data){
    var newData = [];
    for(var i=0;i<data.length;i++){
      var subData = {
        label: data[i].name,
        value: data[i].id
      }
      newData.push(subData)
    }
    this.setState({
      vs: newData
    })
  }
 
  getCategories(){
    var type = this.state.type;
    this.showLoader()
    fetch(`${SERVER_URL}/mobile/get_dispatch_item_categories`, {
      method: 'GET'
   }) 
   .then((response) => response.json())
   .then((res) => {
     this.hideLoader()
       console.log(res, "categories");
       this.hideLoader();
       
        
       if(res.success){
          this.setState({
            categories:  res.dispatch_item_categories.filter(function(cat){return cat.type == type})
          }, ()=> {
            this.prepareData(this.state.categories)
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
         { text: "Refresh", onPress: () => this.getCategories() }
       ],
     );
    });
  }
  async submit(){
    var d = new Date;
    var t = d.getTime();
    if(this.state.itemDescription == ""){
      this.showAlert("Error", "Kindly provide item description");
      return;
    }
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
    else if(this.state.quantity == ""){
      this.showAlert("Error", "Kindly provide quantity");
      return;
    }

    else{
      await AsyncStorage.getItem('dispatchCart').then((value) => {
        if(value){
          var dispatchCart = JSON.parse(value);
          var dispatchInfo = {};
          dispatchInfo.itemDescription= this.state.itemDescription;
          dispatchInfo.length= this.state.length;
          dispatchInfo.width= this.state.width;
          dispatchInfo.height= this.state.height;
          dispatchInfo.weight= this.state.weight;
          dispatchInfo.quantity= this.state.quantity;
          dispatchInfo.type= this.state.type;
          dispatchInfo.id = t;
          dispatchInfo.dispatchItemCategoryId= this.state.dispatchItemCategoryId;
          dispatchCart.push(dispatchInfo);
          AsyncStorage.setItem('dispatchCart', JSON.stringify(dispatchCart)).then(() => {
            this.props.navigation.navigate('DispatchCartSummary');
          });
        }else{
          var dispatchCart = [];
          var dispatchInfo = {};
          dispatchInfo.itemDescription= this.state.itemDescription;
          dispatchInfo.length= this.state.length;
          dispatchInfo.width= this.state.width;
          dispatchInfo.height= this.state.height;
          dispatchInfo.weight= this.state.weight;
          dispatchInfo.quantity= this.state.quantity;
          dispatchInfo.type= this.state.type;
          dispatchInfo.id = t;
          dispatchInfo.dispatchItemCategoryId= this.state.dispatchItemCategoryId;
          dispatchCart.push(dispatchInfo);
          AsyncStorage.setItem('dispatchCart', JSON.stringify(dispatchCart)).then(() => {
            this.props.navigation.navigate('DispatchCartSummary');
          });
        }
      });
      
      
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
    }, ()=> {  })
    
  }

  render() {
    const { visible } = this.state;
    return (
      <View style = {styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>

            <View style={styles.tRow}>
              <Icon onPress={() => this.props.navigation.goBack()} name="arrow-back" size={25} color="#000"  style = {styles.menuImage}/> 
              <Text style = {styles.headerText}>Dispatch info</Text>
            </View>
            <View style = {styles.bottomView}>
            <Text style = {styles.label}>Item description</Text>
              <TextInput
                            style={styles.input}
                            placeholder=""
                            onChangeText={(text) => this.setState({itemDescription: text})}
                            underlineColorAndroid="transparent"
                            
                          />
              <Text style = {styles.label}>Weight ({this.state.weightLabel && this.state.weightLabel})</Text>
              <TextInput
                                    style={styles.input}
                                    placeholder=""
                                    onChangeText={(text) => this.setState({weight: text})}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#ccc" 
                                    value={this.state.weight}
                                    keyboardType={'numeric'}
                                  />
               
              <Text style = {styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                onChangeText={(text) => this.setState({quantity: text})}
                underlineColorAndroid="transparent"
                placeholderTextColor="#ccc" 
                value={this.state.quantity}
                keyboardType={'numeric'}
              />
             
             <Text style = {styles.label}>Item category</Text>
             <TouchableOpacity style={[styles.input]}>
              <RNPickerSelect
                    placeholder=''
                    style={pickerSelectStyles}
                    selectedValue={this.state.dispatchItemCategoryId}  
                    onValueChange={(itemValue, itemIndex) => this.setState({dispatchItemCategoryId: itemValue})}
                    items={this.state.vs}
                    returnKeyType={ 'done' }
                    />
            
              </TouchableOpacity>
              <TouchableOpacity style={styles.addView}  onPress={() => this.submit()}> 
                  <LinearGradient start={{x: 0, y: 0}} end={{x:1, y: 0}}  colors={['#0B277F', '#0B277F']} style={styles.addGradient}>
                    <Text style={styles.addText}>Next</Text>
                  </LinearGradient>
                </TouchableOpacity>
            </View>
          </ScrollView>
          {this.state.loaderVisible &&
              <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
            }
        
      </View>
    )
  }
}

export default NewDispatch

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    backgroundColor: "#FFF",
  },
  backImage: {
    width: 18,
    height: 12,
    marginLeft: 20,
    marginTop: 40,
  },
  
  header: {
    width: '100%',
    height: 110,
    backgroundColor: 'rgb(126,83,191)',
    flexDirection: 'row',
  },
  headerTextZ: {
    fontSize: 20,
    fontFamily: poppins,
    paddingLeft: 25,
    marginTop: 20,
    color: '#333',
  },
  logoImage: {
    marginTop: 60,
    alignSelf: 'center',
    width: 75,
    height: 50,
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  cardView: {
    width: 190,
    alignSelf: 'flex-start',
    padding:10,
     
    borderRadius: 2,
    marginTop: 5,
    marginLeft: 15,
    flexDirection: 'row'
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
     
  },
  checkIcon: {
    width: 22,
    height: 22,
    alignSelf: 'center',
     
     
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
    fontFamily: poppins,  },
  addView: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  addGradient: {
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingTop: 7,
  },
  row: {
    flexDirection: 'row',
    width: '92%',
    alignContent: 'center',
    alignSelf: 'center',
  },



  label1:{
    color: '#555',
    paddingLeft: 10,
    marginTop: 10,
  },
  label:{
    color: '#555',
    paddingLeft: 20,
    marginTop: 10,
    fontFamily:poppins,
  },
  input: {
    width: '90%', 
    
    height: 40,
     
    borderRadius: 7,
    borderColor: '#ABA7A7',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5,
    paddingLeft: 15,
    color: '#444'
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
     
    color: '#5B5B5B',
    fontSize: 12,
    fontFamily: poppins,
    marginTop: 10,
  },
  forgotText1: {
    textAlign: 'center',
     
    color: '#0B277F',
    fontSize: 12,
    fontFamily: poppins,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },
  tRow: {
    flexDirection: 'row',
    marginTop: 50,
  },
  headerText: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#000',
     
    width: '80%',
    fontFamily: poppins,
  },
  menuImage: {
    paddingTop: 2, 
    paddingRight: 20,
    paddingLeft: 20,
     
  },
  createText: {
    textAlign: 'center',
    color: '#0B277F',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    fontFamily: poppins,
  },
  col50: {
    width: '50%',
  },
  col25: {
    width: '33.3%',
  },
  
submitButton: {
  elevation: 2,
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
   
   
   
  alignSelf: 'center',
  height: 50,
  width: 100,
  backgroundColor: '#FFF',
  paddingTop: 18,
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
})