import * as React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  Keyboard,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import {observable} from "mobx";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import {observer, inject} from "mobx-react";
import {TextInput} from "react-native-paper";
import {Overlay} from "react-native-elements";
import {RouterStore} from "mobx-react-router";
import AccountService from "../service/AccountService";
import Toast from "react-native-simple-toast";

const screen=
  Platform.OS=="ios"? Dimensions.get("screen"):Dimensions.get("window");

export const Styles=StyleSheet.create({
  headText: {
    fontWeight: "600",
    color: "#858783",
    textAlign: "left",
    width: screen.width*0.88,
    fontFamily: "Poppins-SemiBold",
    fontSize: screen.height*0.03,
  },

  logoImg: {
    width: screen.height*0.195,
    height: screen.height*0.203,
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: screen.height*0.037,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    paddingHorizontal: screen.width*0.059,
  },

  loginBtn: {
    height: 49,
    padding: 10,
    display: "flex",
    borderRadius: 8,
    marginVertical: 22,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#447682",
    width: screen.width*0.8787,
  },

  loginBtnText: {
    color: "#FFF",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height*0.02,
  },

  googleFbViewStyle: {
    paddingHorizontal: 28,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});

type SigninPageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class SigninPage extends React.Component<SigninPageProps, {}> {
  @observable
  email="";

  @observable
  password="";

  @observable
  fn=null;

  @observable
  errorMessage="";

  @observable
  loading=false;

  @autobind
  async signin() {
    if (this.password.length<8) {
      Toast.show("Invalid password: minimum 8 characters required", Toast.LONG);
    }
    {
      this.loading=true;
      let res=await this.props.account.signInWithEmail(
        this.email,
        this.password
      );
      this.loading=false;
      if (res=="SUCCESS") {
        this.errorMessage="";
        this.props.storage.save({
          key: "userID",
          data: this.props.account.user.uid,
          expires: null,
        });
        this.props.storage.save({
          key: "appPass",
          data: this.password,
          expires: null,
        });
        this.props.routing?.push("/home");
      } else {
        this.errorMessage=res.split("_").join(" ");
      }
    }
  }

  @autobind
  async fbLogin() {
    try {
      this.loading=true;
      let res=await this.props.account._fbSignIn();
      this.loading=false;
      if (res=="SUCCESS_NOT_EXISTS") {
        this.errorMessage="";
        this.props.storage.save({
          key: "userID",
          data: this.props.account.user.uid,
          expires: null,
        });
        this.props.routing?.push("/profile1");
      } else if (res=="SUCCESS_EXISTS") {
        this.errorMessage="";
        this.props.storage.save({
          key: "userID",
          data: this.props.account.user.uid,
          expires: null,
        });
        this.props.routing?.push("/home");
      } else {
        this.errorMessage=res.split("_").join(" ");
      }
    } catch (err) {
      this.errorMessage=err;
    }
  }

  @autobind
  async googleLogin() {
    this.loading=true;
    let res=await this.props.account._googleSignIn();
    this.loading=false;
    if (res=="SUCCESS_NOT_EXISTS") {
      this.errorMessage="";
      this.props.storage.save({
        key: "userID",
        data: this.props.account.user.uid,
        expires: null,
      });
      this.props.routing?.push("/profile1");
    } else if (res=="SUCCESS_EXISTS") {
      this.errorMessage="";
      this.props.storage.save({
        key: "userID",
        data: this.props.account.user.uid,
        expires: null,
      });
      this.props.routing?.push("/home");
    } else {
      if (this.errorMessage==="CANCEL") {
        this.errorMessage="";
      } else {
        this.errorMessage=res.split("_").join(" ");
      }
    }
  }

  @autobind
  gotoSignup() {
    this.props.routing.push("/register");
  }

  @autobind
  gotoHome(){
    this.props.routing.push("/home");
  }
  @autobind
  gotoForgot() {
    this.props.routing.push("/forgot");
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {this.loading? (
          <Overlay
            isVisible={this.loading}
            overlayStyle={{backgroundColor: "transparent"}}
          >
            <ActivityIndicator
              size="large"
              color="#FFF"
              style={{margin: 10}}
            />
          </Overlay>
        ):null}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView>
            <View style={Styles.screenDiv}>
              <Image
                style={Styles.logoImg}
                source={require("../assets/images/logo2x.png")}
              />
              <Text style={Styles.headText}>
                sign{" "}
                <Text
                  style={{fontWeight: "400", fontFamily: "Poppins-Regular"}}
                >
                  in
                </Text>
              </Text>

              <TextInput
                label={this.email.length>0? "Email ID":null}
                value={this.email}
                onChangeText={(text) => (this.email=text)}
                selectionColor="#D4D4D4"
                underlineColor="#D4D4D4"
                placeholderTextColor="#A8AAA5"
                placeholder="Email ID"
                style={{
                  width: screen.width*0.8787,
                  height: screen.height*0.075,
                  backgroundColor: "#FFF",
                  paddingHorizontal: 0,
                  paddingTop: 0,
                  color: "#2E4E5B",
                  borderBottomColor: "#2E4E5B",
                  marginVertical: 10,
                  fontFamily: "Poppins-Light",
                }}
                theme={{
                  colors: {primary: "#2E4E5B", text: "#2E4E5B"},
                  fonts: {
                    light: {fontFamily: "Poppins-Light"},
                    medium: {fontFamily: "Poppins-Medium"},
                    regular: {fontFamily: "Poppins-Regular"},
                  },
                }}
              />
              <TextInput
                label={this.password.length>0? "Password":null}
                textContentType="password"
                secureTextEntry={true}
                value={this.password}
                onChangeText={(text) => (this.password=text)}
                selectionColor="#D4D4D4"
                underlineColor="#D4D4D4"
                placeholder="Password"
                placeholderTextColor="#A8AAA5"
                style={{
                  width: screen.width*0.8787,
                  height: screen.height*0.075,
                  backgroundColor: "#FFF",
                  paddingHorizontal: 0,
                  paddingTop: 0,
                  color: "#2E4E5B",
                  borderBottomColor: "#2E4E5B",
                  marginVertical: 10,
                  fontFamily: "Poppins-Light",
                }}
                theme={{
                  colors: {primary: "#2E4E5B", text: "#2E4E5B"},
                  fonts: {
                    light: {fontFamily: "Poppins-Light"},
                    medium: {fontFamily: "Poppins-Medium"},
                    regular: {fontFamily: "Poppins-Regular"},
                  },
                }}
              />
              <TouchableOpacity
                onPress={this.gotoForgot}
                style={{width: screen.width*0.8787}}
              >
                <Text
                  style={{
                    color: "#A8AAA5",
                    fontSize: 16,
                    marginTop: 0,
                    alignSelf: "flex-end",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Forgot password
                </Text>
              </TouchableOpacity>
              {/* && this.password.length > 7 */}
              <TouchableOpacity
                style={{
                  ...Styles.loginBtn,
                  backgroundColor:
                    this.email.length>0? "#447682":"#858783",
                  shadowColor: "#44768270",
                  shadowOffset: {
                    width: -5,
                    height: -5,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 5,
                }}
                onPress={this.signin}
                disabled={this.email.length>0? false:true}
              >
                {/* && this.password.length > 7 */}
                <Text style={{...Styles.loginBtnText, fontWeight: "600"}}>
                  SIGN IN
                </Text>
              </TouchableOpacity>
              {this.errorMessage.trim().length>0? (
                <Text
                  style={{
                    color: "#F14336",
                    fontSize: 16,
                    textAlignVertical: "center",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {this.errorMessage}
                </Text>
              ):null}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: "center",
              }}>
                <Text
                  style={{
                    color: "#A8AAA5",
                    fontSize: 16,
                    textAlignVertical: "center",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {`Already have an account?  `}
                </Text>
                <TouchableOpacity onPress={this.gotoSignup}>
                  <Text
                    style={{
                      color: "#2E4E5B",
                      fontWeight: "600",
                      fontSize: 16,
                      // marginHorizontal: 8,
                      fontFamily: "Poppins-SemiBold",
                    }}
                  >
                    Sign up
                  </Text>
                </TouchableOpacity>

              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: "center",
              }}>
                <Text
                  style={{
                    color: "#A8AAA5",
                    fontSize: 16,
                    textAlignVertical: "center",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {`Login as a guest? `}
                </Text>
                <TouchableOpacity onPress={this.gotoHome}>
                  <Text
                    style={{
                      color: "#2E4E5B",
                      fontWeight: "600",
                      fontSize: 16,
                      marginHorizontal: 8,
                      fontFamily: "Poppins-SemiBold",
                    }}
                  >
                     Skip
                  </Text>
                </TouchableOpacity>

              </View>

              {/* <Text
                style={{
                  color: "#A8AAA5",
                  fontSize: 16,
                  marginTop: 30,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Or sign in with
              </Text> */}
              <View style={{flexDirection: "row", marginTop: 22}}>
                {/* <TouchableOpacity
                  onPress={this.fbLogin}
                  style={Styles.googleFbViewStyle}
                >
                  <Image
                    style={{
                      width: screen.width * 0.06976,
                      height: screen.width * 0.06976,
                    }}
                    source={require("../assets/images/facebook_2x.png")}
                  />
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  onPress={this.googleLogin}
                  style={Styles.googleFbViewStyle}
                >
                  <Image
                    style={{
                      width: screen.width * 0.06976,
                      height: screen.width * 0.06976,
                    }}
                    source={require("../assets/images/google_2x.png")}
                  />
                </TouchableOpacity> */}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </>
    );
  }
}
