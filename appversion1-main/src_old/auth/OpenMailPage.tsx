import * as React from 'react'
import { observer, inject } from "mobx-react"
import { RouterStore } from 'mobx-react-router';
// import LoginService from '../components/LoginService';
import { observable } from 'mobx';
import autobind from 'autobind-decorator'
import { View, Text, StatusBar, StyleSheet, Button, Alert, Image, Linking,Dimensions, TouchableOpacity, Platform } from 'react-native';
import { TextField } from 'react-native-materialui-textfield';
// import LinearGradient from 'react-native-linear-gradient';
import Storage from 'react-native-storage';
import { TextInput } from 'react-native-paper';
import { firebase } from '@react-native-firebase/auth';
import AccountService from '../service/AccountService';
import DropShadow from 'react-native-drop-shadow';
import { openInbox } from 'react-native-email-link'
import { SvgCss } from 'react-native-svg';
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';
// import {setBadgeCount, getNotificationBadgeSetting} from 'react-native-notification-badge'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'

const window = Dimensions.get("window");
const screen = Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

export const Styles = StyleSheet.create({
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
        borderColor: '#447682',
        borderStyle: 'solid',
        borderWidth: 1,
        // marginHorizontal: 40, 
        marginVertical:  22,
        width: screen.width*.8787,
        height:49,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        
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
        color: '#447682',
        fontSize: screen.height*.02,
        fontFamily:'Poppins-Medium'
    },
})

type OpenMailPageProps = {
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
}


@inject('routing')
@inject('storage')
@inject('account')
@observer
export default class OpenMailPage extends React.Component<OpenMailPageProps, {}> {

    @observable
    email = ''

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
    async openMail() {
        console.log('Open Mail')
       openInbox();
       this.props.routing.push('/reset')
        
    }

    componentDidMount(){
        
    }

    componentWillUnmount(){
        clearTimeout(this.fn)
    }

    render() {
        
        return (
            <>
                <StatusBar barStyle="dark-content"  />
                
                <View style={Styles.screenDiv} >
                    <TouchableOpacity onPress={this.gotoSignin}
                    hitSlop={{bottom:10,top:10,right:10,left:10}}
                        style={{alignSelf:'flex-start',marginVertical:24}}>
                        <SvgCss  style={{width:screen.width*.048,height:screen.width*.035}}
                        xml={BackArrowGrey}/>
                    </TouchableOpacity>
                    <Text style={{color:'#858783',fontSize:14,marginTop:10,width:screen.width*.808,fontFamily:'Poppins-Regular'}}>
                    Please check your email for further Instructions on how to reset your password.
                    </Text>
                    {/* <DropShadow
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
                    > */}
                        <TouchableOpacity
                            style={Styles.loginBtn}
                            onPress={this.openMail}
                            >
                            <Text style={{...Styles.loginBtnText,fontWeight:'600'}}>
                                OPEN MAIL
                            </Text>
                        </TouchableOpacity>
                    {/* </DropShadow> */}
                    
                </View>
                
                   
                    
                
            </>
            
        )
    }
}

