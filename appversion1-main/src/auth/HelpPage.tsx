import * as React from "react";
import {
  View,
  Text,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from "react-native";
import AccountService, {
  GOOGLE_PLACES_API_KEY,
} from "../service/AccountService";
import {observable} from "mobx";
import {SvgCss} from "react-native-svg";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import Geocoder from "react-native-geocoding";
import {observer, inject} from "mobx-react";
import {Overlay} from "react-native-elements";
import {RouterStore} from "mobx-react-router";
import DropShadow from "react-native-drop-shadow";
import {BackArrowGrey} from "../assets/images/backArrowGrey.svg";
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
  labelText: {
    fontSize: screen.height*0.0175,
    fontWeight: "400",
    color: "#A8AAA5",

    marginBottom: screen.height*0.009,
  },
  logoImg: {
    height: screen.width*0.2827,
    width: screen.width*0.2827,
    // marginVertical: 20
  },
  prefImg: {
    height: screen.width*0.10795,
    width: screen.width*0.1138,
    marginHorizontal: screen.width*0.02,
  },
  leafImg: {
    position: "absolute",
    top: screen.height*0.675,
    left: screen.width*0.723,
    height: screen.height*0.358,
    width: screen.height*0.193,
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
  yesBtn: {
    padding: 10,
    borderRadius: 8,
    borderColor: "#447682",
    borderStyle: "solid",
    borderWidth: 1,
    // marginHorizontal: 40,
    marginVertical: 22,
    width: screen.width*0.32,
    height: 49,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
  },
  yesBtnText: {
    color: "#447682",
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Medium",
  },
  noBtn: {
    padding: 10,
    borderRadius: 8,
    // marginHorizontal: 40,
    marginVertical: 22,
    width: screen.width*0.32,
    height: 49,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#447682",
  },
  noBtnText: {
    color: "#FFF",
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Medium",
  },
  itemText: {
    fontFamily: "Poppins-Regular",
    fontSize: screen.height*0.02,
    lineHeight: screen.height*0.03,
    letterSpacing: 0.5,
    color: "#636661",
  },
  itemSection: {
    paddingHorizontal: screen.width*0.14,
    paddingTop: screen.height*0.0468,
  },
  overlayText: {
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.025,
    color: "#858783",
    width: screen.width*0.7173,
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: screen.height*0.025,
  },
});

type HelpPageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class HelpPage extends React.Component<HelpPageProps, {}> {
  @observable
  isDeleteDialog=false;

  backAction=() => {
    this.gotoBack()
    return true;
};
backHandler: any;
  @autobind
  async gotoBack() {
    this.props.routing.replace("/home/USER");
  }

  @autobind
  gotoOverview() {
    this.props.routing.push("/overview");
  }

  @autobind
  gotoUseApp() {
    this.props.routing.push("/use");
  }

  @autobind
  gotoContact() {
    this.props.routing.push("/contact");
  }

  @autobind
  async deleteAccount() {
    let res=await this.props.account.deleteUserAccount();
    if (res=="SUCCESS") {
      this.isDeleteDialog=false;
      try {
        await this.props.storage.clearMapForKey("userID");
        await this.props.storage.clearMapForKey("appKey");
        await this.props.storage.clearMapForKey("appPass");
        await this.props.storage.clearMap();
      } catch (err) {
        console.log("logout", err);
      } finally {
        this.props.routing.push("/register");
      }
    }
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
        <StatusBar barStyle="dark-content" />
        <View style={Styles.screenDiv}>
          <View style={{paddingHorizontal: screen.width*.059}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

              <TouchableOpacity
                onPress={this.gotoBack}
                hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>

                <SvgCss
                  style={{width: screen.width*.048, height: screen.height*.03}}

                  xml={BackArrowGrey}
                />
              </TouchableOpacity>
              <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>

                <Text style={Styles.headText}>Help</Text>
              </View>
            </View>
          </View>
          <View style={Styles.itemSection}>
            <TouchableOpacity
              onPress={this.gotoOverview}
              style={{marginBottom: screen.height*0.03}}
            >
              <Text style={Styles.itemText}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.gotoUseApp}
              style={{marginBottom: screen.height*0.03}}
            >
              <Text style={Styles.itemText}>How to use the App</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (this.isDeleteDialog=true)}
              style={{marginBottom: screen.height*0.03}}
            >
              <Text style={Styles.itemText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://verdantips.com/privacy-policy-for-verdantips-app/`
                )
              }
              style={{marginBottom: screen.height*0.03}}
            >
              <Text style={Styles.itemText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://verdantips.com/app-terms-and-conditions/`
                )
              }
              style={{marginBottom: screen.height*0.03}}
            >
              <Text style={Styles.itemText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.gotoContact}
              style={{marginBottom: screen.height*0.03}}
            >
              <Text style={Styles.itemText}>Contact us</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Overlay
          isVisible={this.isDeleteDialog}
          overlayStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: screen.width*0.84,
            // height: screen.width*.8533
            borderRadius: screen.height*0.04,
          }}
        >
          <Image
            style={{
              width: screen.height*0.125,
              height: screen.height*0.125,
              marginTop: screen.height*0.05,
            }}
            source={require("../assets/images/confirmDeleteImg.png")}
          />
          <Text style={Styles.overlayText}>
            Are you sure you want to Delete Account? This action cannot be
            undone
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: screen.width*0.6933,
            }}
          >
            <TouchableOpacity
              style={Styles.yesBtn}
              onPress={this.deleteAccount}
            >
              <Text style={Styles.yesBtnText}>YES</Text>
            </TouchableOpacity>
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
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                style={Styles.noBtn}
                onPress={() => (this.isDeleteDialog=false)}
              >
                <Text style={Styles.noBtnText}>NO</Text>
              </TouchableOpacity>
            </DropShadow>
          </View>
        </Overlay>
      </>
    );
  }
}
