import * as React from 'react'
import {observer, inject} from "mobx-react"
import {RouterStore} from 'mobx-react-router';
// import LoginService from '../components/LoginService';
import {observable, toJS} from 'mobx';
import autobind from 'autobind-decorator'
import {TextInput, View, Text, StatusBar, StyleSheet, Button,BackHandler, Alert, Image, Linking, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Platform} from 'react-native';
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
import Popover from 'react-native-popover-view/dist/Popover';
import {PopoverPlacement} from 'react-native-popover-view';
import {AddressNoData} from '../assets/images/addressNoData.svg';
import {ExpandIcon} from '../assets/images/expandIcon.svg'
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';
import {SvgCss} from 'react-native-svg';
import {Overlay} from 'react-native-elements';

const window=Dimensions.get("window");
const screen=Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

Geocoder.init(GOOGLE_PLACES_API_KEY)

export const Styles=StyleSheet.create({
    headText: {
        fontSize: screen.height*.03,
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
        color: '#858783',
        width: screen.width*.8,
        // textAlign:'center',
        textAlignVertical: 'center',
        marginLeft: 20,
        // marginTop: 3
    },
    labelText: {
        fontSize: screen.height*.0175,
        fontWeight: '400',
        color: '#A8AAA5',

        marginBottom: screen.height*.009
    },
    logoImg: {
        height: screen.width*.2827,
        width: screen.width*.2827,
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
        paddingTop: screen.height*.06
    },
    nextBtn: {
        padding: 10,
        borderRadius: 8,
        // marginHorizontal: 40, 
        marginVertical: 22,
        width: screen.width*.8787,
        height: screen.height*.0735,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#447682',
        position: 'absolute',
        bottom: screen.height*.036
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
        marginVertical: screen.height*.02,
        paddingVertical: screen.height*.02,
        // width: screen.width*.896,
        paddingHorizontal: screen.width*.059,
        width: screen.width,
        borderStyle: 'solid',
        borderColor: '#B7B7B7',
        borderBottomWidth: 0,
        borderTopWidth: 0.5,
    },
    addText: {
        fontFamily: 'Poppins-Regular',
        fontSize: screen.height*.02,
        lineHeight: screen.height*.03,
        letterSpacing: .5,
        color: '#636661'
    },
    expandPopover: {
        height: screen.height*.06,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: screen.height*.02
        // borderRadius:10,
        // borderWidth:1,
        // borderColor: '#707070',
        // borderStyle: 'solid'
    },
    prefBtnText: {
        color: '#858783',
        fontSize: screen.height*.0175,
        lineHeight: screen.height*.025,
        fontFamily: 'Poppins-Regular',
        textAlign: 'left'
    },
    searchBtn: {
        padding: screen.height*.015,
        borderRadius: screen.height*.01,
        // marginHorizontal: 40, 
        marginVertical: screen.height*.05,
        width: screen.width*.8787,
        height: screen.height*.06,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#447682',

    },
    searchBtnText: {
        color: '#FFF',
        fontSize: screen.height*.02,
        fontFamily: 'Poppins-Medium',
        lineHeight: screen.height*.03
    },
})

type SavedAddressesPageProps={
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
}


@inject('routing')
@inject('storage')
@inject('account')
@observer
export default class SavedAddressesPage extends React.Component<SavedAddressesPageProps, {}> {


    @observable
    fn=null;

    @observable
    errorMessage=''

    @observable
    loading=false;

    @observable
    successMessage=''

    @observable
    showAddressMenu={};

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
        this.props.routing.replace('/home/USER')
    }


    @autobind
    gotoSearchLocation() {
        this.props.routing.push('/locationSearch/HOME')
    }

    async handleRemoveAddress(addressId) {
        this.showAddressMenu[addressId]=false
        this.loading=true;
        await this.props.account.removeUserAddress(addressId);
        this.addressList=await this.props.account.getUserAddressList();
        this.addressList.forEach(ad => {
            this.showAddressMenu[ad.id]=false
        })
        this.loading=false;
    }

    @autobind
    async selectCurrentLocation() {
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
                var addressComponent=json.results[0].address_components[0];
                console.log(addressComponent);
                this.locRef.current?.setAddressText(addressComponent.long_name)
                this.selectedLocation={
                    lat: location.latitude,
                    lng: location.longitude,
                    description: addressComponent.long_name,
                    tag: ''
                }
            })
            .catch(error => console.log(error));

    }

    @autobind
    showPopover(addressId) {
        this.showAddressMenu[addressId]=true
    }

    async componentDidMount() {
        this.backHandler=BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.loading=true;
        this.addressList=await this.props.account.getUserAddressList()
        console.log(this.addressList)
        this.addressList.forEach(ad => {
            this.showAddressMenu[ad.id]=false
        })
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
                {this.loading?
                    <Overlay isVisible={this.loading} overlayStyle={{backgroundColor: 'transparent'}}>
                        <ActivityIndicator size="large" color="#FFF" style={{margin: 10}} />
                    </Overlay>
                    :
                    <View style={Styles.screenDiv} >
                        {this.addressList.length>0?
                            <>
                                <View style={{paddingHorizontal: screen.width*.059}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={this.gotoBack}
                                            hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                                            style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>

                                            <SvgCss style={{width: screen.width*.048, height: screen.width*.03, }}
                                                xml={BackArrowGrey} />
                                        </TouchableOpacity>
                                        <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={Styles.headText}>
                                                my <Text style={{fontWeight: '400', fontFamily: 'Poppins-Regular', }}>address</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={this.gotoSearchLocation}
                                        style={{flexDirection: 'row', alignItems: 'center', marginTop: screen.height*.04}}>
                                        <Image style={{width: screen.width*.0373, height: screen.width*.0373, marginRight: screen.width*.015}}
                                            source={require('../assets/images/addIcon.png')} />
                                        <Text style={Styles.addText}>Add address</Text>

                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={Styles.addressListView}>
                                    {toJS(this.addressList).map((address, a) =>
                                        <View
                                            key={`address-${a}`}
                                            style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                            <View
                                                style={{marginBottom: screen.height*.03, width: screen.width*.808}}>
                                                <Text style={Styles.addressTag}>{address.tag}</Text>
                                                <Text style={Styles.addressDesc}>{address.description}</Text>
                                            </View>
                                            <View style={{flexGrow: 1}}></View>
                                            <Popover
                                                placement={PopoverPlacement.LEFT}
                                                onRequestClose={() => this.showAddressMenu[address.id]=false}
                                                isVisible={this.showAddressMenu[address.id]}
                                                from={(
                                                    <TouchableOpacity
                                                        // style={{alignSelf:'flex-end',marginVertical:screen.height*.01,marginRight:screen.width*.056}}
                                                        onPress={() => this.showPopover(address.id)}>
                                                        <SvgCss xml={ExpandIcon}
                                                            style={{width: screen.width*.064, height: screen.width*.064}} />
                                                    </TouchableOpacity>
                                                )}>
                                                <TouchableOpacity
                                                    style={Styles.expandPopover}
                                                    onPress={() => {
                                                        this.showAddressMenu=false;
                                                        this.gotoSearchLocation()
                                                    }}>
                                                    <Text style={Styles.prefBtnText}>
                                                        Edit</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={Styles.expandPopover}
                                                    onPress={() => {this.handleRemoveAddress(address.id)}}>
                                                    <Text style={Styles.prefBtnText}>
                                                        Remove</Text>
                                                </TouchableOpacity>
                                            </Popover>
                                        </View>
                                    )}
                                </ScrollView>
                            </>
                            :
                            <View style={{paddingHorizontal: screen.width*.059}}>
                                <TouchableOpacity onPress={this.gotoBack}
                                    hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                                    style={{
                                        width: screen.width*.048, height: screen.width*.035,
                                        marginVertical: screen.height*.01, marginRight: screen.width*.032
                                    }}>
                                    <SvgCss style={{width: screen.width*.048, height: screen.width*.035, marginRight: screen.width*.032}}
                                        xml={BackArrowGrey} />
                                </TouchableOpacity>
                                <View style={{alignItems: 'center', justifyContent: 'center', height: screen.height*.9, backgroundColor: '#FFFFFF'}}>
                                    {/* <Image
                        style={Styles.logoImg}
                        source={require('../assets/images/addressNoData.png')}
                    /> */}
                                    <SvgCss xml={AddressNoData} style={Styles.logoImg} />
                                    <Text style={{
                                        color: '#A8AAA5',
                                        fontSize: screen.height*.0225,
                                        lineHeight: screen.height*.035,
                                        marginTop: screen.height*.01,
                                        width: screen.width*.88,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                    }}>
                                        Add addresses so that we find your favorite restaurants around you.
                                    </Text>

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
                                            style={Styles.searchBtn}
                                            onPress={this.gotoSearchLocation}
                                        >
                                            <Text style={Styles.searchBtnText}>
                                                ADD ADDRESS
                                            </Text>
                                        </TouchableOpacity>
                                    </DropShadow>
                                </View>
                            </View>
                        }
                    </View>
                }

            </>

        )
    }
}

