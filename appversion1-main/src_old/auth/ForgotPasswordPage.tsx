import * as React from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { observable } from "mobx";
import { SvgCss } from "react-native-svg";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import { observer, inject } from "mobx-react";
import { TextInput } from "react-native-paper";
import { RouterStore } from "mobx-react-router";
import { Overlay } from "react-native-elements"; 
import AccountService from "../service/AccountService";
import { BackArrowGrey } from "../assets/images/backArrowGrey.svg";

const screen =
  Platform.OS == "ios" ? Dimensions.get("screen") : Dimensions.get("window");

export const Styles = StyleSheet.create({
  headText: {
    color: "#858783",
    textAlign: "left",
    fontWeight: "600",
    width: screen.width * 0.88,
    fontFamily: "Poppins-SemiBold",
    fontSize: screen.height * 0.03,
  },

  logoImg: {
    width: screen.height * 0.195,
    height: screen.height * 0.203,
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
    paddingTop: screen.height * 0.037,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    paddingHorizontal: screen.width * 0.059,
  },

  loginBtn: {
    height: 49,
    padding: 10,
    display: "flex",
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: "center",
    marginVertical: 22,
    alignItems: "center",
    shadowColor: "#44768270",
    justifyContent: "center",
    backgroundColor: "#447682",
    width: screen.width * 0.8787,
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.02,
  },
});

type ForgotPasswordPageProps = {
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class ForgotPasswordPage extends React.Component<
  ForgotPasswordPageProps,
  {}
> {
  @observable
  email = "";

  @observable
  fn = null;

  @observable
  errorMessage = "";

  @observable
  loading = false;

  @observable
  successMessage = "";

  @observable
  isPasswordReset = false;

  @autobind
  async gotoLogin() {
    let uid = await this.props.storage
      .load({
        key: "userID",
      })
      .then((ret) => {
        console.log(ret);
        return ret;
      })
      .catch((err) => {
        // any exception including data not found
        // goes to catch()
        console.warn(err.message);
        switch (err.name) {
          case "NotFoundError":
            return null;
            break;
          case "ExpiredError":
            return null;
            break;
        }
      });
    console.log("uid", uid);
    if (!uid) {
      let appKey = await this.props.storage
        .load({
          key: "appKey",
        })
        .then((ret) => {
          console.log(ret);
          return ret;
        })
        .catch((err) => {
          // any exception including data not found
          // goes to catch()
          console.warn(err.message);
          switch (err.name) {
            case "NotFoundError":
              return null;
              break;
            case "ExpiredError":
              return null;
              break;
          }
        });

      if (appKey) {
        this.props.routing.push("/login");
      } else {
        this.props.routing.push("/signup1");
      }
    } else {
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
    this.props.routing.push("/login");
  }

  @autobind
  async resetMail() {
    this.loading = true;
    let res = await this.props.account.sendPasswordResetMail(this.email);
    this.loading = false;
    if (res == "SUCCESS") {
      this.isPasswordReset = true;
      this.successMessage = "We have sent a password reset link to your email";
      this.props.routing.replace("/mail");
    } else {
      this.errorMessage = res.split("_").join(" ");
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearTimeout(this.fn);
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {this.loading ? (
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
        ) : null}
        <View style={Styles.screenDiv}>
          <TouchableOpacity
            hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
            onPress={this.gotoSignin}
            style={{ alignSelf: "flex-start", marginVertical: 24 }}
          >
            <SvgCss
              style={{
                width: screen.width * 0.048,
                height: screen.width * 0.035,
              }}
              xml={BackArrowGrey}
            />
          </TouchableOpacity>
          <Text style={Styles.headText}>
            forgot{" "}
            <Text style={{ fontWeight: "400", fontFamily: "Poppins-Regular" }}>
              password
            </Text>
          </Text>
          <Text
            style={{
              color: "#858783",
              fontSize: 14,
              marginTop: 10,
              width: screen.width * 0.808,
              fontFamily: "Poppins-Regular",
            }}
          >
            Please enter your registered email address, we will send you
            instructions to reset your password
          </Text>
          <TextInput
            label={this.email.length > 0 ? "Email ID" : null}
            value={this.email}
            onChangeText={(text) => (this.email = text)}
            selectionColor="#D4D4D4"
            underlineColor="#D4D4D4"
            placeholderTextColor="#A8AAA5"
            placeholder="Email ID"
            style={{
              width: screen.width * 0.8787,
              height: 60,
              backgroundColor: "#FFF",
              paddingHorizontal: 0,
              color: "#2E4E5B",
              borderBottomColor: "#2E4E5B",
              marginVertical: 10,
            }}
            theme={{
              colors: { primary: "#2E4E5B", text: "#2E4E5B" },
              fonts: {
                light: { fontFamily: "Poppins-Light" },
                medium: { fontFamily: "Poppins-Medium" },
                regular: { fontFamily: "Poppins-Regular" },
              },
            }}
          />

          <TouchableOpacity
            style={Styles.loginBtn}
            onPress={this.resetMail}
            disabled={this.email.length > 0 ? false : true}
          >
            <Text style={{ ...Styles.loginBtnText, fontWeight: "600" }}>
              SEND RESET INSTRUCTIONS
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
