import * as React from 'react'
import {observer, inject} from "mobx-react"
import {RouterStore} from 'mobx-react-router';
// import LoginService from '../components/LoginService';
import {observable, toJS} from 'mobx';
import autobind from 'autobind-decorator'
import {View, Text, StatusBar, StyleSheet, Button, Alert, BackHandler, Image, Linking, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Platform} from 'react-native';
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
import GetLocation from 'react-native-get-location'
import {Avatar, Overlay} from 'react-native-elements';
import Popover from 'react-native-popover-view/dist/Popover';
import {PopoverPlacement} from 'react-native-popover-view';
import {IssuesNoData} from '../assets/images/issuesNoData.svg';
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';
import {SvgCss} from 'react-native-svg';
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
        // marginTop: 3
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
        paddingHorizontal: screen.width*.059,
        paddingTop: screen.height*.0767
    },
    restaurantsListView: {
        height: screen.height*.34606,
        width: Dimensions.get("window").width,
        paddingHorizontal: screen.width*.059,
    },
    restaurantView: {
        minHeight: screen.width*.352,
        flexDirection: 'row',
        marginVertical: screen.height*.01
    },
    resPic: {
        height: screen.width*.1386,
        width: screen.width*.1386,
        borderRadius: screen.height*.1386*.5,
        backgroundColor: '#E7E7E7',
        marginRight: screen.height*.0175
    },
    restaurantName: {
        color: '#636661',
        fontSize: screen.height*.02,
        lineHeight: screen.height*.03,
        fontFamily: 'Poppins-Medium'
    },
    restaurantLocation: {
        color: '#A8AAA5',
        fontSize: screen.height*.015,
        // marginVertical:screen.height*.01,
        lineHeight: screen.height*.02,
        fontFamily: 'Poppins-Light'
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
    issueText: {
        fontFamily: 'Poppins-Light',
        fontSize: screen.height*.015,
        lineHeight: screen.height*.02,
        color: '#858783',
        marginTop: screen.height*.025,
        flexWrap: 'wrap'
    },
    logoImg: {
        height: screen.width*.296,
        width: screen.width*.3146,
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
})

type IssuesListPageProps={
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
export default class IssuesListPage extends React.Component<IssuesListPageProps, {}> {

    @observable
    issuesList=[];

    @observable
    showIssueMenu=false

    @observable
    isRemoveIssue=false;

    @observable
    isEditIssue=false;

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

    handleSelectRestaurant(restaurantId) {
        this.props.routing.push(`/restaurant/${restaurantId}`)
    }

    async componentDidMount() {
        this.backHandler=BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.loading=true
        let issuesList=await this.props.restaurant.getIssuesForUserId(this.props.account.loggedInUser.id)
        let resIds=issuesList.map(issue => issue.restaurantId)
        let restaurantsList=await this.props.restaurant.getRestaurantsList(resIds)
        this.issuesList=issuesList.map(issue => Object.assign(issue, {
            restaurantObj: restaurantsList.find(res => res.id==issue.restaurantId)
        }))
        this.issuesList=[...this.issuesList].sort((a, b) => a.raisedOn-b.raisedOn)
        console.log(this.issuesList)
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
                    <View style={Styles.screenDiv}>
                        <View style={{paddingHorizontal: screen.width*.059, marginBottom: 15}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity onPress={this.gotoHome}
                                    // hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                                    style={{flexDirection: 'row', alignItems: 'center', }}>

                                    {/* <Image  
                            
                            source={require('../assets/images/backArrow_2x.png')}/> */}
                                    <SvgCss xml={BackArrowGrey}
                                        style={{width: screen.width*.048, height: screen.width*.03, }} />
                                </TouchableOpacity>
                                <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={Styles.headText}>
                                            raised <Text style={{fontWeight: '400', fontFamily: 'Poppins-Regular'}}>issues</Text>
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                        {this.issuesList.length>0?
                            <ScrollView style={Styles.restaurantsListView}
                                contentContainerStyle={{alignItems: 'flex-start'}}>
                                {toJS(this.issuesList)?.map((issue, i) =>
                                    <View key={`issue-${i}`} style={{marginBottom: screen.height*.03}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Avatar rounded icon={{name: 'user', type: 'font-awesome', color: '#CDCDCD'}} activeOpacity={1}
                                                containerStyle={Styles.resPic}
                                                size="large" source={{uri: issue.restaurantObj?.photo}}
                                            />
                                            <View>
                                                <Text style={Styles.restaurantName}>{issue.restaurantObj.name.split(',')[0]}</Text>
                                                <Text style={Styles.restaurantLocation}>{issue.restaurantObj.shortAddress}</Text>
                                            </View>
                                            <View style={{flexGrow: 1}}></View>
                                            {/* <Popover
                                    placement={PopoverPlacement.LEFT}
                                    onRequestClose={()=>this.showIssueMenu=false}
                                    isVisible={this.showIssueMenu}
                                    from={(
                                        <TouchableOpacity 
                                            // style={{alignSelf:'flex-end',marginVertical:screen.height*.01,marginRight:screen.width*.056}}
                                            onPress={()=>this.showIssueMenu=true}>
                                            <Image  
                                            style={{width:screen.width*.064,height:screen.width*.064}}
                                            source={require('../assets/images/expandIcon.png')}/>
                                        </TouchableOpacity>
                                    )}>
                                    <TouchableOpacity 
                                        style={Styles.expandPopover}
                                        onPress={()=>{
                                            this.showIssueMenu=false;
                                            this.isEditIssue=true
                                            }}>
                                        <Text style={Styles.prefBtnText}>
                                            Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={Styles.expandPopover}
                                        onPress={()=>{
                                            this.showIssueMenu=false;
                                            this.isRemoveIssue=true
                                            }}>
                                        <Text style={Styles.prefBtnText}>
                                            Remove</Text>
                                    </TouchableOpacity>
                                </Popover> */}
                                        </View>
                                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: screen.height*.0175}}>
                                            {sustainabilityPref.filter(pref => issue.topics.includes(pref.id)).map((pref, p) =>
                                                <View key={`issue${i}-pref${p}`}
                                                    style={{flexDirection: 'row', alignItems: 'center', marginBottom: screen.height*.01, marginRight: screen.width*.024}}>
                                                    <FastImage
                                                        style={{width: screen.width*.0674, height: screen.width*.0639, marginRight: screen.width*.024}}
                                                        source={pref.icon} />
                                                    <Text style={{color: '#636661', fontSize: screen.height*.015, lineHeight: screen.height*.02, fontFamily: 'Poppins-Light'}}
                                                    >{pref.title}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={Styles.issueText}>
                                            {issue.description}
                                        </Text>
                                    </View>

                                )}
                            </ScrollView>
                            :
                            <View style={{alignItems: 'center', justifyContent: 'center', height: screen.height*.6}}>
                                {/* <Image
                            style={Styles.logoImg}
                            source={require('../assets/images/issuesNoData.png')}
                        /> */}
                                <SvgCss xml={IssuesNoData} style={Styles.logoImg} />
                                <Text style={Styles.noDataHeadText}>
                                    Hurrah! No issues raised
                                </Text>
                            </View>
                        }
                    </View>


                }

            </>

        )
    }
}

