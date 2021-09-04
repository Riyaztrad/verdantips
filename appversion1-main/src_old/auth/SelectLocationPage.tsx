import * as React from "react";
import {
  View,
  Text,
  Platform,
  Keyboard,
  TextInput,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler
} from "react-native";
import {observable} from "mobx";
import {SvgCss} from "react-native-svg";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import {observer, inject} from "mobx-react";
import {RouterStore} from "mobx-react-router";
import AccountService from "../service/AccountService";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {Pin} from "../assets/images/pin.svg";
import {BackArrowGrey} from "../assets/images/backArrowGrey.svg";

const screen=
  Platform.OS=="ios"? Dimensions.get("screen"):Dimensions.get("window");

export const Styles=StyleSheet.create({
  headText: {
    color: "#858783",
    textAlign: "left",
    fontWeight: "600",
    width: screen.width*0.88,
    fontSize: screen.height*0.03,
    marginTop: screen.height*0.02,
    fontFamily: "Poppins-SemiBold",
    paddingHorizontal: screen.width*0.059,
  },

  labelText: {
    color: "#A8AAA5",
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.015,
    marginTop: screen.height*0.02,
    paddingHorizontal: screen.width*0.059,
  },

  tagView: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: screen.width*0.059,
  },

  tagBtn: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DFE0DC",
    marginTop: screen.height*0.01,
    marginRight: screen.height*0.01,
    borderRadius: screen.height*0.02,
    paddingVertical: screen.height*0.005,
    paddingHorizontal: screen.height*0.01,
  },

  tagBtnSelected: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DFE0DC",
    backgroundColor: "#858783",
    marginTop: screen.height*0.01,
    marginRight: screen.height*0.01,
    borderRadius: screen.height*0.02,
    paddingVertical: screen.height*0.005,
    paddingHorizontal: screen.height*0.01,
  },

  tagText: {
    color: "#858783",
    fontFamily: "Poppins-Regular",
    fontSize: screen.height*0.015,
  },

  tagTextSelected: {
    color: "#FFF",
    fontFamily: "Poppins-Regular",
    fontSize: screen.height*0.015,
  },

  clickText: {
    color: "#447682",
    fontFamily: "Poppins-Regular",
    fontSize: screen.height*0.015,
  },

  logoImg: {
    width: screen.height*0.195,
    height: screen.height*0.203,
  },

  leafImg: {
    position: "absolute",
    top: screen.height*0.675,
    left: screen.width*0.723,
    width: screen.height*0.193,
    height: screen.height*0.358,
  },

  screenDiv: {
    flex: 1,
    display: "flex",
    position: "relative",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    paddingTop: screen.height*0.037,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  nextBtn: {
    padding: 10,
    display: "flex",
    borderRadius: 8,
    alignSelf: "center",
    position: "absolute",
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    bottom: screen.height*0.03,
    width: screen.width*0.8787,
    height: screen.height*0.0735,
    backgroundColor: "#447682",
  },

  topSec: {
    position: "absolute",
    alignSelf: "flex-start",
    width: screen.width*0.05,
    height: screen.width*0.04,
    marginTop: screen.height*0.05,
    paddingTop: screen.height*0.037,
    marginBottom: screen.height*0.03,
    paddingHorizontal: screen.width*0.059,
  },

  mapView: {
    width: screen.width,
    height: screen.height*0.52,
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Medium",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

type SelectLocationPageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
  match?: any;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class SelectLocationPage extends React.Component<
SelectLocationPageProps,
{}
> {
  @observable
  address="";

  @observable
  errorMessage="";

  @observable
  loading=false;

  @observable
  successMessage="";

  @observable
  tag=null;

  @observable
  otherTag: string="";

  @observable
  keyboardHeight=0;

  @observable
  region={
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };


 
backHandler: any;
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
        switch (err.name) {
          case "NotFoundError":
            return null;
            break;
          case "ExpiredError":
            return null;
            break;
        }
      });
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
  handleChange() {
    let {pageId}=this.props.match.params;
    if (pageId=="HOME") {
      this.props.routing.replace("/locationSearch/HOME");
    } else {
      this.props.routing.replace("/locationSearch");
    }
  }

  @autobind
  onRegionChange(region) {
    this.region=region;
    console.log(this.region, region);
  }

  @autobind
  selectTag(tag: string) {
    this.tag=tag.toUpperCase();
  }

  @autobind
  async confirmLocationTag() {
    let tag;
    if (this.tag!="OTHER") {
      tag=this.tag;
    } else {
      tag=this.otherTag.toUpperCase();
    }
    let userLocation=Object.assign(this.props.account.userLocation, {
      tag: tag,
    });
    this.loading=true;
    let profileRes=await this.props.account.updateUserProfileDetails({
      location: userLocation,
    });
    let addressRes=await this.props.account.addUserAddressToList(
      userLocation
    );
    this.loading=false;
    this.props.routing.push("/home");
  }

  _keyboardDidShow=(e) => {
    this.keyboardHeight=e.endCoordinates.height;
  };

  @autobind
  _keyboardDidHide() {
    this.keyboardHeight=0;
  }

  componentDidMount() {
    this.address=this.props.account.userLocation.description;
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
  }

  componentWillUnmount() {
    Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <ScrollView>
          <View style={{flex: 1}}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={Styles.screenDiv}>
                <TouchableOpacity
                  onPress={this.gotoSignin}
                  hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                  style={Styles.topSec}
                >
                  <SvgCss
                    style={{
                      width: screen.width*0.048,
                      height: screen.width*0.035,
                    }}
                    xml={BackArrowGrey}
                  />
                </TouchableOpacity>
                <View style={Styles.mapView}>
                  <MapView
                    //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={Styles.map}
                    region={{
                      latitude: this.props.account.userLocation.lat,
                      longitude: this.props.account.userLocation.lng,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: this.props.account.userLocation.lat,
                        longitude: this.props.account.userLocation.lng,
                      }}
                    >
                      <SvgCss
                        xml={Pin}
                        style={{
                          height: screen.height*0.07019,
                          width: screen.height*0.0406,
                        }}
                      />
                    </Marker>
                  </MapView>
                </View>
                <Text style={Styles.headText}>
                  Select{" "}
                  <Text
                    style={{fontWeight: "400", fontFamily: "Poppins-Regular"}}
                  >
                    location
                  </Text>
                </Text>
                <Text style={Styles.labelText}>Your location</Text>
                <View
                  style={{
                    paddingHorizontal: 0,
                    borderStyle: "solid",
                    alignItems: "center",
                    borderBottomWidth: 2,
                    flexDirection: "row",
                    width: screen.width*0.8787,
                    height: 50,
                    backgroundColor: "#FFFFFF",
                    borderBottomColor: "#2E4E5B",
                    marginHorizontal: screen.width*0.059,
                  }}
                >
                  <TextInput
                    value={this.address}
                    onChangeText={text => this.address=text}
                    selectionColor="#D4D4D4"
                    placeholderTextColor="#A8AAA5"
                    style={{
                      width: screen.width*0.7507,
                      height: 50,
                      backgroundColor: "#FFF",
                      paddingHorizontal: 0,
                      color: "#2E4E5B",
                      borderBottomColor: "#2E4E5B",
                      fontFamily: "Poppins-Light",
                    }}
                  />
                  <TouchableOpacity onPress={this.handleChange}>
                    <Text
                      style={{
                        ...Styles.clickText,
                        textDecorationLine: "underline",
                      }}
                    >
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={Styles.labelText}>Label</Text>
                <View style={Styles.tagView}>
                  <TouchableOpacity
                    style={
                      this.tag=="HOME"? Styles.tagBtnSelected:Styles.tagBtn
                    }
                    onPress={() => this.selectTag("HOME")}
                  >
                    <Text
                      style={
                        this.tag=="HOME"
                          ? Styles.tagTextSelected
                          :Styles.tagText
                      }
                    >
                      HOME
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.tag=="WORK"? Styles.tagBtnSelected:Styles.tagBtn
                    }
                    onPress={() => this.selectTag("WORK")}
                  >
                    <Text
                      style={
                        this.tag=="WORK"
                          ? Styles.tagTextSelected
                          :Styles.tagText
                      }
                    >
                      WORK
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.tag=="GYM"? Styles.tagBtnSelected:Styles.tagBtn
                    }
                    onPress={() => this.selectTag("GYM")}
                  >
                    <Text
                      style={
                        this.tag=="GYM"
                          ? Styles.tagTextSelected
                          :Styles.tagText
                      }
                    >
                      GYM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.tag=="SCHOOL/UNIVERSITY"
                        ? Styles.tagBtnSelected
                        :Styles.tagBtn
                    }
                    onPress={() => this.selectTag("SCHOOL/UNIVERSITY")}
                  >
                    <Text
                      style={
                        this.tag=="SCHOOL/UNIVERSITY"
                          ? Styles.tagTextSelected
                          :Styles.tagText
                      }
                    >
                      SCHOOL/UNIVERSITY
                    </Text>
                  </TouchableOpacity>
                  {this.tag!="OTHER"? (
                    <TouchableOpacity
                      style={Styles.tagBtn}
                      onPress={() => this.selectTag("OTHER")}
                    >
                      <Text style={Styles.tagText}>OTHER</Text>
                    </TouchableOpacity>
                  ):null}
                </View>
                {this.tag=="OTHER"? (
                  <View
                    style={{
                      width: screen.width*0.8787,
                      height: screen.height*0.06,
                      backgroundColor: "#FFF",
                      paddingHorizontal: 0,
                      marginHorizontal: screen.width*0.059,
                      borderBottomColor: "#2E4E5B",
                      borderStyle: "solid",
                      borderBottomWidth: 2,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      value={this.otherTag}
                      onChangeText={(text) => (this.otherTag=text)}
                      selectionColor="#D4D4D4"
                      placeholderTextColor="#A8AAA5"
                      placeholder={
                        this.otherTag?.length<=0? "Enter label":""
                      }
                      style={{
                        width: screen.width*0.7507,
                        height: screen.height*0.05,
                        backgroundColor: "#FFF",
                        paddingHorizontal: 0,
                        // marginHorizontal: screen.width*.059,
                        color: "#2E4E5B",
                        borderBottomColor: "#2E4E5B",
                        fontFamily: "Poppins-Light",
                      }}
                    // theme={{ colors: { primary: '#2E4E5B',text: '#2E4E5B'}}}
                    />
                    {/* <TouchableOpacity onPress={this.confirmLocationTag}>
                      <Text style={Styles.clickText}>Confirm</Text>
                    </TouchableOpacity> */}
                  </View>
                ):null}
              </View>
            </TouchableWithoutFeedback>

          </View>
          <TouchableOpacity
            style={{
              padding: 10,
              display: "flex",
              borderRadius: 8,
              alignSelf: "center",
              position: "absolute",
              // marginVertical: 22,
              alignItems: "center",
              justifyContent: "center",
              bottom: 5,
              width: screen.width*0.8787,
              height: screen.height*0.0735,
              backgroundColor: "#447682",
              shadowColor: "#44768270",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 5,
            }}
            onPress={this.confirmLocationTag}
            disabled={this.address.length>=0? false:true}
          >
            <Text style={{...Styles.loginBtnText, fontWeight: "600"}}>
              CONFIRM LOCATION
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </>
    );
  }
}
