import * as React from "react";
import {observer, inject} from "mobx-react";
import {RouterStore} from "mobx-react-router";
import autobind from "autobind-decorator";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  BackHandler
} from "react-native";
import Storage from "react-native-storage";
import AccountService, {
  GOOGLE_PLACES_API_KEY,
} from "../service/AccountService"
import Geocoder from "react-native-geocoding";
import Swiper from "react-native-swiper";
import {Slide1} from "../assets/images/slide1.svg";
import {Slide2} from "../assets/images/slide2.svg";
import {Slide3} from "../assets/images/slide3.svg";
import {BackArrowGrey} from "../assets/images/backArrowGrey.svg";
import {SvgCss} from "react-native-svg";

const window=Dimensions.get("window");
const screen=
  Platform.OS=="ios"? Dimensions.get("screen"):Dimensions.get("window");

Geocoder.init(GOOGLE_PLACES_API_KEY);

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
  titleText: {
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Medium",
    color: "#858783",
    lineHeight: screen.height*0.03,
    letterSpacing: 0.5,
    marginTop: screen.height*0.0468,
    marginBottom: screen.height*0.02,
    width: screen.width*0.7893,
    textAlign: "center",
  },
  bodyText: {
    fontSize: screen.height*0.0175,
    fontFamily: "Poppins-Light",
    color: "#858783",
    lineHeight: screen.height*0.025,
    marginBottom: screen.height*0.02,
    flexWrap: "wrap",
    width: screen.width*0.6773,
    textAlign: "center",
  },
  screenDiv: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF", //'#F4F5F6'
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    // paddingHorizontal: screen.width*.059,
    paddingTop: screen.height*0.06,
  },
  wrapper: {
    backgroundColor: "#FFF",
    // paddingTop:screen.height*0.123,
    marginBottom: 0.065*screen.height,
  },
  slide1: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF",
    // paddingBottom:screen.height*0.02,
    // paddingHorizontal: screen.width*0.08,
    // height: screen.height*.665
  },
});

type UseAppPageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class UseAppPage extends React.Component<UseAppPageProps, {}> {
  @autobind
  async gotoBack() {
    this.props.routing.replace("/help");
  }

  backAction=() => {
    this.gotoBack()
    return true;
  };
  backHandler: any;

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
        <StatusBar barStyle="dark-content" />
        <View style={Styles.screenDiv}>
          <View style={{paddingHorizontal: screen.width*0.059, marginLeft: 15}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity

                hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                onPress={this.gotoBack}
                style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>

                <SvgCss
                  style={{width: screen.width*.048, height: screen.height*.03}}

                  xml={BackArrowGrey}
                />
              </TouchableOpacity>
              <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>

                <Text style={Styles.headText}>How to use the App?</Text>
              </View>
            </View>
          </View>
          <Swiper
            style={Styles.wrapper}
            loop={false}
            showsButtons={false}
            dotColor="#B1CC3E"
            activeDotColor="#447682"
            activeDotStyle={{
              height: screen.width*0.013,
              width: screen.width*0.037,
              borderRadius: screen.width*0.008,
            }}
            dotStyle={{
              height: screen.width*0.013,
              width: screen.width*0.013,
              borderRadius: screen.width*0.0065,
            }}
          >
            <View style={Styles.slide1}>
              <SvgCss
                xml={Slide1}
                style={{
                  width: screen.width*0.8993,
                  height: screen.width*0.9386,
                  marginTop: screen.height*0.05,
                }}
              />
              {/* <Image
                                style={{
                                    width: screen.width*.8993,
                                    height: screen.width*.9386,
                                    marginTop:screen.height*.05}} 
                                source={require('../assets/images/slide1.png')}
                            /> */}
              <Text style={Styles.titleText}>
                Register your sustainability preferences
              </Text>
              <Text style={Styles.bodyText}>
                Select the sustainability value that you feel more aligned to
                and you will find the restaurants matching accordingly.
              </Text>
            </View>
            <View style={Styles.slide1}>
              <SvgCss
                xml={Slide2}
                style={{
                  width: screen.width*0.8916,
                  height: screen.width*0.996,
                  marginTop: screen.height*0.05,
                }}
              />
              {/* <Image
                                style={{
                                    width: screen.width*.8916,
                                    height: screen.width*.996,
                                    marginTop:screen.height*.05}} 
                                source={require('../assets/images/slide2.png')} /> */}
              <Text style={Styles.titleText}>
                Read about a restaurant's sustainability measures
              </Text>
              <Text style={Styles.bodyText}>
                See what sustainability icons a restaurant has received and
                click further to know why.
              </Text>
            </View>
            <View style={Styles.slide1}>
              <SvgCss
                xml={Slide3}
                style={{
                  width: screen.width*0.8706,
                  height: screen.width*0.9786,
                  marginTop: screen.height*0.05,
                }}
              />
              {/* <Image
                                style={{
                                    width: screen.width*.8706,
                                    height: screen.width*.9786,
                                    marginTop:screen.height*.05}} 
                                source={require('../assets/images/slide3.png')}
                            /> */}
              <Text style={Styles.titleText}>
                Raise an issue if you don't see what the restaurant claims
              </Text>
              <Text style={Styles.bodyText}>
                Report anything to us that contradicts what the restaurant
                claims on their profile!
              </Text>
            </View>
          </Swiper>
        </View>
      </>
    );
  }
}
