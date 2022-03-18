import React, { Component } from 'react';
import {  View, Text, Linking,StyleSheet, Platform, Image, ScrollView, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

export class Help extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false,
      loaderVisible: false,
      callNum: '+2349031461604',
      chatVisible: false,
    }
  }

  async componentWillMount() {
    if (Platform.OS === 'ios') {
      this.setState({
        callNum: '+2349031461604'
      });
    }
    else {
      this.setState({
        callNum: '+2349031461604'
        });
    }

  }







  render() {
    const { visible } = this.state;
    return (
      <View style={styles.body}>

        <ImageBackground resizeMode={'cover'} source={require('@src/images/custo.png')} style={styles.bImage} imageStyle={styles.bImage1} >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flexDirection: 'row', width: '100%' }}>
            <Icon name="arrow-back" size={20} color="#fff" style={styles.backImage} />
            <Text style={styles.headerText}>Help desk</Text>
          </TouchableOpacity>
        
        </ImageBackground>

        <ScrollView>
          <View style={styles.bottomView}>


            <View style = {styles.cardView1}>
              <View style = {styles.cola}>
              <View style = {styles.d}>
              <Image source = {require('@src/images/p.png')}  style = {styles.ica} />
              </View>
              <View style = {styles.d1}>
              <Image source = {require('@src/images/w.png')}  style = {styles.ica} />
              </View>
              
              </View>
              <View style = {styles.colb}>
                <TouchableOpacity  onPress={()=> Linking.openURL('tel:'+this.state.callNum)} style = {styles.da}>
                  <Text style = {styles.fText}>+234 906 149 7052</Text> 
                  <Text style = {styles.cText}>Call now</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={()=> Linking.openURL(`whatsapp://send?phone=+2348133629929`)} style = {styles.d3}>
                <Text style={styles.fText}>+234 813 362 9929</Text>
                  <Text style={styles.cText}>Chat now</Text>
                </TouchableOpacity>
                
              </View>
            </View>

            <View style={styles.cardViewd}>
              <Text style={styles.xText}>Email</Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.cola}>
                  <View style={styles.d}>
                    <Image source={require('@src/images/m.png')} style={styles.icav} />
                  </View>

                </View>
                <View style={styles.colb}>
                  <View style={styles.da}>

                    <Text style={styles.fText1} onPress={() => Linking.openURL(`mailto:help@ets.com.ng`)}>help@ets.com.ng</Text>

                  </View>

                </View>
              </View>
            </View>

  <View style = {styles.cardViewd}>
              <Text style = {styles.xText}>Social</Text> 
              <View style={{flexDirection: 'row'}}>
                <View style = {styles.coll}>
                  <TouchableOpacity onPress={() => Linking.openURL(`https://www.facebook.com/enviabletransport`)} style = {styles.d}>
                    <Image source = {require('@src/images/f.png')}  style = {styles.icac} />
                  </TouchableOpacity>
               </View> 
               <View style = {styles.cola}>
                  <TouchableOpacity onPress={() => Linking.openURL(`https://www.instagram.com/enviable.transport?r=nametag`)} style = {styles.d}>
                    <Image source = {require('@src/images/i.png')}  style = {styles.icad} />
                  </TouchableOpacity>
               </View> 
               
              
              </View>
            </View>
         
            <Modal
              isVisible={this.state.chatVisible}
              onBackdropPress={() => {
                this.setState({ chatVisible: false });
              }}
              height={'100%'}
              width={'100%'}
              style={styles.modal}
            >
              <View style={styles.chatModalView}>
                <TouchableOpacity onPress={() => this.setState({ chatVisible: false })} style={{ flexDirection: 'row', width: '100%' }}>
                  <Icon name="arrow-back" size={20} color="#000" style={styles.backImageO} />
                  <Text style={styles.headerTexto}>Close chat</Text>
                </TouchableOpacity>
                <WebView source={{ uri: 'https://rickreen.com/chat' }} />
              </View>
            </Modal>
          </View>
        </ScrollView>
        {this.state.visible &&
          <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
        }
      </View>
    )
  }
}

export default Help

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    minHeight: '100%',
    width: '100%',
    backgroundColor: "#fff",
  },
  backImage: {
    marginTop: 61,
    marginLeft: 20,
  },
  backImageO: {
    marginTop: 11,
    marginBottom: 15,
    marginLeft: 20,
  },
  chatView: {
    marginTop: 60,
    borderColor: '#0B277F',
    borderWidth: 1,
     
    borderRadius: 27,
    marginLeft: 20,
    width: 160,
     
    paddingTop: 12,
    paddingBottom: 13,
  },
  chatText: {
    color: '#0B277F',
    textAlign: 'center',
  },
  bImage: {
    width: '100%',
    height: 220,
     
  },
  bImage1: {
     
     
     
     
  },
  d: {
    marginTop: 10,
  },
  da: {
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
  },
  d3: {
    marginTop: 25,
    flexDirection: 'row',
    width: '100%',
  },
  d1: {
    marginTop: 25,
    flexDirection: 'row',
    width: '100%',
  },
  d2: {
    marginTop: 16,
  },
  tText: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#475168',
  },
  logoImage: {
    marginTop: 90,
    alignSelf: 'center',
    width: 85,
    height: 75,
  },
  hh: {
    flexDirection: 'row',
    width: '100%',
  },
  product: {
     
     
    width: '100%',
    marginTop: 10,
    alignContent: 'center',
    alignSelf: 'center',
  },
  cView: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: -90,
  },
  userImage: {
    width: 70,
    height: 70,
    margin: 10,
    alignSelf: 'center'
  },
  cardView0: {
    width: '90%',
     
     
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 19,
    borderRadius: 9,
    marginBottom: 15,
    marginTop: 15,
     
  },
  cardView1: {
    flexDirection: 'row',
    width: '90%',
     
     
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 9,
    marginBottom: 10,
     
  },
  cardViewd: {
    width: '90%',
     
     
     
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 9,
    marginBottom: 15,
     
  },
  cardView2: {

    width: '90%',
     
     
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 9,
    marginBottom: 15,
     
  },
  cardView1Row: {
    flexDirection: 'row',
  },
  col1: {
    width: '50%',
    borderRightWidth: 1,

    borderRightColor: '#e8e8e8',
    borderStyle: 'dashed',
  },
  col2: {
    width: '50%'
  },
  cola: {
    width: '15%',
  },
  coll: {
    width: '12%',
  },
  colb: {
    width: '85%',
  },
  cola1: {
    width: '25%',
  },
  colb1: {
    width: '75%',
  },
  colc: {
    width: '35%',
  },
  buyText: {
    textAlign: 'center',
  },
  cText: {
    color: '#475168',
    fontSize: 14,
    color: '#EF0000',
    textAlign: 'right',
    alignSelf: 'flex-end'
     
  },
  fText: {
    color: '#555',
    fontSize: 14,
    width: '70%'
  },
  fText1: {
    color: '#407BFF',
    fontSize: 14,
    width: '70%'
  },
  fTextu: {
    color: '#E7081A',
    fontSize: 17,
    marginLeft: 20,
    marginTop: 60,
     
  },
  xText: {
    color: '#555',
     
    fontSize: 14,
    width: '70%'
  },
  cText4: {
    color: '#56607B',
  },
  gText: {
    color: '#56607B',
    paddingBottom: 13,
  },
  cText5: {
    color: '#407BFF',
  },
  cText1: {
    color: '#475168',
    fontSize: 14,
     
  },
  cText2: {
    color: '#475168',
    fontSize: 12,
     
  },
  tDate: {
    fontSize: 20,
    color: '#2D323D',
    fontWeight: 'bold',
  },
  pText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sText: {
    fontSize: 11,
    color: '#777D8C'
  },
  buy: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  },
  bank: {
    height: 35,
    width: 35,
    marginTop: 10,
    alignSelf: 'center',
  },
  sell: {
    height: 50,
    width: 50,
    alignSelf: 'center',
  },
  hbg: {
    height: 150,
    width: '100%',
    alignSelf: 'center',
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
     
    minHeight: 700,
    backgroundColor: '#fafafa',
  },
  headerText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
    marginTop: 60,

    fontWeight: '700',
  },
  headerTexto: {
    marginLeft: 10,
    color: '#000',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,

    fontWeight: '700',
  },
  headerText2: {
    marginLeft: 20,
    color: '#808080',
    fontSize: 14,
     
  },
  currentText: {
    marginLeft: 40,
    marginTop: 35,
    color: '#407BFF',
    fontSize: 18,

  },
  currentText3: {
    marginLeft: 40,
    marginTop: 5,
    color: '#b5b5b5',
    fontSize: 12,
  },
  currentText2: {
    marginLeft: 40,
     
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  ic: {
    marginTop: 8,
  },
  icab: {
    width: 23,
    height: 20
  },
  icav: {
    width: 21,
    height: 17
  },
  icac: {
    width: 10,
    height: 20
  },
  icad: {
    width: 20,
    height: 20
  },
  ica: {
    width: 20,
    height: 20
  },
  checkIcon: {
    width: 42,
    height: 42,
    alignSelf: 'center',
     
     
    position: 'absolute',
    top: -15,
    right: -23
  },
  headerText9: {
    fontSize: 25,
    paddingLeft: 20,
  },
  headerText7: {
    paddingLeft: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  headerText8: {
    paddingLeft: 20,
    paddingRight: 20,
  },




  label: {
    color: '#ddd',
    paddingLeft: 25,
    marginTop: 13,
  },
  input: {
    width: '90%',
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: '#494949',
    alignSelf: 'center',
    marginTop: 5,

    paddingLeft: 10,
    color: '#333',
  },
  input1: {
    width: '90%',
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: '#494949',
    alignSelf: 'center',
    marginTop: 25,
    paddingLeft: 10,
    color: '#333',
  },
  forgotText: {
    textAlign: 'right',
    marginRight: 20,
    color: '#E7081A',
    fontSize: 12,
    marginTop: 20,
  },
  createText1: {
    textAlign: 'center',
    marginTop: 13,
  },

  createText: {
    textAlign: 'center',
    color: '#E7081A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },

  submitButton: {
     
    backgroundColor: '#E7081A',
    elevation: 2,
    borderColor: 'rgba(255, 114, 94, 0.69)',
    borderRadius: 10,
    width: '50%',
    marginRight: 10,
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  submitButton1: {
     
     
    elevation: 2,
    borderColor: '#E7081A',
    borderRadius: 10,
    width: '50%',
    marginRight: 10,
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 13,
  },
  submitButtonText1: {
    color: '#E7081A',
    textAlign: 'center'
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
  chatModalView: {
     
     
     
    alignSelf: 'center',
    alignContent: 'center',
    height: '100%',
    width: '100%',
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