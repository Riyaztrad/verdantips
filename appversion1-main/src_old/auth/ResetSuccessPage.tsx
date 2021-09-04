import * as React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { observable } from "mobx";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import { observer, inject } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import DropShadow from "react-native-drop-shadow";
import AccountService from "../service/AccountService";
const screen =
  Platform.OS == "ios" ? Dimensions.get("screen") : Dimensions.get("window");

export const Styles = StyleSheet.create({
  headText: {
    color: "#858783",
    fontWeight: "600",
    textAlign: "center",
    width: screen.width * 0.88,
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.03,
  },

  logoImg: {
    height: screen.height * 0.154,
    width: screen.height * 0.1837,
    marginBottom: screen.height * 0.066,
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
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    paddingTop: screen.height * 0.0767,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    paddingHorizontal: screen.width * 0.059,
  },

  loginBtn: {
    height: 49,
    padding: 10,
    display: "flex",
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#447682",
    width: screen.width * 0.8787,

    shadowColor: "#44768270",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,

    marginVertical: screen.height * 0.027,
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height * 0.02,
    lineHeight: screen.height * 0.03,
  },
});

type ResetSuccessPageProps = {
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class ResetSuccessPage extends React.Component<
  ResetSuccessPageProps,
  {}
> {
  @observable
  fn = null;

  @observable
  errorMessage = "";

  @autobind
  gotoSignin() {
    this.props.routing.push("/login");
  }

  async componentDidMount() {}

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <View style={Styles.screenDiv}>
          <Image
            style={Styles.logoImg}
            source={require("../assets/images/resetSuccess.png")}
          />
          <Text style={Styles.headText}>Successful password reset</Text>
          <Text
            style={{
              color: "#A8AAA5",
              fontSize: 14,
              marginTop: 10,
              width: screen.width * 0.55,
              textAlign: "center",
              fontFamily: "Poppins-Light",
            }}
          >
            You can now use your new password to log in to your account
          </Text>

          <TouchableOpacity style={Styles.loginBtn} onPress={this.gotoSignin}>
            <Text style={{ ...Styles.loginBtnText, fontWeight: "600" }}>
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
