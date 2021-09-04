import * as React from "react";
import {
  View,
  Text,
  StatusBar,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler
} from "react-native";
import AccountService, {
  GOOGLE_PLACES_API_KEY,
} from "../service/AccountService";
import { observable } from "mobx";
import autobind from "autobind-decorator";
import { SvgCss } from "react-native-svg";
import Storage from "react-native-storage";
import Geocoder from "react-native-geocoding";
import { observer, inject } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import { Overlay } from "react-native-elements";
import DropShadow from "react-native-drop-shadow";
import { MessageSuccess } from "../assets/images/messageSuccess.svg";
import { BackArrowGrey } from "../assets/images/backArrowGrey.svg";

const screen =
  Platform.OS == "ios" ? Dimensions.get("screen") : Dimensions.get("window");
Geocoder.init(GOOGLE_PLACES_API_KEY);

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

  labelText: {
    color: "#A8AAA5",
    fontWeight: "400",
    fontSize: screen.height * 0.0175,
    marginBottom: screen.height * 0.009,
  },

  logoImg: {
    width: screen.width * 0.2827,
    height: screen.width * 0.2827,
  },

  prefImg: {
    width: screen.width * 0.1138,
    height: screen.width * 0.10795,
    marginHorizontal: screen.width * 0.02,
  },

  leafImg: {
    position: "absolute",
    top: screen.height * 0.675,
    left: screen.width * 0.723,
    width: screen.height * 0.193,
    height: screen.height * 0.358,
  },

  screenDiv: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    paddingTop: screen.height * 0.06,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  yesBtn: {
    height: 49,
    padding: 10,
    display: "flex",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 22,
    alignSelf: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: "#447682",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    width: screen.width * 0.32,
  },

  yesBtnText: {
    color: "#447682",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.02,
  },

  sendBtn: {
    height: 49,
    padding: 10,
    display: "flex",
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#447682",
    width: screen.width * 0.88,
    marginVertical: screen.height * 0.07,
  },

  sendBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.02,
  },

  okayBtn: {
    height: 29,
    borderRadius: 8,
    display: "flex",
    marginVertical: 22,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#447682",
    width: screen.width * 0.3093,
    padding: screen.height * 0.005,
  },

  okayBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.015,
    lineHeight: screen.height * 0.0225,
  },

  itemText: {
    color: "#636661",
    letterSpacing: 0.5,
    fontFamily: "Poppins-Regular",
    fontSize: screen.height * 0.02,
    lineHeight: screen.height * 0.03,
  },

  overlayText: {
    color: "#858783",
    flexWrap: "wrap",
    textAlign: "center",
    fontFamily: "Poppins-Light",
    width: screen.width * 0.8106,
    marginTop: screen.height * 0.025,
    fontSize: screen.height * 0.0175,
    lineHeight: screen.height * 0.025,
  },

  submitView: {
    alignItems: "center",
    height: screen.height,
    justifyContent: "center",
    top: -screen.height * 0.1,
    backgroundColor: "#FFFFFF",
  },

  successImg: {
    width: screen.width * 0.3274,
    height: screen.width * 0.2853,
    marginBottom: screen.height * 0.015,
  },

  successText: {
    color: "#636661",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.0275,
    lineHeight: screen.height * 0.04,
    marginTop: screen.height * 0.0475,
  },

  successSubText: {
    color: "#636661",
    flexWrap: "wrap",
    textAlign: "center",
    width: screen.width * 0.88,
    fontFamily: "Poppins-Light",
    marginTop: screen.height * 0.015,
    fontSize: screen.height * 0.0225,
    lineHeight: screen.height * 0.035,
  },
});

type ContactUsPageProps = {
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class ContactUsPage extends React.Component<
  ContactUsPageProps,
  {}
> {
  @observable
  isMessageDialog = false;

  @observable
  message = "";

  @observable
  submitSuccess = false;

  @observable
  loading = false;

  @autobind
  async gotoBack() {
    this.props.routing.replace("/help");
  }

  @autobind
  async submitMessage() {
    this.loading = true;
    let res = await this.props.account.addUserMessage(this.message);
    this.loading = false;
    if (res == "SUCCESS") {
      this.submitSuccess = true;
      setTimeout(() => {
        this.submitSuccess = false;
        this.props.routing.push("/help");
      }, 2000);
    }
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
    return this.loading ? (
      <Overlay
        isVisible={this.loading}
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{ margin: 10 }}
        />
      </Overlay>
    ) : (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={Styles.screenDiv}>
        <View style={{paddingHorizontal: screen.width*0.059}}>
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

                <Text style={Styles.headText}>Contact Us</Text>
              </View>
            </View>
          </View>
       
           <TouchableOpacity
            style={{
              borderColor: "#DFE0DC",
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              borderStyle: "solid",
              width: screen.width * 0.88,
              height: screen.height * 0.234,
              display: "flex",
              flexWrap: "wrap",
              alignSelf: "center",
              marginTop: screen.height * 0.0468,
            }}
          >
            <TextInput
              autoFocus={true}
              placeholder="Write your message here…"
              value={this.message}
              onChangeText={(text) => (this.message = text)}
              selectionColor="#D4D4D4"
              multiline={true}
              placeholderTextColor="#A8AAA5"
              style={{
                width: screen.width * 0.8,
                maxHeight: screen.height * 0.10345,
                backgroundColor: "#FFFFFF",
                padding: 0,
                color: "#2E4E5B",
                borderColor: "#FFFFFF",
                fontFamily: "Poppins-Light",
              }}
            />
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
              style={Styles.sendBtn}
              disabled={this.message.trim().length <= 0}
              onPress={this.submitMessage}
            >
              <Text style={Styles.sendBtnText}>SEND</Text>
            </TouchableOpacity>
          </DropShadow>
        </View>
        <Overlay
          isVisible={this.isMessageDialog}
          overlayStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: screen.width * 0.8853, 
            borderRadius: screen.height * 0.04,
          }}
        >
          <Text style={Styles.overlayText}>
            Your message has been sent. Our team will reply to you on your
            registered email id
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
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              style={Styles.okayBtn}
              onPress={() => {
                this.isMessageDialog = false;
                this.props.routing.push("/help");
              }}
            >
              <Text style={Styles.okayBtnText}>OKAY</Text>
            </TouchableOpacity>
          </DropShadow>
        </Overlay>
        <Overlay isVisible={this.submitSuccess} fullScreen>
          <View style={Styles.submitView}>
            <SvgCss style={Styles.successImg} xml={MessageSuccess} />
            <Text style={Styles.successText}>Thanks!</Text>
            <Text style={Styles.successSubText}>
              Your message has been sent. Our team will reply to you on your
              registered email id.
            </Text>
          </View>
        </Overlay>
      </>
    );
  }
}
