import * as React from "react";
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
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  BackHandler
} from "react-native";
import * as geolib from "geolib";
import {observable, toJS} from "mobx";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import {observer, inject} from "mobx-react";
import {RouterStore} from "mobx-react-router";
import AccountService from "../service/AccountService";
import RestaurantService from "../service/RestaurantService";
import {Avatar, CheckBox, Overlay} from "react-native-elements";
import {dietList, saList, sustainabilityPref} from "../assets/appData";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import DropShadow from "react-native-drop-shadow";
import * as RNP from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
import {Location} from "../assets/images/locationIcon.svg";
import {TimeIcon} from "../assets/images/timeGrey.svg";
import {Dot} from "../assets/images/dot.svg";
import {Star} from "../assets/images/star.svg";
import IssueIcon from "../assets/images/issue_grey.svg";
import FavM from "../assets/images/fav_marked.svg";
import FavUM from "../assets/images/fav_unmarked.svg";
import DownArrow from "../assets/images/downArrow.svg";
import UpArrow from "../assets/images/upArrow.svg";
import {HomeIcon} from "../assets/images/homeIcon.svg";
import {HomeSearchIcon} from "../assets/images/homeSearchIcon.svg";
import {HomePrefIcon} from "../assets/images/homePrefIcon.svg";
import {HomeUserIcon} from "../assets/images/homeUserIcon.svg";
import {BackArrowWhite} from "../assets/images/arrow_white.svg";
import {BackArrowGrey} from "../assets/images/backArrowGrey.svg";
import {ImageLibraryOptions} from "react-native-image-picker";
import {IssueSuccess} from "../assets/images/issueSuccess.svg";
import {AddPicIcon} from "../assets/images/addPicIcon.svg";
import {DDIcon} from "../assets/images/ddIcon.svg";
import {Checked} from "../assets/images/checked.svg";
import {Unchecked} from "../assets/images/unchecked.svg";
import Swiper from "react-native-swiper";
import {SvgCss, SvgXml} from "react-native-svg";
import Collapsible from "react-native-collapsible";
import FastImage from "react-native-fast-image";

const screen=
  Platform.OS=="ios"? Dimensions.get("screen"):Dimensions.get("window");

const Styles=StyleSheet.create({
  noBtn: {
    // padding: 10,
    borderRadius: 8,
    // marginHorizontal: 40,
    marginVertical: 22,
    width: screen.width*0.32,
    height: 29,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#447682",
  },
  noBtnText: {
    color: "#FFF",
    fontSize: screen.height*0.015,
    fontFamily: "Poppins-Medium",
  },
  restaurantBackground: {
    backgroundColor: "#447682",
    height: screen.height*0.256,
    width: screen.width,
    position: "absolute",
  },
  imageBackground: {
    height: screen.height*0.256,
    width: screen.width,
    position: "absolute",
  },
  resHead: {
    marginTop: screen.height*0.042,
    marginLeft: screen.width*0.0587,
  },
  resName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: screen.height*0.032,
    lineHeight: screen.height*0.048,
    color: "#FFF",
  },
  restaurantLink: {
    fontFamily: "Poppins-LightItalic",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.02,
    color: "#DFE0DC",
    textDecorationLine: "underline",
    marginLeft: screen.width*0.112,
  },
  restaurantView: {
    backgroundColor: "#FFF",
    borderTopRightRadius: 80,
    position: "relative",
    top: screen.height*0.12,
    width: screen.width,
    minHeight: screen.height,
    paddingVertical: screen.height*0.014,
  },
  textType1: {
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.022,
    color: "#A8AAA5",
  },
  textType2: {
    fontFamily: "Poppins-Medium",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.022,
    color: "#636661",
  },
  dot: {
    width: screen.height*0.005,
    height: screen.height*0.005,
    marginHorizontal: screen.width*0.032,
  },
  star: {
    width: screen.height*0.01,
    height: screen.height*0.01,
    marginRight: screen.width*0.016,
  },
  locationIcon: {
    width: screen.width*0.04,
    height: screen.width*0.0467,
    marginHorizontal: screen.width*0.02,
  },
  overlayText: {
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.0375,
    color: "#858783",
    width: screen.width*0.7626,
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: screen.height*0.025,
  },
  timeIcon: {
    width: screen.width*0.04,
    height: screen.width*0.04,
    marginRight: screen.width*0.02,
  },
  arrow: {
    width: screen.width*0.01957,
    height: screen.width*0.03157,
    marginTop: screen.width*0.01,
    marginHorizontal: screen.width*0.04,
  },
  secHead: {
    textTransform: "uppercase",
    fontSize: screen.height*0.0175,
    fontFamily: "Poppins-Regular",
    lineHeight: screen.height*0.025,
    letterSpacing: 1,
    color: "#636661",
    marginTop: screen.height*0.025,
    marginBottom: screen.height*0.025,
  },
  learnMore: {
    color: "#A8AAA5",
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.0225,
    textDecorationLine: "underline",
    textAlign: "right",
  },
  saItemText: {
    color: "#B1CC3E",
    fontFamily: "Poppins-Regular",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.0225,
  },
  saItemView: {
    borderStyle: "solid",
    borderColor: "#D9EF59",
    borderWidth: 1,
    borderRadius: screen.height*0.03,
    marginRight: screen.width*0.027,
    marginBottom: screen.height*0.0075,
    paddingVertical: screen.height*0.01,
    paddingHorizontal: screen.height*0.015,
  },
  actionView: {
    borderStyle: "solid",
    borderColor: "#DFE0DC",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    height: screen.height*0.09,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  actionText: {
    fontFamily: "Poppins-Regular",
    fontSize: screen.height*0.015,
    color: "#A8AAA5",
    lineHeight: screen.height*0.0225,
    letterSpacing: 0.5,
    marginTop: screen.height*0.005,
  },
  spItemView: {
    alignItems: "center",
    marginRight: screen.width*0.069,
    justifyContent: "flex-start",
  },
  spItemText: {
    color: "#858783",
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.02,
    width: screen.width*0.2,
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: screen.height*0.017,
  },
  mapView: {
    width: screen.width*0.8773,
    height: screen.height*0.19,
    borderRadius: 10,
    marginBottom: screen.height*0.3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  photoTypeView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoTypeText: {
    fontFamily: "Poppins-Regular",
    color: "#858783",
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.025,
    letterSpacing: 0.5,
  },
  photo: {},
  photoSelected: {
    borderBottomColor: "#447682",
    borderBottomWidth: screen.height*0.004,
    borderStyle: "solid",
  },
  issueView: {
    backgroundColor: "#FFF",
    paddingHorizontal: screen.width*0.056,
    paddingVertical: screen.height*0.07,
    height: screen.height,
  },
  photosView: {
    backgroundColor: "#000",
    paddingHorizontal: screen.width*0.056,
    paddingVertical: screen.height*0.07,
    height: screen.height,
  },
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
  issueText: {
    fontFamily: "Poppins-Light",
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.025,
    color: "#A8AAA5",
    marginTop: screen.height*0.025,
  },
  resPic: {
    height: screen.width*0.1386,
    width: screen.width*0.1386,
    borderRadius: screen.height*0.1386*0.5,
    backgroundColor: "#E7E7E7",
    // marginRight:screen.height*.02
  },
  issueResName: {
    fontFamily: "Poppins-Medium",
    fontSize: screen.height*0.02,
    lineHeight: screen.height*0.03,
    color: "#636661",
    marginTop: screen.height*0.005,
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: screen.width*0.093,
    borderRadius: 8,
    // marginHorizontal: 40,
    marginVertical: screen.height*0.0425,
    width: screen.width*0.8787,
    height: screen.height*0.0735,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    // position:'absolute',
    // bottom: screen.height*.036
  },
  btnText: {
    color: "#FFF",
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Medium",
    lineHeight: screen.height*0.03,
    textTransform: "uppercase",
  },
  navNowBtn: {
    paddingVertical: 10,
    paddingHorizontal: screen.width*0.093,
    borderRadius: 8,
    marginVertical: 22,
    width: screen.width*0.8787,
    height: screen.height*0.0735,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#447682",
  },
  topicInput: {
    width: "100%",
    // height: screen.height*.03517,
    height: 60,

    borderBottomColor: "#D4D4D4",
    borderBottomWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    alignItems: "center",
    marginTop: screen.height*0.0325,
  },
  topicPlaceholder: {
    color: "#A8AAA5",
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Regular",
    lineHeight: screen.height*0.025,
    flexWrap: "wrap",
    width: screen.width*0.7787,
  },
  issueSubmitView: {
    backgroundColor: "#FFF",
    height: screen.height,
    alignItems: "center",
    justifyContent: "center",
    top: -screen.height*0.1,
  },
  successImg: {
    height: screen.width*0.32,
    width: screen.width*0.32968,
    marginBottom: screen.height*0.015,
  },
  successText: {
    color: "#636661",
    fontSize: screen.height*0.0275,
    fontFamily: "Poppins-Medium",
    lineHeight: screen.height*0.04,
  },
  successSubText: {
    color: "#A8AAA5",
    fontSize: screen.height*0.0225,
    fontFamily: "Poppins-Light",
    lineHeight: screen.height*0.035,
    width: screen.width*0.6587,
    flexWrap: "wrap",
    textAlign: "center",
  },
  homeFooter: {
    height: screen.height*0.09,
    width: screen.width,
    paddingHorizontal: screen.width*0.0773,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
  },
  homeIconBtn: {
    width: screen.width*0.2113,
    height: screen.height*0.09,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIcon: {
    height: screen.height*0.035,
    width: screen.height*0.04,
  },
  searchIcon: {
    height: screen.height*0.033,
    width: screen.height*0.033,
  },
  prefIcon: {
    height: screen.height*0.034,
    width: screen.height*0.03,
  },
  userIcon: {
    height: screen.height*0.032,
    width: screen.height*0.0275,
  },
  logoImg: {
    height: screen.width*0.16421,
    width: screen.width*0.17312,
  },
  picRemoveBtn: {
    backgroundColor: "red",
    height: screen.width*0.0466,
    width: screen.width*0.0466,
    borderRadius: screen.width*0.0233,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
  },
});

type RestaurantPageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
  restaurant?: RestaurantService;
  match?: any;
};

@inject("routing")
@inject("storage")
@inject("account")
@inject("restaurant")
@observer
export default class RestaurantPage extends React.Component<RestaurantPageProps> {
  @observable
  restaurantObj=null;

  @observable
  loading=false;

  @observable
  saItems=[];

  @observable
  susPrefItems=[];

  @observable
  selectedPhotoItem="MENU";

  @observable
  photosList=[];

  @observable
  showRaiseIssueDialog=false;

  @observable
  issueDesc="";

  @observable
  showIssueTopics=false;

  @observable
  selectedIssueTopics=[];

  @observable
  issuePhotos=[];

  @observable
  issueSubmitSuccess=false;

  @observable
  showRestaurantSusList=false;

  @observable
  showPhotosDialog=false;

  @observable
  isCollapsed=false;

  @observable
  LoginResgister=false

  backAction=() => {
    if (this.showRaiseIssueDialog===true) {
      this.showRaiseIssueDialog=false
    } else {
      this.gotoHome()
    }
    return true;
  };
  backHandler: any;
  @autobind
  async gotoLogin() {
    let uid=await this.props.storage
      .load({
        key: "userID",
      })
      .then((ret) => {
        console.log("gotoLogin", ret);
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
        this.props.routing.push("/register");
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
      this.props.routing.push("/login");
      // }
    }

    //this.props.routing.replace('/login')
  }

  @autobind
  handleSelectPhotoItem(photoItem) {
    this.selectedPhotoItem=photoItem;
    switch (photoItem) {
      case "MENU":
        this.photosList=this.restaurantObj?.photos?.menu
          ? [...this.restaurantObj?.photos?.menu]
          :[];
        break;
      case "FOOD":
        this.photosList=this.restaurantObj?.photos?.food
          ? [...this.restaurantObj?.photos?.food]
          :[];
        break;
      case "AMBIENCE":
        this.photosList=this.restaurantObj?.photos?.ambience
          ? [...this.restaurantObj?.photos?.ambience]
          :[];
        break;
      case "COVID":
        this.photosList=this.restaurantObj?.photos?.covid
          ? [...this.restaurantObj?.photos?.covid]
          :[];
        break;
      default:
        break;
    }
  }

  @autobind
  gotoHome() {

    this.props.routing.push("/home");

  }

  @autobind
  raiseIssue() {
    if (this.props.account.loggedInUser) {
      this.showRaiseIssueDialog=true;
    } else {
      this.LoginResgister=true
    }
  }

  async handleRestaurantFav(isFav: boolean) {
    // console.log(this.restaurantObj)
    if (this.props.account.loggedInUser) {
      let favList=this.props.account.loggedInUser.favRestaurants
        ? [...this.props.account.loggedInUser.favRestaurants]
        :[];
      try {
        if (isFav) {
          favList.push(this.restaurantObj.id);
          await this.props.account.updateUserProfileDetails({
            favRestaurants: [...new Set(favList)],
          });
        } else {
          let index=favList.indexOf(this.restaurantObj.id);
          favList.splice(index, 1);
          await this.props.account.updateUserProfileDetails({
            favRestaurants: [...new Set(favList)],
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.LoginResgister=true
    }
  }

  handleIssueTopicSelect(prefId) {
    console.log("handleIssueTopicSelect", this.selectedIssueTopics, prefId);
    let prefIndex=this.selectedIssueTopics.findIndex((c) => c.id==prefId);
    if (prefIndex>-1) {
      this.selectedIssueTopics.splice(prefIndex, 1);
    } else {
      this.selectedIssueTopics.push(
        Object.assign(
          {},
          sustainabilityPref.find((c) => c.id==prefId)
        )
      );
    }
  }

  @autobind
  handlePhotoUpload() {
    const options: ImageLibraryOptions={
      mediaType: "photo",
      quality: 1,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true,
      quality:0.5,
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images'
      // }
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
        return;
      } else if (response.errorCode=="camera_unavailable") {
        console.log("Camera not available on device");
        return;
      } else if (response.errorCode=="permission") {
        console.log("Permission not satisfied");
        return;
      } else if (response.errorCode=="others") {
        console.log(response.errorMessage);
        return;
      }
      const source={uri: response.uri, data: response.base64};
      console.log(source);
      let photo=`data:image/png;base64,${source.data}`;
      this.issuePhotos.push(photo);
      console.log(this.issuePhotos);
      // await this.props.account.updateUserProfileDetails(userObj);
    });
  }

  @autobind
  handleRemovePic(index) {
    let pics=[...this.issuePhotos];
    console.log(pics, index);
    pics.splice(index, 1);
    this.issuePhotos=pics;
    console.log(this.issuePhotos, index);
  }

  @autobind
  async handleSubmitIssue() {
    this.loading=true;
    let issueObj={
      userId: this.props.account.loggedInUser.id,
      raisedOn: Date.now(),
      restaurantId: this.restaurantObj.id,
      topics: [...this.selectedIssueTopics.map((t) => t.id)],
      description: this.issueDesc,
      photos: [...this.issuePhotos],
    };
    console.log("handleSubmitIssue", issueObj);
    let res=await this.props.restaurant.submitUserIssue(issueObj);
    this.loading=false;
    this.showRaiseIssueDialog=false;
    console.log("res",res)
    if (res=="SUCCESS") {
      this.issueSubmitSuccess=true;
      setTimeout(() => (this.issueSubmitSuccess=false), 2000);
    }
  }

  async componentDidMount() {
    this.backHandler=BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    let {restaurantId}=this.props.match.params;
    console.log(this.props.account.userLocation);
    this.loading=true;
    console.log("RestaurantPage-componentDidMount");
    let resObj=await this.props.restaurant.getRestaurantById(restaurantId);
    this.restaurantObj=Object.assign(resObj, {
      distance: geolib.getDistance(
        {
          latitude: this.props.account.userLocation.lat,
          longitude: this.props.account.userLocation.lng,
        },
        {
          latitude: resObj.location.latitude,
          longitude: resObj.location.longitude,
        }
      ),
    });

    this.saItems=saList
      .filter((item) => this.restaurantObj?.serviceList.includes(item.id))
      ?.map((item) => item.name);
    this.susPrefItems=sustainabilityPref.filter((item) =>
      this.restaurantObj?.susPref.includes(item.id)
    );
    this.handleSelectPhotoItem(this.selectedPhotoItem);
    // console.log(this.restaurantObj.cuisine,this.restaurantObj.cuisine.map(c=>c.replace('_',' ')).join(', ').toLowerCase())
    this.loading=false;
  }

  componentWillUnmount() {
    this.backHandler.remove();

  }
  @autobind
  handleNavigate() {
    if (Platform.OS=="android") {
      Linking.openURL(
        "http://maps.google.com/maps?daddr="+
        this.restaurantObj.location.latitude+
        ","+
        this.restaurantObj.location.longitude
      ).catch((err) => console.error("An error occurred", err));
    } else {
      Linking.openURL(
        "http://maps.google.com/maps?daddr="+
        this.restaurantObj.location.latitude+
        ","+
        this.restaurantObj.location.longitude
      );
    }
  }

  handleFooterMenu(menu) {
    this.props.routing.push(`/home/${menu}`);
  }

  renderRestaurantHead() {
    return (
      <>
        <View style={Styles.resHead}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity
              onPress={this.gotoHome}
              style={{
                height: screen.width*0.064,
                width: screen.width*0.064,
                marginRight: screen.width*0.048,
              }}
            >
              <SvgCss
                xml={BackArrowWhite}
                style={{
                  height: screen.width*0.064,
                  width: screen.width*0.064,
                  marginRight: screen.width*0.048,
                }}
              />
            </TouchableOpacity>
            <Text style={Styles.resName}>
              {`${this.restaurantObj.name.slice(0, 19)}${this.restaurantObj.name.length>18? "..":""
                }`}
            </Text>
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text
              style={Styles.restaurantLink}
              onPress={() =>
                Linking.openURL(`https://${this.restaurantObj.website}`)
              }
            >
              {this.restaurantObj.website}
            </Text>
          </View>
        </View>
      </>
    );
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
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
        ):this.restaurantObj? (
          <>
            <ScrollView showsVerticalScrollIndicator={true} horizontal={false}>
              <View style={{position: "relative", flexGrow: 1}}>
                {this.restaurantObj?.photo? (
                  <ImageBackground
                    style={Styles.imageBackground}
                    source={{uri: this.restaurantObj?.photo}}
                  >
                    <View
                      style={{
                        ...Styles.imageBackground,
                        backgroundColor: "#000",
                        opacity: 0.4,
                      }}
                    ></View>
                    {this.renderRestaurantHead()}
                  </ImageBackground>
                ):(
                  <View style={Styles.restaurantBackground}>
                    {this.restaurantObj? this.renderRestaurantHead():null}
                  </View>
                )}
                <View style={Styles.restaurantView}>
                  <View style={{paddingHorizontal: screen.width*0.0587}}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: screen.height*0.01,
                      }}
                    >
                      <SvgCss
                        xml={Dot}
                        style={{...Styles.dot, marginLeft: 0}}
                      />
                      <Text
                        style={{
                          ...Styles.textType1,
                          textTransform: "capitalize",
                        }}
                      >
                        {`${this.restaurantObj.cuisine
                          .map((c) => c.replace("_", " "))
                          .join(", ")
                          .toLowerCase()}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: screen.height*0.01,
                      }}
                    >
                      <SvgCss
                        xml={Dot}
                        style={{...Styles.dot, marginLeft: 0}}
                      />
                      <Text style={Styles.textType1}>
                        {`${dietList
                          .filter((d) =>
                            this.restaurantObj.dietary.includes(d.id)
                          )
                          .map((d) => d.name)
                          .join(", ")}`}
                      </Text>
                      <SvgCss xml={Location} style={Styles.locationIcon} />
                      <Text
                        style={{
                          ...Styles.textType1,
                          width: screen.width*0.513,
                          flexWrap: "wrap",
                        }}
                      >
                        {`${this.restaurantObj.shortAddress}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: screen.height*0.01,
                      }}
                    >
                      <Text style={Styles.textType2}>
                        {`${Math.round(this.restaurantObj.distance/100)/10
                          } kms   `}
                        <Text style={Styles.textType1}>
                          from your location{" "}
                        </Text>
                      </Text>
                      <SvgCss xml={Dot} style={Styles.dot} />
                      <Text style={Styles.textType2}>
                        {Math.round(this.restaurantObj.price)==1
                          ? `€`
                          :Math.round(this.restaurantObj.price)==2
                            ? `€€`
                            :Math.round(this.restaurantObj.price)==3
                              ? `€€€`
                              :Math.round(this.restaurantObj.price)==4
                                ? `€€€€`
                                :`€`}
                      </Text>
                      <SvgCss xml={Dot} style={Styles.dot} />
                      <SvgCss xml={Star} style={Styles.star} />
                      <Text style={Styles.textType2}>
                        {this.restaurantObj.rating}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginTop: screen.height*0.01,
                      }}
                    >
                      {/* <SvgCss xml={Location} style={Styles.locationIcon} />
                            <Text style={{...Styles.textType1,width: screen.width*.413,flexWrap: 'wrap'}}>
                                {`${this.restaurantObj.shortAddress}`}
                            </Text> */}
                      <SvgCss xml={TimeIcon} style={Styles.timeIcon} />
                      <View>
                        <Text style={Styles.textType1}>
                          {this.restaurantObj.openHours["Monday"]?.trim()
                            .length>0
                            ? `${this.restaurantObj.openHours["Monday"]}   Mon`
                            :"Closed   Mon"}
                        </Text>
                        <Collapsible collapsed={this.isCollapsed}>
                          <Text style={Styles.textType1}>
                            {this.restaurantObj.openHours["Tuesday"]?.trim()
                              .length>0
                              ? `${this.restaurantObj.openHours["Tuesday"]}   Tue`
                              :"Closed   Tue"}
                          </Text>
                          <Text style={Styles.textType1}>
                            {this.restaurantObj.openHours["Wednesday"]?.trim()
                              .length>0
                              ? `${this.restaurantObj.openHours["Wednesday"]}   Wed`
                              :"Closed   Wed"}
                          </Text>
                          <Text style={Styles.textType1}>
                            {this.restaurantObj.openHours["Thursday"]?.trim()
                              .length>0
                              ? `${this.restaurantObj.openHours["Thursday"]}   Thu`
                              :"Closed   Thu"}
                          </Text>
                          <Text style={Styles.textType1}>
                            {this.restaurantObj.openHours["Friday"]?.trim()
                              .length>0
                              ? `${this.restaurantObj.openHours["Friday"]}   Fri`
                              :"Closed   Fri"}
                          </Text>
                          <Text style={Styles.textType1}>
                            {this.restaurantObj.openHours["Saturday"]?.trim()
                              .length>0
                              ? `${this.restaurantObj.openHours["Saturday"]}   Sat`
                              :"Closed   Sat"}
                          </Text>
                          <Text style={Styles.textType1}>
                            {this.restaurantObj.openHours["Sunday"]?.trim()
                              .length>0
                              ? `${this.restaurantObj.openHours["Sunday"]}   Sun`
                              :"Closed   Sun"}
                          </Text>
                        </Collapsible>
                      </View>
                      <TouchableOpacity
                        onPress={() => (this.isCollapsed=!this.isCollapsed)}
                      >
                        {this.isCollapsed? (
                          <SvgCss xml={DownArrow} style={Styles.arrow} />
                        ):(
                          <SvgCss xml={UpArrow} style={Styles.arrow} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <Text style={Styles.secHead}>Services and Ambiance</Text>
                    <ScrollView
                      horizontal={true}
                      alwaysBounceVertical={false}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: screen.height*0.025,
                        maxHeight: screen.height*0.07,
                      }}
                    >
                      {this.saItems.map((item, sa) => (
                        <View key={`sa-${sa}`} style={Styles.saItemView}>
                          <Text style={Styles.saItemText}>{item}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={Styles.actionView}>
                    {this.props.account.loggedInUser?.favRestaurants?.includes(
                      this.restaurantObj?.id
                    )? (
                      <View style={{alignItems: "center"}}>
                        <TouchableOpacity
                          onPress={() => this.handleRestaurantFav(false)}
                          style={{
                            width: screen.width*0.0673,
                            height: screen.width*0.0597,
                          }}
                        >
                          <SvgCss
                            style={{
                              width: screen.width*0.0673,
                              height: screen.width*0.0597,
                            }}
                            xml={FavM}
                          />
                        </TouchableOpacity>
                        <Text style={Styles.actionText}>Favourite</Text>
                      </View>
                    ):(
                      <View style={{alignItems: "center"}}>
                        <TouchableOpacity
                          onPress={() => this.handleRestaurantFav(true)}
                          style={{
                            width: screen.width*0.0552,
                            height: screen.width*0.051,
                            alignItems: "center",
                          }}
                        >
                          <SvgCss
                            style={{
                              width: screen.width*0.0552,
                              height: screen.width*0.051,
                            }}
                            xml={FavUM}
                          />
                        </TouchableOpacity>
                        <Text style={Styles.actionText}>Favourite</Text>
                      </View>
                    )}
                    <View style={{alignItems: "center"}}>
                      <TouchableOpacity
                        onPress={this.raiseIssue}
                        style={{
                          width: screen.width*0.06216,
                          height: screen.width*0.06336,
                          alignItems: "center",
                        }}
                      >
                        <SvgCss
                          style={{
                            width: screen.width*0.06216,
                            height: screen.width*0.06336,
                          }}
                          xml={IssueIcon}
                        />
                      </TouchableOpacity>
                      <Text style={Styles.actionText}>Raise issue</Text>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: screen.width*0.0587}}>
                    <Text style={Styles.secHead}>SUSTAINABILITY MEASURES</Text>
                    <ScrollView
                      horizontal={true}
                      alwaysBounceVertical={false}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        flexDirection: "row",
                        marginBottom: screen.height*0.025,
                        maxHeight:
                          screen.height*0.06+screen.width*0.16421,
                      }}
                    >
                      {this.susPrefItems.map((item, sp) => (
                        <TouchableOpacity
                          key={`sp-${sp}`}
                          onPress={() => (this.showRestaurantSusList=true)}
                          style={Styles.spItemView}
                        >
                          <FastImage
                            style={{
                              height: screen.width*0.16421,
                              width: screen.width*0.17312,
                            }}
                            source={item.icon}
                          />
                          <Text style={Styles.spItemText}>{item.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <Text
                      style={Styles.learnMore}
                      onPress={() => (this.showRestaurantSusList=true)}
                    >
                      Learn more about measures
                    </Text>
                    <Text
                      style={{
                        ...Styles.secHead,
                        marginBottom: screen.height*0.01,
                      }}
                    >
                      Photos
                    </Text>
                    <View style={Styles.photoTypeView}>
                      <TouchableOpacity
                        style={
                          this.selectedPhotoItem=="MENU"
                            ? Styles.photoSelected
                            :Styles.photo
                        }
                        onPress={() => this.handleSelectPhotoItem("MENU")}
                      >
                        <Text style={Styles.photoTypeText}>Menu</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          this.selectedPhotoItem=="FOOD"
                            ? Styles.photoSelected
                            :Styles.photo
                        }
                        onPress={() => this.handleSelectPhotoItem("FOOD")}
                      >
                        <Text style={Styles.photoTypeText}>Food</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          this.selectedPhotoItem=="AMBIENCE"
                            ? Styles.photoSelected
                            :Styles.photo
                        }
                        onPress={() => this.handleSelectPhotoItem("AMBIENCE")}
                      >
                        <Text style={Styles.photoTypeText}>Ambience</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          this.selectedPhotoItem=="COVID"
                            ? Styles.photoSelected
                            :Styles.photo
                        }
                        onPress={() => this.handleSelectPhotoItem("COVID")}
                      >
                        <Text style={Styles.photoTypeText}>COVID measures</Text>
                      </TouchableOpacity>
                    </View>
                    {this.photosList.length>0? (
                      <ScrollView
                        horizontal={true}
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{
                          height:
                            (screen.width*0.216+screen.height*0.015)*
                            2.1,
                          paddingTop: screen.height*0.025,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width:
                              screen.width*
                              0.2743*
                              Math.ceil(this.photosList.length/2),
                            height:
                              (screen.width*0.216+screen.height*0.015)*
                              2.2,
                          }}
                        >
                          {this.photosList.map((image, i) => (
                            <TouchableOpacity
                              key={`image-${i}`}
                              style={{
                                height: screen.width*0.216,
                                width: screen.width*0.2373,
                                marginRight: screen.width*0.037,
                                marginBottom: screen.height*0.015,
                                borderRadius: screen.height*0.005,
                              }}
                              onPress={() => (this.showPhotosDialog=true)}
                            >
                              <FastImage
                                style={{
                                  height: screen.width*0.216,
                                  width: screen.width*0.2373,
                                  marginRight: screen.width*0.037,
                                  marginBottom: screen.height*0.015,
                                  borderRadius: screen.height*0.005,
                                }}
                                source={{uri: image}}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    ):(
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          height:
                            (screen.width*0.216+screen.height*0.015)*
                            2.2,
                        }}
                      >
                        <Image
                          style={{
                            width: screen.width*0.21928,
                            height: screen.width*0.23336,
                          }}
                          source={require("../assets/images/photosNoData.png")}
                        />
                        <Text
                          style={{
                            ...Styles.photoTypeText,
                            marginTop: screen.height*0.027,
                          }}
                        >
                          There are no photos right now
                        </Text>
                      </View>
                    )}
                    <Text style={Styles.secHead}>Maps</Text>
                    <View style={Styles.mapView}>
                      <MapView
                        //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={Styles.map}
                        region={{
                          latitude: this.restaurantObj?.location.latitude,
                          longitude: this.restaurantObj?.location.longitude,
                          latitudeDelta: 0.015,
                          longitudeDelta: 0.0121,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: this.props.account?.userLocation.lat,
                            longitude: this.props.account?.userLocation.lng,
                          }}
                        >
                          <Image
                            source={require("../assets/images/userPin.png")}
                            style={{
                              width: screen.width*0.04,
                              height: screen.width*0.0506,
                            }}
                          />
                        </Marker>
                        <Marker
                          coordinate={toJS(this.restaurantObj)?.location}
                          title={toJS(this.restaurantObj)?.name}
                        >
                          <Image
                            source={require("../assets/images/verdanResPin.png")}
                            style={{
                              width: screen.width*0.0433,
                              height: screen.width*0.062347,
                            }}
                          />
                        </Marker>
                      </MapView>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <Overlay isVisible={this.showPhotosDialog} backdropStyle={{}}>
              <View style={Styles.photosView}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity
                    hitSlop={{bottom: 15, top: 15, right: 15, left: 15}}
                    onPress={() => (this.showPhotosDialog=false)}
                    style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>

                    <SvgCss
                      xml={BackArrowWhite}
                      style={{
                        width: screen.width*0.048,
                        height: screen.width*0.035,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>

                    <Text
                      style={{
                        ...Styles.headText,
                        color: "#FFF",
                        textTransform: "capitalize",
                      }}
                    >
                      {`${this.restaurantObj?.name} (${this.selectedPhotoItem})`}
                    </Text>
                  </View>
                </View>
                <Swiper
                  loop={false}
                  showsButtons={true}
                  showsPagination={false}
                  nextButton={
                    <Image
                      style={{
                        width: screen.width*0.0406,
                        height: screen.width*0.06315,
                      }}
                      source={require("../assets/images/nextWhite.png")}
                    />
                  }
                  prevButton={
                    <Image
                      style={{
                        width: screen.width*0.0406,
                        height: screen.width*0.06315,
                      }}
                      source={require("../assets/images/prevWhite.png")}
                    />
                  }
                  style={{alignItems: "center", justifyContent: "center"}}
                >
                  {this.photosList.map((photo, i) => (
                    <View
                      key={`photo-${i}`}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000",
                        width: screen.width,
                      }}
                    >
                      <FastImage
                        style={{
                          height: screen.height*0.4,
                          width: screen.width,
                          borderRadius: screen.height*0.005,
                        }}
                        source={{uri: photo}}
                      />
                    </View>
                  ))}
                </Swiper>
              </View>
            </Overlay>
            <Overlay isVisible={this.showRaiseIssueDialog} fullScreen>
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
                <View style={Styles.issueView}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.showRaiseIssueDialog=false;
                        this.issuePhotos=[];
                      }}
                      hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                      style={{width: screen.width*.048, height: 40, alignItems: 'center', justifyContent: 'center'}}>

                      <SvgCss
                        xml={BackArrowGrey}
                        style={{
                          width: screen.width*0.048,
                          height: screen.width*0.035,
                        }}
                      />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={Styles.headText}>
                        raise{" "}
                        <Text
                          style={{
                            fontWeight: "400",
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          issue
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <Text style={Styles.issueText}>
                    {`Verdantips counts on our users to verify the accuracy of the restaurants' icons. Please notify us below if any issue came up while dining at ${this.restaurantObj?.name}`}
                  </Text>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: screen.height*0.035,
                    }}
                  >
                    <Avatar
                      rounded
                      icon={{
                        name: "user",
                        type: "font-awesome",
                        color: "#CDCDCD",
                      }}
                      activeOpacity={1}
                      containerStyle={Styles.resPic}
                      size="large"
                      source={
                        this.restaurantObj?.photo
                          ? {uri: this.restaurantObj.photo}
                          :require("../assets/images/nonVerdantIcon.png")
                      }
                    />
                    <Text style={Styles.issueResName}>
                      {this.restaurantObj.name}
                    </Text>
                  </View>
                  <View style={Styles.topicInput}>
                    <Text style={Styles.topicPlaceholder}>
                      {this.selectedIssueTopics.length===0
                        ? "Select the topic to report an issue"
                        :this.selectedIssueTopics
                          .map((s) => s.title)
                          .join(", ")}
                    </Text>
                    <View style={{flexGrow: 1}}></View>
                    <TouchableOpacity
                      onPress={() => (this.showIssueTopics=true)}
                      style={{
                        width: screen.width*0.0693,
                        height: screen.width*0.0693,
                      }}
                    >
                      <SvgCss
                        style={{
                          width: screen.width*0.0693,
                          height: screen.width*0.0693,
                        }}
                        xml={DDIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <RNP.TextInput
                    // label={this.email.length>0?"Please tell us what happened":null}
                    value={this.issueDesc}
                    onChangeText={(text) => (this.issueDesc=text)}
                    selectionColor="#D4D4D4"
                    underlineColor="#D4D4D4"
                    // onFocus={()=>this.textLineColour='#2E4E5B'}
                    placeholderTextColor="#A8AAA5"
                    placeholder="Please tell us what happened"
                    style={{
                      width: screen.width*0.8787,
                      height: 60,
                      backgroundColor: "#FFF",
                      paddingHorizontal: 0,
                      color: "#2E4E5B",
                      borderBottomColor: "#2E4E5B",
                      marginVertical: 10,
                    }}
                    // textContentType='emailAddress'
                    // keyboardType='email-address'
                    theme={{
                      colors: {primary: "#2E4E5B", text: "#2E4E5B"},
                      fonts: {
                        light: {fontFamily: "Poppins-Light"},
                        medium: {fontFamily: "Poppins-Medium"},
                        regular: {fontFamily: "Poppins-Regular"},
                      },
                    }}
                  />
                  <Text style={Styles.issueText}>Add photos (max 3)</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: screen.height*0.015,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: screen.width*0.1466,
                        height: screen.width*0.1466,
                      }}
                      onPress={this.handlePhotoUpload}
                      disabled={this.issuePhotos.length>=3}
                    >
                      <SvgCss
                        style={{
                          width: screen.width*0.1466,
                          height: screen.width*0.1466,
                          borderRadius: 5,
                        }}
                        xml={AddPicIcon}
                      />
                    </TouchableOpacity>
                    {this.issuePhotos?.map((pic, p) => (
                      <ImageBackground
                        key={`issuusPic-${p}`}
                        style={{
                          width: screen.width*0.1466,
                          height: screen.width*0.1466,
                          borderRadius: 5,
                          marginLeft: screen.width*0.0213,
                        }}
                        source={{uri: pic}}
                      >
                        <TouchableOpacity
                          onPress={() => this.handleRemovePic(p)}
                          style={Styles.picRemoveBtn}
                        >
                          <Text
                            style={{
                              color: "#FFF",
                              fontSize: screen.height*0.015,
                            }}
                          >
                            -
                          </Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    ))}
                  </View>
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
                      onPress={this.handleSubmitIssue}
                      style={{
                        ...Styles.submitBtn,
                        backgroundColor:
                          this.issueDesc.length<=0||
                            this.selectedIssueTopics.length<=0
                            ? "#858783"
                            :"#447682",
                      }}
                      disabled={
                        this.issueDesc.length<=0||
                        this.selectedIssueTopics.length<=0
                      }
                    >
                      <Text style={Styles.btnText}>submit issue</Text>
                    </TouchableOpacity>
                  </DropShadow>

                  <Overlay
                    isVisible={this.showIssueTopics}
                    onBackdropPress={() => (this.showIssueTopics=false)}
                    backdropStyle={{opacity: 0.4}}
                    overlayStyle={{
                      padding: 0,
                      position: "absolute",
                      top: screen.height*0.29,
                      borderRadius: 10,
                      height: screen.height*0.31,
                    }}
                  >
                    <View
                      style={{
                        height: screen.height*0.29,
                        width: screen.width*0.9,
                        marginVertical: screen.height*0.01,
                      }}
                    >
                      <ScrollView
                        style={
                          {
                            // paddingHorizontal: screen.width*.0587,
                            // height: screen.height*.29,
                          }
                        }
                      >
                        {this.susPrefItems.map((pref, p) => (
                          <View
                            style={{
                              flexDirection: "row",
                              // height: screen.height*.04,
                              marginVertical: screen.height*0.01,
                              paddingHorizontal: screen.width*0.04,
                              paddingVertical: screen.height*0.01,
                              backgroundColor:
                                this.selectedIssueTopics.findIndex(
                                  (c) => c.id==pref.id
                                )>-1
                                  ? "#F1F4F5"
                                  :"#FFF",
                              alignItems: "center",
                            }}
                            key={`pref-${pref.id}`}
                          >
                            <CheckBox
                              checkedColor="#447682"
                              uncheckedColor="#447682"
                              checkedIcon={<SvgCss xml={Checked} />}
                              uncheckedIcon={<SvgCss xml={Unchecked} />}
                              containerStyle={{
                                padding: 0,
                                justifyContent: "center",
                              }}
                              size={screen.height*0.02}
                              // checked={true}
                              checked={
                                this.selectedIssueTopics.findIndex(
                                  (c) => c.id==pref.id
                                )>-1
                              }
                              onPress={() =>
                                this.handleIssueTopicSelect(pref.id)
                              }
                            />
                            <FastImage
                              style={{
                                width: screen.width*0.0674,
                                height: screen.width*0.0639,
                                marginHorizontal: screen.width*0.0426,
                              }}
                              source={pref.icon}
                            />
                            <Text
                              onPress={() =>
                                this.handleIssueTopicSelect(pref.id)
                              }
                              style={{
                                color: "#858783",
                                fontSize: screen.height*0.018,
                                lineHeight: screen.height*0.02,
                                fontFamily: "Poppins-Light",
                              }}
                            >
                              {pref.title}
                            </Text>
                          </View>
                        ))}
                        {/* <CheckboxList
                                theme='#447682'
                                checkboxProp={{ boxType: 'square' }}
                                listItems={cuisinesList}
                                onChange={({ ids, items }) => console.log('My CUISINE list :: ', ids)}
                                listItemStyle={{color:'#858783',fontSize: screen.height*.018,lineHeight: screen.height*.02}} /> */}
                      </ScrollView>
                    </View>
                  </Overlay>
                </View>
              </TouchableWithoutFeedback>
            </Overlay>
            <Overlay isVisible={this.issueSubmitSuccess} fullScreen>
              <View style={Styles.issueSubmitView}>
                <SvgCss style={Styles.successImg} xml={IssueSuccess} />
                <Text style={Styles.successText}>
                  Thanks for letting us know
                </Text>
                <Text style={Styles.successSubText}>
                  We will look into this and contact you via email with an
                  update
                </Text>
              </View>
            </Overlay>
            <Overlay isVisible={this.showRestaurantSusList} fullScreen>
              <View style={Styles.issueView}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <TouchableOpacity
                    onPress={() => (this.showRestaurantSusList=false)}
                    hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}
                    style={{
                      width: screen.width*0.048,
                      height: screen.width*0.035,
                      marginVertical: screen.height*0.01,
                    }}
                  >
                    <SvgCss
                      xml={BackArrowGrey}
                      style={{
                        width: screen.width*0.048,
                        height: screen.width*0.035,
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={Styles.headText}>
                    sustainability{" "}
                    <Text
                      style={{
                        fontWeight: "400",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      measures
                    </Text>
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  directionalLockEnabled={true}
                >
                  {this.susPrefItems.map((pref, p) => (
                    <View
                      key={pref.id}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginVertical: screen.height*0.01874,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: "#FFF",
                      }}
                    >
                      <FastImage
                        style={{
                          ...Styles.logoImg,
                          marginRight: screen.width*0.0347,
                        }}
                        source={pref.icon}
                      />
                      <View style={{width: screen.width*0.6293}}>
                        <Text
                          style={{
                            color: "#636661",
                            fontSize: 16,
                            lineHeight: screen.height*0.0375,
                            fontFamily: "Poppins-Medium",
                          }}
                        >
                          {pref.title}
                        </Text>
                        <Text
                          style={{
                            color: "#858783",
                            fontSize: 10,
                            lineHeight: screen.height*0.027,
                            fontFamily: "Poppins-Light",
                          }}
                        >
                          {pref.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={{height: screen.height*0.12}}></View>
                </ScrollView>
              </View>
            </Overlay>

            <TouchableOpacity
              onPress={this.handleNavigate}
              style={{
                paddingVertical: 10,
                paddingHorizontal: screen.width*0.093,
                borderRadius: 8,
                marginVertical: 30,
                width: screen.width*0.8787,
                height: screen.height*0.0735,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: "#447682",
                shadowColor: "#44768270",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 1,
                shadowRadius: 10,
                elevation: 5,
                bottom: 35,
                position: "absolute",
              }}
            >
              <Text style={Styles.btnText}>Navigate now</Text>
            </TouchableOpacity>
          </>
        ):null}
        {/* </View> */}
        {/* :null} */}
        <View style={Styles.homeFooter}>
          <TouchableOpacity
            style={Styles.homeIconBtn}
            onPress={() => this.handleFooterMenu("HOME")}
          >
            <SvgCss xml={HomeIcon} style={Styles.homeIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.homeIconBtn}
            onPress={() => this.handleFooterMenu("SEARCH")}
          >
            <SvgCss xml={HomeSearchIcon} style={Styles.searchIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.homeIconBtn}
            onPress={() => this.handleFooterMenu("PREF")}
          >
            <SvgCss xml={HomePrefIcon} style={Styles.prefIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.homeIconBtn}
            onPress={() => this.handleFooterMenu("USER")}
          >
            <SvgCss xml={HomeUserIcon} style={Styles.homeIcon} />
          </TouchableOpacity>
        </View>
        <Overlay
          isVisible={this.LoginResgister}
          overlayStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: screen.width*0.84,
            // height: screen.width*.8533
            borderRadius: screen.height*0.04,
          }}
          onBackdropPress={() => {
            this.LoginResgister=false
          }}
        >
          <Text style={Styles.overlayText}>
            Please Login or Register to continue..
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: screen.width*0.6933,
            }}
          >
            <TouchableOpacity style={Styles.noBtn} onPress={() => {
              this.props.routing.push("/login");
            }}>
              <Text style={Styles.noBtnText}>Login</Text>
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
                onPress={() => {
                  this.props.routing.push("/register");
                }}
              >
                <Text style={Styles.noBtnText}>Register</Text>
              </TouchableOpacity>
            </DropShadow>
          </View>
        </Overlay>

      </>
    );
  }
}
