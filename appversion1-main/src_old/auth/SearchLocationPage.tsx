import * as React from 'react'
import {observer, inject} from "mobx-react"
import {RouterStore} from 'mobx-react-router';
// import LoginService from '../components/LoginService';
import {observable, toJS} from 'mobx';
import autobind from 'autobind-decorator'
import {TextInput, View, Text, StatusBar, PermissionsAndroid, StyleSheet, BackHandler, Button, Alert, Image, Linking, Dimensions, TouchableOpacity, ScrollView, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {TextField} from 'react-native-materialui-textfield';
// import LinearGradient from 'react-native-linear-gradient';
import Storage from 'react-native-storage';
// import { TextInput } from 'react-native-paper';
import {firebase} from '@react-native-firebase/auth';
import AccountService, {GOOGLE_PLACES_API_KEY} from '../service/AccountService';
import DropShadow from 'react-native-drop-shadow';
// import {setBadgeCount, getNotificationBadgeSetting} from 'react-native-notification-badge'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location'
import {SvgCss} from 'react-native-svg';
import {MapLocation} from '../assets/images/mapLocation.svg'
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';

const window=Dimensions.get("window");
const screen=Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

Geocoder.init(GOOGLE_PLACES_API_KEY)

export const Styles=StyleSheet.create({
    headText: {
        fontSize: screen.height*.03,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
        color: '#858783',
        width: screen.width*.88,
        textAlign: 'left',

    },
    labelText: {
        fontSize: screen.height*.0175,
        fontWeight: '400',
        color: '#A8AAA5',

        marginBottom: screen.height*.009
    },
    logoImg: {
        height: screen.height*.069,
        width: screen.height*.069,
        // marginVertical: 20
    },
    prefImg: {
        height: screen.width*.10795,
        width: screen.width*.1138,
        marginHorizontal: screen.width*.02,
    },
    leafImg: {
        position: 'absolute',
        top: screen.height*.675,
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
        // paddingHorizontal: screen.width*.059,
        paddingTop: screen.height*.037
    },
    nextBtn: {
        padding: screen.height*.015,
        borderRadius: screen.height*.01,
        // marginHorizontal: 40, 
        marginVertical: screen.height*.05,
        width: screen.width*.8787,
        height: screen.height*.0735,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#447682',
        position: Platform.OS=='ios'? 'absolute':'relative',
        bottom: screen.height*.036,
    },
    addBtn: {
        // padding: 10,
        borderRadius: 8,
        borderColor: '#D1D3CD',
        borderStyle: 'solid',
        borderWidth: 1,
        // marginHorizontal: 40, 
        marginVertical: 5,
        width: screen.width*.25067,
        height: screen.height*.042,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF',

    },
    addBtnText: {
        color: '#424441',
        fontSize: screen.height*.0175,
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
        fontSize: screen.height*.02,
        fontFamily: 'Poppins-Medium',
    },
    addressTag: {
        color: '#A8AAA5',
        fontSize: screen.height*.0175,
        fontFamily: 'Poppins-Light',
        lineHeight: screen.height*.025,
        marginBottom: screen.height*.005
    },
    addressDesc: {
        color: '#636661',
        fontSize: screen.height*.0175,
        fontFamily: 'Poppins-Regular',
        lineHeight: screen.height*.025,
        marginBottom: screen.height*.005,
        flexWrap: 'wrap'
    },
    addressListView: {
        marginVertical: screen.height*.01874,
        // width: screen.width*.896,
        paddingHorizontal: screen.width*.059,
        width: screen.width,
        borderStyle: 'solid',
        borderColor: '#B7B7B7',
        borderBottomWidth: 0,
        borderTopWidth: .5,
    }
})

type SearchLocationPageProps={
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
    match?: any
}


@inject('routing')
@inject('storage')
@inject('account')
@observer
export default class SearchLocationPage extends React.Component<SearchLocationPageProps, {}> {


    @observable
    fn=null;

    @observable
    errorMessage=''

    @observable
    loading=false;

    @observable
    successMessage=''

    @observable
    isPasswordReset=false;

    @observable
    friendsList=[]

    @observable
    selectedLocation={
        lat: 0,
        lng: 0,
        description: '',
        tag: ''
    }

    @observable
    addressList=[]

    @observable
    locRef=React.createRef<GooglePlacesAutocompleteRef>();

    backAction=() => {
        this.gotoBack()
        return true;
    };
    backHandler: any;

    @autobind
    async gotoBack() {
        let {pageId}=this.props.match.params
        if (pageId=='HOME') {
            this.props.routing.replace('/home')
        } else {
            this.props.routing.replace('/profile1')
        }

    }

  

    @autobind
    gotoSignin() {
        this.props.routing.push('/login')
    }

    @autobind
    goNext() {
        console.log('next')
        this.props.account.userLocation=this.selectedLocation
        let {pageId}=this.props.match.params
        if (pageId=='HOME') {
            this.props.routing.replace('/locationSelect/HOME')
        } else {
            this.props.routing.replace('/locationSelect')
        }

    }

    selectSavedAddress(address) {
        this.selectedLocation=Object.assign({}, address)
        this.props.account.userLocation=Object.assign({}, address)
        this.props.routing.replace('/home')
    }

    addFriend(friendId) {
        console.log(friendId)
    }

    @autobind
    async selectCurrentLocation() {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)    

        let location=await GetLocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 15000,
        })
            .then(location => {
                console.log(location);
                return location
            })
        Geocoder.from(location.latitude, location.longitude)
            .then(json => {
                // var addressComponent = json.results[0].address_components[0];
                var addressComponent=json.results[0].formatted_address
                console.log(json.results[0], addressComponent);
                this.locRef.current?.setAddressText(addressComponent)
                this.selectedLocation={
                    lat: location.latitude,
                    lng: location.longitude,
                    description: addressComponent,
                    tag: ''
                }
            })
            .catch(error => console.log(error));

    }

    async componentDidMount() {
        this.backHandler=BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );

        this.loading=true;
        this.addressList=await this.props.account.getUserAddressList()
        this.loading=false
    }

    componentWillUnmount() {
        this.backHandler.remove();

        clearTimeout(this.fn)
    }

    render() {

        return (
            <>
                <StatusBar barStyle="dark-content" />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={Styles.screenDiv} >
                        <View style={{paddingHorizontal: screen.width*.059}}>
                            <TouchableOpacity onPress={this.gotoBack}
                                hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                                style={{alignSelf: 'flex-start', marginVertical: 24}}>
                                <SvgCss style={{width: screen.width*.048, height: screen.width*.035}}
                                    xml={BackArrowGrey} />
                            </TouchableOpacity>
                            <Text style={Styles.headText}>
                                search <Text style={{fontWeight: '400', fontFamily: 'Poppins-Regular', }}>location</Text>
                            </Text>

                            <View style={{
                                marginTop: screen.height*.021,
                                borderColor: 'rgba(223,224,220,.41)',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                paddingVertical: screen.height*.01,
                                borderStyle: 'solid',
                                width: screen.width*.88,
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                alignItems: 'center',
                                position: 'relative'
                            }}>
                                {/* <TextInput
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
                        /> */}
                                {/* <Image  style={{width:screen.width*.044,height:screen.width*.044,marginRight:10}}
                        source={require('../assets/images/search_icon.png')}/> */}
                                <GooglePlacesAutocomplete
                                    placeholder='Search for your location'
                                    // placeholderTextColor='#A8AAA5'
                                    onPress={(data, details=null) => {
                                        // 'details' is provided when fetchDetails = true
                                        console.log(data, details);
                                        this.selectedLocation=Object.assign({description: data.description, tag: ''}, details.geometry.location)
                                    }}
                                    query={{
                                        key: GOOGLE_PLACES_API_KEY,
                                        language: 'en',
                                    }}
                                    renderLeftButton={() => <Image style={{width: screen.width*.044, height: screen.width*.044, marginRight: 10}}
                                        source={require('../assets/images/search_icon.png')} />}
                                    ref={this.locRef}
                                    // currentLocation={true}
                                    fetchDetails={true}
                                    GooglePlacesDetailsQuery={{fields: 'geometry', }}
                                    // GoogleReverseGeocodingQuery={{language: 'en'}}
                                    enablePoweredByContainer={false}
                                    styles={{
                                        textInputContainer: {
                                            margin: 0,
                                            padding: 0,

                                        },
                                        textInput: {
                                            marginBottom: 0,
                                            paddingVertical: 0,
                                            paddingHorizontal: 0,
                                            height: screen.height*.03,
                                            fontSize: screen.height*.0175,
                                            fontFamily: 'Poppins-Light',
                                        }
                                    }}
                                />
                                {/* <TextInput 
                        placeholderTextColor='#A8AAA5'
                        placeholder='Search for your location'
                        inlineImageLeft='search_icon'
                        inlineImagePadding={10}
                        style={{fontSize:14}}
                        /> */}
                            </View>
                            <TouchableOpacity
                                onPress={this.selectCurrentLocation}
                                style={{
                                    marginTop: screen.height*.02399,
                                    width: '100%',
                                    flexDirection: 'row',
                                    paddingHorizontal: screen.width*.03,
                                    paddingVertical: screen.height*.01,
                                    alignItems: 'center'
                                }}>
                                {/* <Image  style={{width:screen.width*.056,height:screen.width*.056,marginRight:10}}
                        source={require('../assets/images/mapLocation.png')}/> */}
                                <SvgCss xml={MapLocation}
                                    style={{width: screen.width*.056, height: screen.width*.056, marginRight: 10}} />
                                <Text style={{fontSize: 14, color: '#447682', fontWeight: '500', fontFamily: 'Poppins-Medium', }}>
                                    Use current location
                                </Text>

                            </TouchableOpacity>
                        </View>
                        {/* <ScrollView style={{marginVertical:screen.height*.01874,width: screen.width*.896}}>
                        {this.friendsList.map((friend,f)=>
                        <View key={friend.id} 
                            style={{
                                display:'flex',
                                flexDirection:'row',
                                marginVertical:screen.height*.01874,
                                width: screen.width*.896
                                }}>
                            <View style={{marginRight:screen.width*.0267}}>
                                <Image
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
                                    <Image key={pref.id}
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
                    </ScrollView> */}
                        <ScrollView style={Styles.addressListView}>
                            {toJS(this.addressList).map((address, a) =>
                                <TouchableOpacity
                                    onPress={() => this.selectSavedAddress(address)}
                                    key={`address-${a}`}
                                    style={{marginVertical: screen.height*.02}}>
                                    <Text style={Styles.addressTag}>{address.tag}</Text>
                                    <Text style={Styles.addressDesc}>{address.description}</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                        {Platform.OS=='android'?
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
                                    alignSelf: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    style={Styles.nextBtn}
                                    onPress={this.goNext}
                                >
                                    <Text style={{...Styles.loginBtnText, fontWeight: '600'}}>
                                        NEXT
                                    </Text>
                                </TouchableOpacity>
                            </DropShadow>
                            :null}
                    </View>
                </TouchableWithoutFeedback>
                {Platform.OS=='ios'?
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
                            alignSelf: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={Styles.nextBtn}
                            onPress={this.goNext}
                        >
                            <Text style={{...Styles.loginBtnText, fontWeight: '600'}}>
                                NEXT
                            </Text>
                        </TouchableOpacity>
                    </DropShadow>
                    :null}



            </>

        )
    }
}

