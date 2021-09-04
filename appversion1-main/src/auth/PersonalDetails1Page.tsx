import * as React from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { observable } from "mobx";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import * as ReactNative from "react-native";
import { observer, inject } from "mobx-react";
import { TextInput } from "react-native-paper";
import FastImage from "react-native-fast-image";
import { RouterStore } from "mobx-react-router";
import DropShadow from "react-native-drop-shadow";
import AccountService from "../service/AccountService";
import { sustainabilityPref } from "../assets/appData";
const screen =
  Platform.OS == "ios" ? Dimensions.get("screen") : Dimensions.get("window");

export const Styles = StyleSheet.create({
  headText: {
    fontSize: screen.height * 0.03,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    color: "#858783",
    width: screen.width * 0.88,
    textAlign: "left",
    marginTop: screen.height * 0.05,
  },
  logoImg: {
    height: screen.width * 0.16421,
    width: screen.width * 0.17312,
    marginRight: screen.width * 0.0347,
  },
  leafImg: {
    position: "absolute",
    top: screen.height * 0.675,
    left: screen.width * 0.723,
    height: screen.height * 0.358,
    width: screen.height * 0.193,
  },
  screenDiv: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    backgroundColor: "#FFFFFF", //'#F4F5F6'
    height: '100%',
    width: Dimensions.get("window").width,
    paddingHorizontal: screen.width * 0.059,
    paddingTop: screen.height * 0.037,
  },
  nextBtn: {
    padding: screen.height * 0.015,
    paddingHorizontal: screen.width * 0.093,
    borderRadius: screen.height * 0.01,
    // marginHorizontal: 40,
    // marginVertical: screen.height * 0.05,
    width: screen.width * 0.8787,
    height: screen.height * 0.0735,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // backgroundColor: '#447682',
    position: "absolute" ,
    bottom: 10,
  },
  // loginBtnDisabled: {
  //     padding: 4,
  //     borderRadius: 50,
  //     marginHorizontal: 40,
  //     marginVertical:  screen.height*.02,
  //     width: screen.width*.84,
  //     height:0.059 * screen.height,
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     alignSelf: 'center',
  //     backgroundColor: '#447682',
  // },
  loginBtnText: {
    color: "#FFF",
    fontSize: screen.height * 0.02,
    fontFamily: "Poppins-Medium",
  },

  selectedText: {
    color: "#FFF",
    fontSize: screen.height * 0.0175,
    flexGrow: 1,
    fontFamily: "Poppins-Light",
  },
  labelText: {
    fontSize: screen.height * 0.0175,
    fontWeight: "400",
    color: "#A8AAA5",
    marginTop: screen.height * 0.021,
    marginBottom: screen.height * 0.009,
    fontFamily: "Poppins-Regular",
  },
});

type PersonalDetails1PageProps = {
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class PersonalDetails1Page extends React.Component<
  PersonalDetails1PageProps,
  {}
> {
  @observable
  name = "";

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

  @observable
  sustainabilityPref = [];

  @observable
  selectedPreferences = [];

  @observable
  bio = "";

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
  async goNext() {
    console.log(this.name);
    await this.props.account.updateUserProfileDetails({
      name: this.name,
      about: this.bio,
      preferences: [...this.selectedPreferences.map((pref) => pref.id)],
    });
    this.props.routing.replace("/locationSearch");
    // this.props.routing.replace('/profile2')
  }

  handlepreferenceSelect(prefId) {
    let prefIndex = this.selectedPreferences.findIndex(
      (pref) => pref.id == prefId
    );
    if (prefIndex > -1) {
      this.selectedPreferences.splice(prefIndex, 1);
    } else {
      if (this.selectedPreferences.length <= 2) {
        this.selectedPreferences.push(
          Object.assign(
            {},
            this.sustainabilityPref.find((pref) => pref.id == prefId)
          )
        );
      }
    }
  }

  componentDidMount() {
    this.sustainabilityPref = sustainabilityPref;
    if (this.props.account.loggedInUser) {
      this.name = this.props.account.loggedInUser.name
        ? this.props.account.loggedInUser.name
        : "";
      this.bio = this.props.account.loggedInUser.about
        ? this.props.account.loggedInUser.about
        : "";
      this.selectedPreferences = this.props.account.loggedInUser.preferences
        ? [
            ...this.sustainabilityPref.filter((pref) =>
              this.props.account.loggedInUser.preferences.includes(pref.id)
            ),
          ]
        : [];
    }
  }

  componentWillUnmount() {
    clearTimeout(this.fn);
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <ScrollView
          style={Styles.screenDiv}
          showsVerticalScrollIndicator={true}
          directionalLockEnabled={true}
          contentContainerStyle={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Text style={Styles.headText}>
            personal  <Text style={{ fontWeight: "400", fontFamily: "Poppins-Regular" }}>
              details
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
           Tell us about yourself!
          </Text>
          <TextInput
            // label="Name"
            label={this.name.length > 0 ? "Name" : null}
            placeholder="Name"
            value={this.name}
            onChangeText={(text) => (this.name = text)}
            selectionColor="#D4D4D4"
            underlineColor="#D4D4D4"
            mode="flat"
            // onFocus={()=>this.textLineColour='#2E4E5B'}
            placeholderTextColor="#A8AAA5"
            style={{
              width: screen.width * 0.8787,
              height: 60,
              backgroundColor: "#FFF",
              paddingHorizontal: 0,
              color: "#2E4E5B",
              borderBottomColor: "#707070",
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
          <Text style={Styles.labelText}>Bio</Text>
          <View
            style={{
              borderColor: "rgba(223,224,220,.41)",
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              borderStyle: "solid",
              width: screen.width * 0.88,
              height: screen.height * 0.10345,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <ReactNative.TextInput
              placeholder="Let's be Verdant and make a difference one meal at a time."
              value={this.bio}
              onChangeText={(text) => (this.bio = text)}
              selectionColor="#D4D4D4"
              multiline={true}
              placeholderTextColor="#A8AAA5"
              style={{
                width: screen.width * 0.8,
                height: screen.height * 0.09,
                backgroundColor: "#FFF",
                padding: 0,
                color: "#2E4E5B",
                borderColor: "#FFF",
                flexWrap: "wrap",
                fontFamily: "Poppins-Light",
              }}
            />
          </View>

          <Text
            style={{
              color: "#A8AAA5",
              fontFamily: "Poppins-Light",
              fontSize: 14,
              marginTop: screen.height * 0.042,
              width: screen.width * 0.808,
              lineHeight: screen.height * 0.0315,
            }}
          >
            Select your sustainability preferences
          </Text>
          <Text
            style={{
              color: "#A8AAA5",
              fontFamily: "Poppins-Light",
              fontSize: 14,
              width: screen.width * 0.808,
              lineHeight: screen.height * 0.027,
            }}
          >
            (Select max 3)
          </Text>

          {this.sustainabilityPref.map((pref, p) => (
            <TouchableOpacity
              key={pref.id}
              onPress={() => this.handlepreferenceSelect(pref.id)}
              style={{
                display: "flex",
                flexDirection: "row",
                marginVertical: screen.height * 0.01874,
                borderRadius: 10,
                padding: 10,
                backgroundColor:
                  this.selectedPreferences.findIndex((p) => pref.id == p.id) >
                  -1
                    ? "rgba(223,224,220,.41)"
                    : "#FFF",
              }}
            >
              <FastImage style={Styles.logoImg} source={pref.icon} />
              <View style={{ width: screen.width * 0.6293 }}>
                <Text
                  style={{
                    color: "#636661",
                    fontFamily: "Poppins-Medium",
                    fontSize: 16,
                    lineHeight: screen.height * 0.0375,
                  }}
                >
                  {pref.title}
                </Text>
                <Text
                  style={{
                    color: "#858783",
                    fontFamily: "Poppins-Light",
                    fontSize: 10,
                    lineHeight: screen.height * 0.027,
                  }}
                >
                  {pref.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: screen.height * 0.15 }} />
        </ScrollView>
        <TouchableOpacity
            style={{
              ...Styles.nextBtn,
              backgroundColor:
                this.name.length > 0 &&
                this.selectedPreferences.length >= 1 &&
                this.selectedPreferences.length <= 3
                  ? "#447682"
                  : "#858783",
            }}
            onPress={this.goNext}
            disabled={
              this.name.length > 0 &&
              this.selectedPreferences.length >= 1 &&
              this.selectedPreferences.length <= 3
                ? false
                : true
            }
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...Styles.selectedText, fontWeight: "400" }}>
                {`${this.selectedPreferences.length} selected`}
              </Text>
              <Text style={{ ...Styles.loginBtnText, fontWeight: "600" }}>
                NEXT
              </Text>
            </View>
          </TouchableOpacity>
      
        {/* <DropShadow
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
            style={{
              ...Styles.nextBtn,
              backgroundColor:
                this.name.length > 0 &&
                this.selectedPreferences.length >= 1 &&
                this.selectedPreferences.length <= 3
                  ? "#447682"
                  : "#858783",
            }}
            onPress={this.goNext}
            disabled={
              this.name.length > 0 &&
              this.selectedPreferences.length >= 1 &&
              this.selectedPreferences.length <= 3
                ? false
                : true
            }
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...Styles.selectedText, fontWeight: "400" }}>
                {`${this.selectedPreferences.length} selected`}
              </Text>
              <Text style={{ ...Styles.loginBtnText, fontWeight: "600" }}>
                NEXT
              </Text>
            </View>
          </TouchableOpacity>
        </DropShadow> */}
      </>
    );
  }
}
