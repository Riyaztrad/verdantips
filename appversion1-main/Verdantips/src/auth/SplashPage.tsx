import * as React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import Storage from "react-native-storage";
import { observer, inject } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import AccountService from "../service/AccountService";
const screen =
  Platform.OS == "ios" ? Dimensions.get("screen") : Dimensions.get("window");

export const Styles = StyleSheet.create({
  splashText: {
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
    width: screen.width * 0.603,
    fontSize: screen.height * 0.025,
  },

  logoImg: {
    width: screen.width * 0.557,
    height: screen.width * 0.533,
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E4E5B",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

type SplashPageProps = {
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class SplashPage extends React.Component<SplashPageProps, {}> {
  render() {
    return ( 
      <View style={{backgroundColor:"#2E4E5B",height:Dimensions.get("window").height}}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <View style={Styles.screenDiv}>
          <Image
            style={Styles.logoImg}
            source={require("../assets/images/logo2x.png")}
          />
          <Text style={Styles.splashText}>
            Sustainable restaurants at your reach
          </Text>
          <Image
            style={Styles.leafImg}
            source={require("../assets/images/leaf_2x.png")}
          />
        </View> 
      </View>
    );
  }
}