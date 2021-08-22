import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image, Button, TextInput, StyleSheet,TouchableHighlight, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SERVER_URL } from './config/server';
import ImageSlider from 'react-native-image-slider';

export class Welcome extends Component {
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
    }
    this.getLoggedInUser();
  }

  async componentDidMount() {
    
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
        this.props.navigation.navigate('Home')
        // this.setState({
        //   customer: JSON.parse(value)
        // }, () => {
        //   this.setState({
        //     customer_id: this.state.customer.id
        //   })
        // });
          
      }else{
        AsyncStorage.getItem('loginvalue').then((value) => {
          if(value){
            this.setState({
              email: value
            })
          }   
        });
      }
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

  /*
  displayText(index){
    //if(index == 2){
      
      return(
        <TouchableHighlight
                    key={index}
                    underlayColor="#ccc"
                    onPress={() => move(index)}
                    style={styles.button}
                  >
          <Text style={styles.buttonSelected}>
            {index + 1}
          </Text>
        </TouchableHighlight>
      )
    //}
  } 
  */
 displayText(position, index){
   console.log(position, "pos");
   console.log(index, "index");
   
   if(position == 0){
    return(
      <View  >
        <Text style={styles.buttonSelected}>
          HAULAGE SERVICES
        </Text>
        <Text style={styles.buttonSelected1}>
          Manage all your shipments and payments with easy
        </Text>
        <Text style={styles.dot11}>
          .
          <Text style={styles.dot12}>.</Text>
          <Text style={styles.dot13}>.</Text> 
        </Text>
        <TouchableOpacity  onPress={() => this.props.navigation.navigate('Login')} style={styles.submitButton1}>
          <Text style={styles.submitButtonText1}>Skip</Text>
        </TouchableOpacity>
      </View>
    )
   }
   
   else if(position == 1){
    return(
      <View  >
        <Text style={styles.buttonSelected}>
          COURIER SERVICES
        </Text>
        <Text style={styles.buttonSelected1}>
          Helps you with your daily reconcilations. No more headaches...!
        </Text>
        <Text style={styles.dot21}>
        .
        <Text style={styles.dot22}>.</Text>
        <Text style={styles.dot23}>.</Text>
        </Text>
        <TouchableOpacity  onPress={() => this.props.navigation.navigate('Home')} style={styles.submitButton1}>
          <Text style={styles.submitButtonText1}>Skip</Text>
        </TouchableOpacity>
      </View>
    )
   }
   else if(position == 2){
    return(
      <View  >
        <Text style={styles.buttonSelected}>
          RIDER SHARE
        </Text>
        <Text style={styles.buttonSelected1}>
          Helps you with your daily reconcilations. No more headaches...!
        </Text>
        <Text style={styles.dot31}>
        .
        <Text style={styles.dot32}>.</Text>
        <Text style={styles.dot33}>.</Text>
        </Text>
        <TouchableOpacity  onPress={() => this.props.navigation.navigate('Home')} style={styles.submitButton1}>
          <Text style={styles.submitButtonText1}>Skip</Text>
        </TouchableOpacity>
      </View>
    )
   }
   
   else{
     return (
       <View></View>
     )
   }
   
 }


  render() {
    const { visible } = this.state;
    const images = [
      require('./imgs/a1.png'),
      require('./imgs/a2.png'),
      require('./imgs/a0.png'),
      //require('./imgs/a4.png'),
    ];
    return (
      <View style = {styles.body}>
          <StatusBar translucent={true}  backgroundColor={'#0B277F'}  />
          <ImageSlider
            //loopBothSides
            //autoPlayWithInterval={3000}
            images={images}
            customSlide={({ index, item, style, width }) => (
              // It's important to put style here because it's got offset inside
              <LinearGradient start={{x: 0, y: 0}} end={{x:0, y: 1}}  colors={['#0B277F', '#407BFF']} key={index} style={[style, styles.customSlide]}>
                <Image source = {item} style={styles.customImage} />
              </LinearGradient>
            )}
            customButtons={(position, displayText) => (
              <View style={styles.buttons}>
                {images.map((image, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      //underlayColor="#ccc"
                      onPress={() => { if(position != 2) {displayText(position + 1, index + 1)}}}
                      style={styles.button}
                    >
                      {this.displayText(position, index)}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />

        
        
      </View>
    )
  }
}

export default Welcome

const styles = StyleSheet.create ({
  container: {
    width: '100%',
  },
  body: {
    height: '100%',
    width: '100%',
    //backgroundColor: "#fff",
    //paddingTop: 80,
  },
  customSlide: {
    backgroundColor: "transparent",
  },
  bImage1: {
    height: '100%',
    width: '100%',
  },
  customImage: {
    position: 'absolute',
    bottom: 290,
    width: 300,
    height: 220,
    //backgroundColor: "#fff",
    alignSelf: 'center',
    //marginTop: 40,
    zIndex: 0,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    zIndex: 99999999,
    width: '90%',
    alignSelf: 'center',
    //backgroundColor: '#000',
  },
  buttonSelected: {
    zIndex: 99999999,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    //marginBottom: 10,
  },
  buttonSelected1: {
    zIndex: 99999999,
    width: '85%',
    color: '#fff',
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '48%',
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
    marginRight: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center'
  },
  submitButton1: {
    marginTop: 30, 
    paddingTop: 50,
    paddingLeft: 50,
    alignSelf: 'flex-end',
  },
  submitButtonText1: {
    color: '#fff',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  dot11: {
    fontSize: 49,
    textAlign: 'center',
    color: '#fff',
    paddingLeft: 5,
  },
  dot12: {
    fontSize: 49,
    color: '#555',
    paddingLeft: 5,
  },
  dot13: {
    fontSize: 49,
    color: '#555',
  },
  dot14: {
    fontSize: 49,
    color: '#555',
  },
  dot21: {
    fontSize: 49,
    textAlign: 'center',
    color: '#555',
    paddingLeft: 5,
  },
  dot22: {
    fontSize: 49,
    color: '#fff',
    paddingLeft: 5,
  },
  dot23: {
    fontSize: 49,
    color: '#555',
  },
  dot24: {
    fontSize: 49,
    color: '#555',
  },
  dot31: {
    fontSize: 49,
    textAlign: 'center',
    color: '#555',
    paddingLeft: 5,
  },
  dot32: {
    fontSize: 49,
    color: '#555',
    paddingLeft: 5,
  },
  dot33: {
    fontSize: 49,
    color: '#fff',
  },
  dot34: {
    fontSize: 49,
    color: '#555',
    paddingLeft: 5,
  },
  dot41: {
    fontSize: 49,
    textAlign: 'center',
    color: '#555',
    paddingLeft: 5,
  },
  dot42: {
    fontSize: 49,
    color: '#555',
    paddingLeft: 5,
  },
  dot43: {
    fontSize: 49,
    color: '#555',
  },
  dot44: {
    fontSize: 49,
    color: '#fff', 
  },
  
})