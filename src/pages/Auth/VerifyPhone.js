import React, { Component } from 'react';
import { View, Text, Alert,StyleSheet, ScrollView, ActivityIndicator, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SERVER_URL } from '@src/config/server';
import CodeInput from 'react-native-code-input';
import fonts, { poppins } from '../../config/fonts';
import { connect } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';

export class VerifyPhone extends Component {
    constructor(props) {
        super();
        this.onFinishCheckingCode = this.onFinishCheckingCode.bind(this);
        // console.log(props.route, props.navigation);
        this.state = {
            radioButtons: ['Option1', 'Option2', 'Option3'],
            checked: 0,
            toggleUpdate: false,
            visible: false, loaderVisible: false,
            forgotVisible: false,
            email: null,
            visible1: false,
            token: ''
        }

    }


    componentDidMount() {
        this.setState({ email: this.props.route.params.email });
    }

    toggleUpdate() {
        if (this.state.toggleUpdate == true) {
            this.setState({
                toggleUpdate: false
            })
        } else {
            this.setState({
                toggleUpdate: true
            })
        }
    }
    showAlert(type, message) {
        Alert.alert(
            type,
            message,
        );
    }


    showLoader() {
        this.setState({
            visible: true
        });
    }
    hideLoader() {
        this.setState({
            visible: false
        });
    }


    resendVerification() {
        this.showLoader();

        fetch(`${SERVER_URL}/mobile/resend_verify_email`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: this.state.email,
            })
        }).then((response) => response.json())
            .then((res) => {
                console.log(res);
                this.hideLoader();
                if (res.success) {
                    this.showAlert("Token", "Your token has been Resent. Check your email")

                } else {
                    console.log(this.state.email)
                    this.showAlert("Error", res.error)
                }
            })

    }


    verify(code) {
        this.showLoader();
        //   alert(this.state.token);
        if (!code) {
            this.showAlert("Info", "Kindly input token");
            return;
        }
        console.log(this.state.email, this.state.token)

        fetch(`${SERVER_URL}/mobile/verify_token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: this.state.email,
                token: code,
                email: this.state.email
            })
        }).then((response) => response.json())
            .then(async (res) => {
                this.hideLoader();
                if (res.success) {
                    this.showAlert("success", res.success);

                    // Just log user In
                    // logInUser
                    await AsyncStorage.setItem('customer', JSON.stringify(res.customer));
                    this.props.dispatch(setUser({ user: res.customer, status: true }))

                } else {
                    this.showAlert("Error", res.error)
                }
            }).done();

    }

    onFinishCheckingCode(code) {
        // alert(code + "codecdcjvdbnvubc");
        this.setState({ token: code })
        this.verify(code);

    }


    showLoader() {
        this.setState({
            visible: true
        });
    }
    hideLoader() {
        this.setState({
            visible: false
        });
    }
    render() {

        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#0B277F', '#0B277F']} style={styles.body}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StatusBar translucent={true} backgroundColor={'#0B277F'} />

                    <TouchableOpacity style={styles.menuImageView} onPress={() => this.props.navigation.goBack()} >
                        <Icon name="arrow-back" size={30} color="#fff" style={styles.backImage} />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Verification</Text>

                    <View style={styles.bottomView}>
                        <Text style={styles.label}>Enter the 5 digits code sent to your{`\n`} email at {this.state.email} </Text>
                        <View style={styles.cv}>
                            <CodeInput
                                // inputComponent={()=><TextInput/>}

                                ref="codeInputRef2"
                                secureTextEntry
                                activeColor='#081c5c'
                                inactiveColor='#081c5c'
                                autoFocus={false}
                                inputPosition='center'
                                borderType={'square'}
                                space={25}
                                codeLength={5}
                                inputPosition={'full-width'}
                                size={50}

                                onFulfill={(code) => this.onFinishCheckingCode(code)}
                                containerStyle={{ marginTop: 40, marginBottom: 20, paddingBottom: 0, height: 0, }}
                                codeInputStyle={{ backgroundColor: '#081c5c', color: '#fff', }}
                            />
                        </View>



                        <TouchableOpacity onPress={() => this.verify()} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Verify</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.resendVerification()} >
                            <Text style={styles.headerText6}>Resend now </Text>
                        </TouchableOpacity>


                    </View>

                </ScrollView>
                {this.state.visible &&
                    <ActivityIndicator style={styles.loading} size="small" color="#ccc" />
                }
            </LinearGradient>
        )
    }
}

const mapStateToProps = (state, other) => {
    return { ...state, ...other }
}
export default connect(mapStateToProps)(VerifyPhone);

// export default VerifyPhone

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    body: {
        minHeight: '100%',
        marginBottom: 100,
        //backgroundColor: "#fff",
    },
    backImage: {
        width: 25,
        //height: 12,
        marginLeft: 20,
        marginTop: 60,
    },
    headerText6: {
        color: '#fff',
        //paddingLeft: 20,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
        textAlign: 'right',
        fontSize: 15,
        fontFamily: poppins,
    },
    headerText: {
        fontSize: 20,
        paddingLeft: 25,
        // fontWeight: 'bold',
        marginTop: '20%',
        color: '#fff',
        fontFamily: fonts.poppins.bold,
    },
    logoImage: {
        marginTop: 60,
        alignSelf: 'center',
        width: 75,
        height: 78,
    },
    bottomView: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        width: '95%',
        alignContent: 'center',
        alignSelf: 'center',
    },

    cv: {
        width: '85%',
        alignSelf: 'center'
    },

    label1: {
        color: '#fff',
        paddingLeft: 10,
        marginTop: 10,
    },
    label: {
        color: '#fff',
        width: '90%',
        alignSelf: 'center',
        //paddingLeft: 15,
        marginTop: 10,
        fontFamily: poppins,
    },
    input: {
        width: '90%',
        height: 46,
        backgroundColor: '#081c5c',
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 10,
        paddingLeft: 10,
        color: '#444',
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
    forgotText: {
        textAlign: 'center',
        //marginRight: 30,
        color: '#fff',
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
        color: '#fff',
        marginBottom: 100,
    },

    createText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 10,
        fontFamily: poppins,
    },
    col50: {
        width: '50%',
    },

    submitButton: {
        elevation: 2,
        marginTop: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
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
        color: '#0B277F',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: poppins,
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
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        //height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})