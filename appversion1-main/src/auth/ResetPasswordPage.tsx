import * as React from 'react'
import { observer, inject } from "mobx-react"
import { RouterStore } from 'mobx-react-router';
// import LoginService from '../components/LoginService';
import { observable } from 'mobx';
import autobind from 'autobind-decorator'
import { View, Text, StatusBar, StyleSheet, Button, Alert, Image, Linking,Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { TextField } from 'react-native-materialui-textfield';
// import LinearGradient from 'react-native-linear-gradient';
import Storage from 'react-native-storage';
import { TextInput } from 'react-native-paper';
import { firebase } from '@react-native-firebase/auth';
import AccountService from '../service/AccountService';
import DropShadow from 'react-native-drop-shadow';
import { Overlay } from 'react-native-elements';
// import {setBadgeCount, getNotificationBadgeSetting} from 'react-native-notification-badge'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'

const window = Dimensions.get("window");
const screen = Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

export const Styles = StyleSheet.create({
    headText: {
        fontSize:screen.height*.03,
        fontWeight:'600',
        fontFamily: 'Poppins-SemiBold',
        color:'#858783',
        width: screen.width*.88,
        textAlign:'left',
        
    },
    logoImg: {
        height: screen.height*.203,
        width: screen.height*.195,
        // marginVertical: 20
    },
    leafImg: {
        position:'absolute',
        top:screen.height*.675,
        left: screen.width*.723,
        height: screen.height*.358,
        width: screen.height*.193,
    },
    screenDiv: {
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',//'#F4F5F6'
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        paddingHorizontal: screen.width*.059,
        paddingTop: screen.height*.037
    },
    loginBtn: {
        padding: 10,
        borderRadius: 8,
        // marginHorizontal: 40, 
        marginVertical:  22,
        width: screen.width*.8787,
        height:49,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#447682',
        
    },
    // loginBtnDisabled: {
    //     padding: 4,
    //     borderRadius: 50,
    //     marginHorizontal: 40, 
    //     marginVertical:  screen.height*.02,
    //     width: screen.width*.84,
    //     height:0.059 * screen.height,
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     alignSelf: 'center',
    //     backgroundColor: '#447682',
    // },
    loginBtnText: {
        color: '#FFF',
        fontSize:screen.height*.02,
        fontFamily: 'Poppins-Medium',
    },
})

type ResetPasswordPageProps = {
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
    match?: any
}


@inject('routing')
@inject('storage')
@inject('account')
@observer
export default class ResetPasswordPage extends React.Component<ResetPasswordPageProps, {}> {

    @observable
    newPassword = ''

    @observable
    confirmPassword = ''

    @observable
    fn = null;

    @observable
    errorMessage = ''

    @observable
    loading = false;

    @observable
    successMessage = ''

    @observable
    isPasswordReset = false;
    
    @observable
    username = null

    @autobind
    async gotoLogin() {
        let uid = await this.props.storage.load({
            key: 'userID'
        }).then(ret=>{
            console.log(ret);
            return ret;
        })
        .catch(err => {
            // any exception including data not found
            // goes to catch()
            console.warn(err.message);
            switch (err.name) {
              case 'NotFoundError':
                return null
                break;
              case 'ExpiredError':
                return null
                break;
            }
          });
        console.log('uid',uid)
        if(!uid){
            let appKey = await this.props.storage.load({
                key: 'appKey'
            }).then(ret=>{
                console.log(ret);
                return ret;
            })
            .catch(err => {
                // any exception including data not found
                // goes to catch()
                console.warn(err.message);
                switch (err.name) {
                  case 'NotFoundError':
                    return null;
                    break;
                  case 'ExpiredError':
                    return null;
                    break;
                }
              });
            
            if(appKey){
                this.props.routing.push('/login')
            }else{
                this.props.routing.push('/signup1')
            }
            
        }else{
            // let res = await this.props.account.autoSignInWithUID(uid)
            // if(res=='SUCCESS'){
            //     // try{
            //     //     PushNotificationIOS.setApplicationIconBadgeNumber(2);
            //     // }catch(err){
            //     //     console.log(err)
            //     // }
                
                
            //     this.props.routing.push('/home')
            // }else{
            //     this.props.routing.push('/login')
            // }
            
        }
        
        //this.props.routing.replace('/login')
    }


    @autobind
    gotoSignin() {
        this.props.routing.push('/login')
    }

    @autobind
    async resetPassword() {
        if(this.username){
            this.loading = true;
            let res = await this.props.account.resetPassword(this.username,this.newPassword)
            this.loading = false;
            if(res=="SUCCESS"){
                this.isPasswordReset = true;
                this.successMessage = 'We have sent a password reset link to your email'
                this.props.routing.replace('/resetSuccess')
                // setTimeout(()=>this.props.routing.replace('/login'),2000)
            }else{
                this.errorMessage = res.split('_').join(' ')
            }
        }
        
        
    }

    async componentDidMount(){
        let {id} = this.props.match.params
        console.log('resetMail',id)
        this.username = id
    }

    componentWillUnmount(){
        clearTimeout(this.fn)
    }

    render() {
        
        return (
            <>
                <StatusBar barStyle="dark-content"  />
                {this.loading?
                <Overlay isVisible={this.loading} overlayStyle={{backgroundColor:'transparent'}}>
                    <ActivityIndicator size="large" color="#FFF" style={{margin:10}}/>
                </Overlay>
                :null}
                <View style={Styles.screenDiv} >
                    {/* <TouchableOpacity onPress={this.gotoSignin}
                        style={{alignSelf:'flex-start',marginVertical:24}}>
                        <Image  style={{width:screen.width*.048,height:screen.width*.035}}
                        source={require('../assets/images/backArrow_2x.png')}/>
                    </TouchableOpacity> */}
                    <Text style={Styles.headText}>
                        reset <Text style={{fontWeight:'400',fontFamily: 'Poppins-Regular'}}>password</Text>
                    </Text>
                    {/* <Text style={{color:'#858783',fontSize:14,marginTop:10,width:screen.width*.808}}>
                    Please enter your registered email address, we will send you instructions to reset your password
                    </Text> */}
                    <TextInput
                        label={this.newPassword.length>0?"New password":null}
                        placeholder="New password"
                        value={this.newPassword}
                        onChangeText={text => this.newPassword=text}
                        selectionColor='#D4D4D4'
                        underlineColor='#D4D4D4'
                        // onFocus={()=>this.textLineColour='#2E4E5B'}
                        placeholderTextColor='#A8AAA5'
                        style={{
                            width:screen.width*.8787,
                            height:screen.height*.075,
                            backgroundColor:'#FFF',
                            paddingHorizontal:0,
                            paddingTop:0,
                            color:'#2E4E5B',
                            borderBottomColor:'#2E4E5B',
                            marginVertical:10
                        }}
                        textContentType='password'
                        theme={{ colors: { primary: '#2E4E5B',text: '#2E4E5B'},
                                fonts: {light: {fontFamily:'Poppins-Light'},
                                        medium: {fontFamily:'Poppins-Medium'},
                                        regular: {fontFamily:'Poppins-Regular'}}}}
                        />
                    <TextInput
                        label={this.confirmPassword.length>0?"Confirm password":null}
                        placeholder="Confirm password"
                        value={this.confirmPassword}
                        onChangeText={text => this.confirmPassword=text}
                        selectionColor='#D4D4D4'
                        underlineColor='#D4D4D4'
                        // onFocus={()=>this.textLineColour='#2E4E5B'}
                        placeholderTextColor='#A8AAA5'
                        style={{
                            width:screen.width*.8787,
                            height:screen.height*.075,
                            backgroundColor:'#FFF',
                            paddingHorizontal:0,
                            paddingTop:0,
                            color:'#2E4E5B',
                            borderBottomColor:'#2E4E5B',
                            marginVertical:10
                        }}
                        textContentType='password'
                        theme={{ colors: { primary: '#2E4E5B',text: '#2E4E5B'},
                                fonts: {light: {fontFamily:'Poppins-Light'},
                                        medium: {fontFamily:'Poppins-Medium'},
                                        regular: {fontFamily:'Poppins-Regular'}}}}
                        />
                    <DropShadow
                        style={{
                            shadowColor: "#44768270",
                            shadowOffset: {
                            width: 0,
                            height: 5,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 10,
                            elevation: 15,
                            alignSelf:'center',
                        }}
                    >
                        <TouchableOpacity
                            style={Styles.loginBtn}
                            onPress={this.resetPassword} 
                            disabled={this.newPassword.length>0 && this.newPassword==this.confirmPassword?false:true}
                            >
                            <Text style={{...Styles.loginBtnText,fontWeight:'600'}}>
                                RESET PASSWORD
                            </Text>
                        </TouchableOpacity>
                    </DropShadow>
                    
                </View>
                
                   
                    
                
            </>
            
        )
    }
}

