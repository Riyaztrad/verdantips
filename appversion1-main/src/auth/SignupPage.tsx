import * as React from "react";
import {observable} from "mobx";
import {
  View,
  Text,
  Image,
  Linking,
  Platform,
  Keyboard,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import {SvgCss} from "react-native-svg";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import {observer, inject} from "mobx-react";
import {TextInput} from "react-native-paper";
import {RouterStore} from "mobx-react-router";
import Checked from "../assets/images/suChecked.svg";
import Unchecked from "../assets/images/suUnchecked.svg";
import AccountService from "../service/AccountService";
import {CheckBox, Overlay} from "react-native-elements";
import Toast from "react-native-simple-toast";

const screen=
  Platform.OS=="ios"? Dimensions.get("screen"):Dimensions.get("window");

export const Styles=StyleSheet.create({
  headText: {
    textAlign: "left",
    fontWeight: "600",
    color: "#858783",
    width: screen.width*0.88,
    fontSize: screen.height*0.03,
    fontFamily: "Poppins-SemiBold",
  },

  logoImg: {
    height: screen.height*0.203,
    width: screen.height*0.195,
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
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: screen.width*0.8787,
    marginVertical: screen.height*0.02,
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: screen.height*0.02,
  },

  googleFbViewStyle: {
    paddingHorizontal: 28,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});

type SignupPageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class SignupPage extends React.Component<SignupPageProps, {}> {
  @observable
  email="";

  @observable
  password="";

  @observable
  confirmPassword="";

  @observable
  errorMessage="";

  @observable
  loading=false;

  @observable
  tcAgreed=false;

  @autobind
  async gotoLogin() {
    let uid=await this.props.storage
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
      let appKey=await this.props.storage
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
  gotoHome(){
    this.props.routing.replace("/locationSearch/LOGIN")
  }
  @autobind
  async handleSignup() {
    if (this.password.length<8) {
      Toast.show("Invalid password: minimum 8 characters required", Toast.LONG);
    } else {
      this.loading=true;
      let res=await this.props.account.signUp(
        this.email,
        this.password,
        this.confirmPassword
      );
      this.loading=false;
      if (res=="SUCCESS") {
        this.errorMessage="";
        this.props.storage.save({
          key: "appKey",
          data: `${this.props.account.user.uid}-${Date.now()}`,
          expires: null,
        });
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
        this.props.routing.replace("/profile1");
      } else {
        this.errorMessage=res.split("_").join(" ");
      }
    }
  }

  @autobind
  async googleSignup() {
    this.loading=true;
    try {
      let res=await this.props.account._googleSignIn();
      this.loading=false;
      if (res=="SUCCESS_EXISTS"||res=="SUCCESS_NOT_EXISTS") {
        this.errorMessage="";
        this.props.storage.save({
          key: "appKey",
          data: `${this.props.account.user.uid}-${Date.now()}`,
          expires: null,
        });
        this.props.storage.save({
          key: "userID",
          data: this.props.account.user.uid,
          expires: null,
        });
        this.props.routing.replace("/profile1");
      } else {
        if (this.errorMessage==="CANCEL") {
          this.errorMessage="";
        } else {
          this.errorMessage=res.split("_").join(" ");
        }
      }
    } catch (err) {
      this.errorMessage=err.split("_").join(" ");
    }
  }

  @autobind
  async fbSignup() {
    this.loading=true;
    try {
      let res=await this.props.account._fbSignIn();
      this.loading=false;
      if (res=="SUCCESS_EXISTS"||res=="SUCCESS_NOT_EXISTS") {
        this.errorMessage="";
        this.props.storage.save({
          key: "appKey",
          data: `${this.props.account.user.uid}-${Date.now()}`,
          expires: null,
        });
        this.props.storage.save({
          key: "userID",
          data: this.props.account.user.uid,
          expires: null,
        });
        this.props.routing.replace("/profile1");
      } else {
        // this.errorMessage = res.split('_').join(' ')
      }
    } catch (err) {
      this.errorMessage=err.split("_").join(" ");
    }
  }

  @autobind
  gotoSignin() {
    this.props.routing.push("/login");
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
          <ScrollView style={{backgroundColor: "#fff"}}>
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
                  up
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
                // maxLength={8}
                value={this.password}
                onChangeText={(text) => (this.password=text)}
                selectionColor="#D4D4D4"
                underlineColor="#D4D4D4"
                placeholderTextColor="#A8AAA5"
                placeholder="Password"
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
                label={
                  this.confirmPassword.length>0? "Confirm password":null
                }
                // maxLength={8}
                textContentType="password"
                secureTextEntry={true}
                value={this.confirmPassword}
                onChangeText={(text) => (this.confirmPassword=text)}
                selectionColor="#D4D4D4"
                underlineColor="#D4D4D4"
                placeholderTextColor="#A8AAA5"
                placeholder="Confirm password"
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

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: screen.height*0.04,
                }}
              >
                <CheckBox
                  checkedIcon={<SvgCss xml={Checked} />}
                  uncheckedIcon={<SvgCss xml={Unchecked} />}
                  containerStyle={{padding: 0, justifyContent: "center"}}
                  size={screen.height*0.02}
                  checked={this.tcAgreed}
                  onPress={() => (this.tcAgreed=!this.tcAgreed)}
                />
                <Text
                  style={{
                    color: "#A8AAA5",
                    fontSize: screen.height*0.015,
                    lineHeight: screen.height*0.0225,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  I agree to accept the{" "}
                </Text>
                <Text
                  style={{
                    color: "#00344A",
                    fontSize: screen.height*0.015,
                    lineHeight: screen.height*0.0225,
                    fontFamily: "Poppins-Italic",
                  }}
                  onPress={() =>
                    Linking.openURL(
                      `https://verdantips.com/app-terms-and-conditions/`
                    )
                  }
                >
                  Terms and Conditions
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  ...Styles.loginBtn,
                  backgroundColor:
                    this.email.length>0&&
                      // this.password.length > 7 &&
                      // this.confirmPassword.length > 7 &&
                      this.tcAgreed
                      ? "#447682"
                      :"#858783",
                  shadowColor: "#44768270",
                  shadowOffset: {
                    width: -5,
                    height: -5,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 5,
                }}
                onPress={this.handleSignup}
                disabled={
                  this.email.length>0&&
                    // this.password.length > 7 &&
                    this.tcAgreed
                    ? false
                    :true
                }
              >
                <Text
                  style={{
                    ...Styles.loginBtnText,
                  }}
                >
                  SIGN UP
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
                    fontSize: screen.height*0.02,
                    lineHeight: screen.height*0.03,
                    fontFamily: "Poppins-Regular",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {`Already have an account?`}

                </Text>
                <TouchableOpacity onPress={this.gotoSignin}>
                  <Text
                    style={{
                      color: "#2E4E5B",
                      fontSize: screen.height*0.02,
                      lineHeight: screen.height*0.03,
                      // marginHorizontal: 8,
                      fontFamily: "Poppins-SemiBold",
                      textAlignVertical: "center",
                    }}
                  >
                    Sign in
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
            </View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#FFF",
                alignSelf: "center",
                marginBottom: 15,
              }}
            >
              {/* <TouchableOpacity
                onPress={this.fbSignup}
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
                onPress={this.googleSignup}
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </>
    );
  }
}
