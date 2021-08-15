import React, { Component  } from 'react';
import { AppState, View, Text, Alert, Image,TouchableWithoutFeedback, Button, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';


const SideMenu = (props) => {
    return(    
        <Modal
            isVisible={this.state.sideMenuModalVisible}
            onBackdropPress={() => {
                this.setState({ sideMenuModalVisible: false });
            }}
            height= {'100%'}
            width= {'100%'}
            style={styles.sideMenuModal}
            >
            <ImageBackground source = {require('./imgs/lbg.png')} style = {styles.modalContainer} >
            <ScrollView>
            <View>
                <View style={styles.topRow}>
                <View style = {styles.topImageView}>
                    <Image source = {require('./imgs/user.png')} style = {styles.userImage} />
                </View>
                <View style = {styles.topTextView}>
                    <Text style = {styles.topTextName}>
                    {this.state.customer && this.state.customer.first_name} {this.state.customer && this.state.customer.last_name}
                    </Text>
                    <Text style = {styles.topLocation}> 
                    Lagos, Nigeria
                    </Text>
                </View>
                </View>
                <View style = {styles.linkBody}>
                <View style = {styles.linkItem}>
                    <View style = {styles.iconView}>
                    <Icon.Button name="perm-contact-calendar" style = {styles.star} size={25} backgroundColor="transparent" color="#000" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textView}>
                    <Text style = {styles.current} onPress={this.navigateToScreen('Contact')}>Contact</Text>
                    </View>
                </View>
                
                <View style = {styles.linkItem}>
                    <View style = {styles.iconView}>
                    <Icon.Button name="notifications" style = {styles.star} size={25} backgroundColor="transparent" color="#000" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textView}>
                    <Text style = {styles.textLink} onPress={this.navigateToScreen('History')}>Notifications</Text>
                    </View>
                </View>
                <View style = {styles.linkItem}>
                    <View style = {styles.iconView}>
                    <Icon.Button name="person" style = {styles.star} size={25} backgroundColor="transparent" color="#000" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textView}>
                    <Text style = {styles.textLink} onPress={this.navigateToScreen('TestResults')}>Accounts</Text>
                    </View>
                </View>
                
                <View style = {styles.linkItem}>
                    <View style = {styles.iconView}>
                    <Icon.Button name="star" style = {styles.star} size={25} backgroundColor="transparent" color="#000" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textView}>
                    <Text style = {styles.textLink} onPress={this.navigateToScreen('Favourite')}>Favourites</Text>
                    </View>
                </View>
                
                </View>

                <View style = {styles.linkBodyBottom}>
                <View style = {styles.linkItemBottom}>
                    <View style = {styles.iconViewBottom}>
                    <Icon.Button name="perm-contact-calendar" style = {styles.star} size={25} backgroundColor="transparent" color="#908e98" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textViewBottom}>
                    <Text style = {styles.textLinkBottom} onPress={this.navigateToScreen('Settings')}>Settings</Text>
                    </View>
                </View>
                <View style = {styles.linkItemBottom}>
                    <View style = {styles.iconViewBottom}>
                    <Icon.Button name="help" style = {styles.star} size={25} backgroundColor="transparent" color="#908e98" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textViewBottom}>
                    <Text style = {styles.textLinkBottom} onPress={this.navigateToScreen('Contact')}>Help</Text>
                    </View>
                </View>
                <View style = {styles.linkItemBottom}>
                    <View style = {styles.iconViewBottom}>
                    <Icon.Button name="feedback" style = {styles.star} size={25} backgroundColor="transparent" color="#908e98" >
                    </Icon.Button>  
                    </View>
                    <View style = {styles.textViewBottom}>
                    <Text style = {styles.textLinkBottom} onPress={this.navigateToScreen('Feedback')}>Feedback</Text>
                    </View>
                </View>
                </View>

            </View>
            </ScrollView>
            
        </ImageBackground>
        </Modal>
    
    )


  }
export default SideMenu