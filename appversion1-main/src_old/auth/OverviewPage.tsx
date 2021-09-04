import * as React from 'react'
import { observer, inject } from "mobx-react"
import { RouterStore } from 'mobx-react-router';
import autobind from 'autobind-decorator'
import {  View, Text, StatusBar, StyleSheet,Dimensions,BackHandler, TouchableOpacity,   Platform } from 'react-native';
import Storage from 'react-native-storage';
import AccountService, { GOOGLE_PLACES_API_KEY } from '../service/AccountService';
import Geocoder from 'react-native-geocoding';
import { SvgCss } from 'react-native-svg';
import {BackArrowGrey} from '../assets/images/backArrowGrey.svg';

const screen = Platform.OS=='ios'? Dimensions.get("screen"):Dimensions.get("window");

Geocoder.init(GOOGLE_PLACES_API_KEY)

export const Styles = StyleSheet.create({
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
    titleText: {
        fontSize: screen.height*.0275,
        fontFamily: 'Poppins-Regular',
        color: '#858783',
        lineHeight: screen.height*.04,
        marginTop: screen.height*0.5,
        marginBottom: screen.height*.06,
        textAlign:'center',
    },
    bodyText: {
        fontSize: screen.height*.0175,
        fontFamily: 'Poppins-Light',
        color: '#858783',
        lineHeight: screen.height*.025,
        marginBottom: screen.height*.02,
        flexWrap: 'wrap',
        width: screen.width*.88,
        textAlign:'center',
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
    
})

type OverviewPageProps = {
    storage?: Storage
    routing?: RouterStore
    account?: AccountService
}


@inject('routing')
@inject('storage')
@inject('account')
@observer
export default class OverviewPage extends React.Component<OverviewPageProps, {}> {


    backAction=() => {
        this.gotoBack()
        return true;
    };
    backHandler: any;

    @autobind
    async gotoBack() {
        this.props.routing.replace('/help')
    }

 async componentDidMount() {
    this.backHandler=BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
  );
  }

  componentWillUnmount() {
    this.backHandler.remove();

  }
    render() {
        
        return (
            <>
                <StatusBar barStyle="dark-content"  />
                <View style={Styles.screenDiv} >
                    <View style={{paddingHorizontal:screen.width*.059}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={this.gotoBack}
                                    hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                                    style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <SvgCss
                                        style={{width: screen.width*.048, height: screen.height*.03}}
                                        xml={BackArrowGrey} />
                                </TouchableOpacity>
                                <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={[Styles.headText]}>
                                Overview
                            </Text>
                            </View>
                        </View>
                        
                    </View>
                    <View style={{alignItems:'center',width:screen.width}}>
                        <Text style={Styles.titleText}>
                            What is Verdantips?
                        </Text>
                        <Text style={Styles.bodyText}>
                        We are the sustainable restaurant locator app{"\n"}{"\n"}

                        Restaurants receive our sustainability icons based on their answers to our questions - we do not audit or certify them ourselves. {"\n"}{"\n"}

                        Therefore we rely on users like YOU to tell us if something seems off!{"\n"}
                        </Text>
                    </View>
                </View>
                
            </>
            
        )
    }
}

