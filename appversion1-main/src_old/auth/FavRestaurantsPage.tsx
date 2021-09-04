import * as React from 'react'
import {observer, inject} from "mobx-react"
import {RouterStore} from 'mobx-react-router';
// import LoginService from '../components/LoginService';
import {observable, toJS} from 'mobx';
import autobind from 'autobind-decorator'
import {View, Text, StatusBar, StyleSheet, Button, Alert, BackHandler,Image, Linking, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Platform} from 'react-native';
import {TextField} from 'react-native-materialui-textfield';
// import LinearGradient from 'react-native-linear-gradient';
import Storage from 'react-native-storage';
import {TextInput} from 'react-native-paper';
import {firebase} from '@react-native-firebase/auth';
import AccountService from '../service/AccountService';
import DropShadow from 'react-native-drop-shadow';
import RestaurantService from '../service/RestaurantService';
import {sustainabilityPref} from '../assets/appData';
import * as geolib from 'geolib';
import GetLocation from 'react-native-get-location';
import {Dot} from '../assets/images/dot.svg';
import {Star} from '../assets/images/star.svg';
import {FavNoData} from '../assets/images/favNoData.svg';
import FavM from '../assets/images/fav_marked.svg';
import {ResVerdantIcon} from '../assets/images/resVerdantIcon.svg';
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';
import {SvgCss} from 'react-native-svg';
import {Overlay} from 'react-native-elements';
// import {setBadgeCount, getNotificationBadgeSetting} from 'react-native-notification-badge'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'
import FastImage from 'react-native-fast-image'

const window=Dimensions.get("window");
const screen=Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

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
        marginTop: 3
    },
    screenDiv: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',//'#F4F5F6'
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        paddingTop: screen.height*.06
    },
    restaurantsListView: {
        height: screen.height*.34606,
        paddingHorizontal: screen.width*.059,
    },
    restaurantView: {
        minHeight: screen.width*.352,
        flexDirection: 'row',
        marginVertical: screen.height*.01
    },
    verdantRestaurantView: {
        minHeight: screen.width*.352,
        flexDirection: 'row',
        marginVertical: screen.height*.01,
        borderStyle: 'solid',
        borderColor: '#D9EF59',
        borderRadius: 10,
        borderWidth: 1,
        position: 'relative'
    },
    verdantStrip: {
        width: '100%',
        backgroundColor: '#D9EF59',
        position: 'absolute',
        bottom: 0,
        height: screen.height*.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    picSection: {
        width: screen.width*.2587,
        height: screen.height*.1108,
        marginRight: screen.width*.048,
        borderTopLeftRadius: 10,
        // borderBottomLeftRadius: 10,

    },
    nvPicSection: {
        width: screen.width*.2587,
        height: screen.height*.1108,
        marginRight: screen.width*.048
    },
    restautantInfo: {
        // minHeight: screen.width*.352,
        width: screen.width*.5387,
        flexDirection: 'column'
    },
    restaurantName: {
        color: '#636661',
        fontSize: screen.height*.02,
        lineHeight: screen.height*.03,
        fontFamily: 'Poppins-Medium'
    },
    restaurantLocation: {
        color: '#858783',
        fontSize: screen.height*.015,
        // marginVertical:screen.height*.01,
        lineHeight: screen.height*.02,
        fontFamily: 'Poppins-Light'
    },
    restaurantKeywords: {
        color: '#636661',
        fontSize: screen.height*.015,
        lineHeight: screen.height*.02,
        textTransform: 'capitalize',
        fontFamily: 'Poppins-Regular',
        marginTop: screen.height*.005
    },
    restaurantRating: {
        color: '#636661',
        fontSize: screen.height*.015,
        lineHeight: screen.height*.0225,
        fontFamily: 'Poppins-Medium'
    },
    restaurantDistance: {
        color: '#636661',
        fontSize: screen.height*.015,
        lineHeight: screen.height*.02,
        fontFamily: 'Poppins-Regular'
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: screen.height*.01,
        // marginBottom: screen.height*.01
    },
    dot: {
        width: screen.height*.005,
        height: screen.height*.005,
        marginHorizontal: screen.width*.032
    },
    star: {
        width: screen.height*.01,
        height: screen.height*.01,
        marginRight: screen.width*.016
    },
    restaurantLink: {
        color: '#447682',
        lineHeight: screen.height*.02,
        fontSize: screen.height*.015
    },
    logoImg: {
        height: screen.width*.31,
        width: screen.width*.3467,
        marginBottom: screen.height*.035
    },
    noDataHeadText: {
        fontSize: screen.height*.0275,
        fontFamily: 'Poppins-Medium',
        color: '#636661',
        width: screen.width*.88,
        textAlign: 'center',
        lineHeight: screen.height*.04
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

type FavRestaurantsPageProps={
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
    restaurant?: RestaurantService
}


@inject('routing')
@inject('storage')
@inject('account')
@inject('restaurant')
@observer
export default class FavRestaurantsPage extends React.Component<FavRestaurantsPageProps, {}> {

    @observable
    currentLocation={
        latitude: 41.3947688,
        longitude: 2.0787279
    };

    @observable
    filteredRestaurantList=[];

    @observable
    errorMessage=''

    @observable
    loading=true


    backAction=() => {
        this.gotoHome()
        return true;
    };
    backHandler: any;
    @autobind
    gotoHome() {
        this.props.routing.push('/home/USER')
    }

    @autobind
    gotoHomeSearch() {
        this.props.routing.push('/home/HOME')
    }

    handleSelectRestaurant(restaurantId) {
        this.props.routing.push(`/restaurant/${restaurantId}`)
    }

    async componentDidMount() {
        this.backHandler=BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.loading=true
        this.currentLocation=await GetLocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 15000,
        })
            .then(location => {
                console.log(location);
                return location
            })
            .catch(error => {
                console.log(error);
                return {
                    latitude: 41.3947688,
                    longitude: 2.0787279
                };
            });
        let resIds=this.props.account.loggedInUser?.favRestaurants? [...this.props.account.loggedInUser?.favRestaurants]:[]
        let favResList=resIds?.length>0? await this.props.restaurant.getRestaurantsList(resIds):[]
        this.filteredRestaurantList=favResList.map(res => Object.assign(res, {
            distance: geolib.getDistance(
                {
                    latitude: this.currentLocation.latitude,
                    longitude: this.currentLocation.longitude
                },
                {
                    latitude: res.location.latitude,
                    longitude: res.location.longitude
                }
            ),
            isVerdant: true
        }))
        this.loading=false
    }


    componentWillUnmount() {
        this.backHandler.remove();
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
                        <View style={{paddingHorizontal: screen.width*.059}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={this.gotoHome}
                                    hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                                    style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <SvgCss
                                        style={{width: screen.width*.048, height: screen.height*.03}}
                                        xml={BackArrowGrey} />
                                </TouchableOpacity>
                                <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={[Styles.headText]}>
                                        favourite <Text style={{fontWeight: '400', fontFamily: 'Poppins-Regular'}}>restaurants</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {this.filteredRestaurantList?.length>0?
                            <ScrollView style={Styles.restaurantsListView}>
                                {toJS(this.filteredRestaurantList)?.map((res, r) =>
                                    <TouchableOpacity
                                        onPress={() => this.handleSelectRestaurant(res.id)}
                                        style={res.isVerdant? Styles.verdantRestaurantView:Styles.restaurantView}
                                        key={`res-${r}`}>
                                        {res.isVerdant&&res.photo.length>0?
                                            <FastImage
                                                style={Styles.picSection}
                                                source={{uri: res.photo}} />
                                            :
                                            <FastImage
                                                style={Styles.nvPicSection}
                                                source={require('../assets/images/nonVerdantIcon.png')} />
                                        }
                                        <View style={Styles.restautantInfo}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View>
                                                    <Text style={Styles.restaurantName}>{`${res.name.split(',')[0].slice(0, 16)}${res.name.split(',')[0].length>15? '..':''}`}</Text>
                                                    <Text style={Styles.restaurantLocation}>{res.isVerdant? res.shortAddress:res.address}</Text>
                                                </View>
                                                <View style={{flexGrow: 1}}></View>
                                                <SvgCss
                                                    style={{width: screen.width*.0427, height: screen.width*.03955, marginRight: screen.width*.0266}}
                                                    xml={FavM} />
                                                {/* <Image 
                                    style={{width: screen.width*.0427,height: screen.width*.03955,marginRight:screen.width*.0266}}
                                    source={require('../assets/images/fav_marked.png')}/> */}
                                            </View>
                                            <Text style={Styles.restaurantKeywords}>{res.keywords.slice(0, 2).join(', ')}</Text>
                                            <View style={Styles.ratingSection}>
                                                <Text style={Styles.restaurantDistance}>{`${Math.round(res.distance/100)/10} km`}</Text>
                                                <SvgCss xml={Dot} style={Styles.dot} />
                                                <Text style={Styles.restaurantDistance}>
                                                    {Math.round(res.price)==1? `€`:
                                                        Math.round(res.price)==2? `€€`:
                                                            Math.round(res.price)==3? `€€€`:
                                                                Math.round(res.price)==4? `€€€€`:`€`}</Text>
                                                <SvgCss xml={Dot} style={Styles.dot} />
                                                <SvgCss xml={Star} style={Styles.star} />
                                                <Text style={Styles.restaurantRating}>{res.rating}</Text>
                                            </View>
                                            {res.isVerdant? null:
                                                <Text style={Styles.restaurantLink}
                                                    onPress={() => Linking.openURL(res.url)}>{`google.com/${res.name.toLowerCase().replace(' ', '').split(' ')[0]}`}</Text>
                                            }
                                            <View style={{flexGrow: 1}}></View>
                                            {/* <View style={Styles.notVerdantView}>
                                    <Text style={Styles.notVerdantText}>Not Verdant yet</Text>
                                </View> */}
                                        </View>

                                        {res.isVerdant?
                                            <View style={Styles.verdantStrip}>
                                                {/* <Image 
                                style={{width: screen.width*.1812,height: screen.width*.08616}}
                                source={require('../assets/images/resVerdantIcon.png')}/> */}
                                                <SvgCss xml={ResVerdantIcon}
                                                    style={{width: screen.width*.1812, height: screen.width*.08616}} />
                                                <View style={{flexGrow: 1}}></View>
                                                {/* <View style={{height: screen.height*.05,maxWidth: screen.width*.488}}> */}
                                                <ScrollView horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    showsVerticalScrollIndicator={false}
                                                    style={{height: screen.height*.05, width: screen.width*.388, flexDirection: 'row'}}
                                                    contentContainerStyle={{alignItems: 'center'}}>
                                                    {sustainabilityPref.filter(spf => res.susPref.indexOf(spf.id)>-1)
                                                        .map((srItem, sri) =>
                                                            <View key={`srItem-${sri}`}
                                                                style={{
                                                                    backgroundColor: '#FFF',
                                                                    height: screen.width*.08,
                                                                    width: screen.width*.08,
                                                                    borderRadius: screen.width*.04,
                                                                    marginRight: screen.width*.0693
                                                                }}>
                                                                <FastImage
                                                                    style={{width: screen.width*.0797, height: screen.width*.0756, borderRadius: screen.width*.0797*.5}}
                                                                    source={srItem.icon} />
                                                            </View>
                                                        )}
                                                </ScrollView>
                                                {/* </View> */}
                                                {sustainabilityPref.filter(spf => res.susPref.indexOf(spf.id)>-1).length>(.488/.1493)?
                                                    <FastImage
                                                        style={{
                                                            width: screen.width*.01632, height: screen.width*.0253,
                                                            marginHorizontal: screen.width*.0213
                                                        }}
                                                        source={require('../assets/images/scrollArrow.png')} />
                                                    :
                                                    <View style={{
                                                        width: screen.width*.01632, height: screen.width*.0253,
                                                        marginHorizontal: screen.width*.0213
                                                    }}></View>
                                                }
                                            </View>
                                            :null}
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                            :
                            <View style={{alignItems: 'center', justifyContent: 'center', height: screen.height*.8}}>
                                {/* <Image
                            style={Styles.logoImg}
                            source={require('../assets/images/favNoData.png')}
                        /> */}
                                <SvgCss xml={FavNoData} style={Styles.logoImg} />
                                <Text style={Styles.noDataHeadText}>
                                    Your fovourite list is empty
                                </Text>
                                <Text style={{
                                    color: '#A8AAA5',
                                    fontSize: screen.height*.0225,
                                    lineHeight: screen.height*.035,
                                    marginTop: screen.height*.01,
                                    width: screen.width*.95,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Light',
                                }}>
                                    Explore more and shortlist some items.
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
                                        onPress={this.gotoHomeSearch}
                                    >
                                        <Text style={Styles.searchBtnText}>
                                            SEARCH RESTAURANTS
                                        </Text>
                                    </TouchableOpacity>
                                </DropShadow>
                            </View>
                        }
                    </View>

                }


            </>

        )
    }
}

