import * as React from 'react'
import { observer, inject } from "mobx-react"
import { RouterStore } from 'mobx-react-router';
import { observable } from 'mobx';
import autobind from 'autobind-decorator'
import { TextInput, View, Text, StatusBar, StyleSheet, Image,Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Storage from 'react-native-storage';
import AccountService from '../service/AccountService';
import DropShadow from 'react-native-drop-shadow';
import { SvgCss } from 'react-native-svg';
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';
import FastImage from 'react-native-fast-image'
const screen = Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

export const Styles = StyleSheet.create({
    headText: {
        fontSize:screen.height*.03,
        fontWeight:'600',
        fontFamily: 'Poppins-Regular',
        color:'#858783',
        width: screen.width*.88,
        textAlign:'left',
    },

    labelText: {
        fontSize:screen.height*.0175,
        fontWeight: '400',
        color: '#A8AAA5',
        marginTop: screen.height*.021,
        marginBottom: screen.height*.009
    },

    logoImg: {
        height: screen.height*.069,
        width: screen.height*.069, 
    },

    prefImg:{
        height: screen.width*.10795,
        width: screen.width*.1138,
        marginHorizontal:screen.width*.02,
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

    nextBtn: {
        padding: 10,
        borderRadius: 8,
        // marginVertical:  22,
        width: screen.width*.8787,
        height:screen.height*.0735,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#447682',
        position:'absolute',
        bottom: 10
    },

    addBtn: {
        borderRadius: 8,
        borderColor: '#D1D3CD',
        borderStyle: 'solid',
        borderWidth: 1,
        marginVertical:  5,
        width: screen.width*.25067,
        height:screen.height*.042,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        
    },
    addBtnText: {
        color: '#424441',
        fontSize:screen.height*.0175,
    },
    
    loginBtnText: {
        color: '#FFF',
        fontSize:screen.height*.02
    },
})

type PersonalDetails2PageProps = {
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
}


@inject('routing')
@inject('storage')
@inject('account')
@observer
export default class PersonalDetails2Page extends React.Component<PersonalDetails2PageProps, {}> {

    @observable
    bio = ''

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
    friendsList = []
    
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
        if(!uid){
            let appKey = await this.props.storage.load({
                key: 'appKey'
            }).then(ret=>{
                return ret;
            })
            .catch(err => {
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
    gotoBack() {
        this.props.routing.push('/profile1')
    }

    @autobind
    async goNext() {
        await this.props.account.updateUserProfileDetails({
            about: this.bio
        })
        this.props.routing.replace('/locationSearch')
        
    }

    addFriend(friendId) {
        console.log(friendId)
    }

    componentDidMount(){
        this.friendsList = [
            {
                id: 'friend1',
                icon: require('../assets/images/samples/user1.png'),
                name: 'Karen Green',
                description: 'The only thing I like better...',
                preferences: [
                    {
                        id: 'susPref1',
                        icon: require('../assets/images/sustMeat.png'),
                        title: 'Sustainable meat',description: 'This icon is given to Lars Bertelsen as at least 25% of the meat served in their restaurant is EU Organic certified. They are now in the process of obtaining other certifications. The list is here as follows:'
                    },
                    {
                        id: 'susPref2',
                        icon: require('../assets/images/veganFriendly.png'),
                        title: 'Vegan friendly',
                    },
                    {
                        id: 'susPref3',
                        icon: require('../assets/images/noPlastic.png'),
                        title: 'Plastic unfriendly',
                    },
                ]
            },
            {
                id: 'friend2',
                icon: require('../assets/images/samples/user2.png'),
                name: 'Clay Johnson',
                description: 'You know, food is such – it’s a hug',
                preferences: [
                    {
                        id: 'susPref4',
                        icon: require('../assets/images/foodRecycle.png'),
                        title: 'Food waste recycling',
                    },
                    {
                        id: 'susPref5',
                        icon: require('../assets/images/covidMeasures.png'),
                        title: 'Coronavirus measures',
                    },
                    {
                        id: 'susPref3',
                        icon: require('../assets/images/noPlastic.png'),
                        title: 'Plastic unfriendly',
                    },
                ]
            },
            {
                id: 'friend3',
                icon: require('../assets/images/samples/user3.png'),
                name: 'Mini Blossom',
                description: 'There’s nothing more romantic than Italian food.',
                preferences: [
                    {
                        id: 'susPref4',
                        icon: require('../assets/images/foodRecycle.png'),
                        title: 'Food waste recycling',
                    },
                    {
                        id: 'susPref5',
                        icon: require('../assets/images/covidMeasures.png'),
                        title: 'Coronavirus measures',
                    },
                    {
                        id: 'susPref2',
                        icon: require('../assets/images/veganFriendly.png'),
                        title: 'Vegan friendly',
                    },
                ]
            }
        ]
    }

    componentWillUnmount(){
        clearTimeout(this.fn)
    }

    render() {
        
        return (
            <>
                <StatusBar barStyle="dark-content"  />
                
                <View style={Styles.screenDiv} >
                    <TouchableOpacity onPress={this.gotoBack}
                    hitSlop={{bottom:10,top:10,right:10,left:10}}
                        style={{alignSelf:'flex-start',marginVertical:24}}>
                        <SvgCss  style={{width:screen.width*.048,height:screen.width*.035}}
                        xml={BackArrowGrey}/>
                    </TouchableOpacity>
                    <Text style={Styles.headText}>
                        personal <Text style={{fontWeight:'400'}}>details</Text>
                    </Text>
                    <Text style={Styles.labelText}>
                        Bio
                    </Text>
                    <View style={{
                        borderColor:'rgba(223,224,220,.41)',
                        borderWidth:1,
                        borderRadius:10,
                        padding:10,
                        borderStyle: 'solid',
                        width:screen.width*.88,
                        height:screen.height*.10345,
                        display:'flex',
                        flexWrap:'wrap'}}>
                        <TextInput
                        placeholder="Let's be Verdant and make a difference one meal at a time."
                        value={this.bio}
                        onChangeText={text => this.bio=text}
                        selectionColor='#D4D4D4'
                        multiline={true}
                        // onFocus={()=>this.textLineColour='#2E4E5B'}
                        placeholderTextColor='#A8AAA5'
                        style={{
                            width:screen.width*.8,
                            height:screen.height*.07,
                            backgroundColor:'#FFF',
                            padding:0,
                            color:'#2E4E5B',
                            flexWrap: 'wrap',
                        }}
                        />
                    </View>
                    <View style={{
                        marginTop: screen.height*.02399,
                        borderStyle: 'solid',
                        borderBottomColor:'rgba(223,224,220,.41)',
                        borderBottomWidth:1,
                        width:'100%',
                        flexDirection:'row',
                        paddingHorizontal:screen.width*.03,
                        paddingVertical: screen.height*.01
                    }}>
                        <Image  style={{width:screen.width*.044,height:screen.width*.044,marginRight:10}}
                        source={require('../assets/images/search_icon.png')}/>
                        <TextInput 
                        placeholderTextColor='#A8AAA5'
                        placeholder='Find friends on Verdantips'
                        inlineImageLeft='search_icon'
                        inlineImagePadding={10}
                        style={{fontSize:14}}
                        />
                    </View>
                    <ScrollView style={{marginVertical:screen.height*.01874,width: screen.width*.896}}>
                        {this.friendsList.map((friend,f)=>
                        <View key={friend.id} 
                            style={{
                                display:'flex',
                                flexDirection:'row',
                                marginVertical:screen.height*.01874,
                                width: screen.width*.896
                                }}>
                            <View style={{marginRight:screen.width*.0267}}>
                                <FastImage
                                    style={Styles.logoImg}
                                    source={friend.icon}
                                />
                            </View>
                            <View style={{width: screen.width*.4267,marginRight:screen.width*.05}}>
                                <Text style={{color:'#636661',fontSize:16,lineHeight:screen.height*.0375}}>
                                    {friend.name}
                                </Text>
                                <Text style={{color:'#858783',fontSize:12,lineHeight:screen.height*.027}}>
                                    {friend.description}
                                </Text>
                                <View style={{display:'flex',flexDirection:'row',marginTop: screen.height*.015}}>
                                    {friend.preferences.map(pref=>
                                    <FastImage key={pref.id}
                                        style={Styles.prefImg}
                                        source={pref.icon}
                                    />
                                    )}
                                </View>
                            </View>
                            <View style={{alignItems:'flex-start',justifyContent:'flex-start'}}>
                                <TouchableOpacity
                                    style={Styles.addBtn}
                                    onPress={()=>this.addFriend(friend.id)}
                                    >
                                    <Text style={{...Styles.addBtnText,fontWeight:'600'}}>
                                        ADD FRIEND
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        )}
                    </ScrollView>
                </View>
        
                    <TouchableOpacity
                        style={Styles.nextBtn}
                        onPress={this.goNext} disabled={this.bio.length>0?false:true}
                        >
                        <Text style={{...Styles.loginBtnText,fontWeight:'600'}}>
                            NEXT
                        </Text>
                    </TouchableOpacity>
            
                
                   
                    
                
            </>
            
        )
    }
}

