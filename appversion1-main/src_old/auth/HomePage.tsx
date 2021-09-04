import * as React from "react";
import {
  View,
  Text,
  Share,
  Image,
  Linking,
  FlatList,
  Platform,
  Keyboard,
  TextInput,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  BackHandler,
  Alert
} from "react-native";
import * as geolib from "geolib";
import {observable, toJS} from "mobx";
import autobind from "autobind-decorator";
import Storage from "react-native-storage";
import {observer, inject} from "mobx-react";
import {RouterStore} from "mobx-react-router";
import AccountService, {
  GOOGLE_PLACES_API_KEY,
  Location,
} from "../service/AccountService";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {SvgCss} from "react-native-svg";
import * as RNP from "react-native-paper";
import Geocoder from "react-native-geocoding";
import DropShadow from "react-native-drop-shadow";
import GetLocation from "react-native-get-location";
import * as ImagePicker from "react-native-image-picker";
import {Avatar, CheckBox, Overlay} from "react-native-elements";
import FeatherIcon from 'react-native-vector-icons/Feather'
import {
  appleLink,
  cuisinesList,
  dietList,
  googleLink,
  priceList,
  saList,
  sustainabilityPref,
} from "../assets/appData";
import {TextInput as RNTextInput} from "react-native-paper";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";
import RestaurantService from "../service/RestaurantService";
import {FilterIcon} from "../assets/images/filterIcon.svg";
import {Dot} from "../assets/images/dot.svg";
import {Star} from "../assets/images/star.svg";
import {LocationIcon} from "../assets/images/locationIcon1.svg";
import {LocationIconHome} from "../assets/images/locationIconHome.svg";
import {ShareIcon} from "../assets/images/shareIcon.svg";
import {HelpIcon} from "../assets/images/helpIcon.svg";
import {LogoutIcon} from "../assets/images/logoutIcon.svg";
import {FavResIcon} from "../assets/images/favResIcon.svg";
import {UserIssuesIcon} from "../assets/images/userIssuesIcon.svg";
import {ResVerdantIcon} from "../assets/images/resVerdantIcon.svg";
import {HomeIconSelected} from "../assets/images/homeIconSelected.svg";
import {HomeIcon} from "../assets/images/homeIcon.svg";
import {HomeSearchIcon} from "../assets/images/homeSearchIcon.svg";
import {HomePrefIcon} from "../assets/images/homePrefIcon.svg";
import {HomePrefIconSelected} from "../assets/images/homePrefIconSelected.svg";
import {HomeUserIcon} from "../assets/images/homeUserIcon.svg";
import {HomeUserIconSelected} from "../assets/images/homeUserIconSelected.svg";
import {BackArrowGrey} from "../assets/images/backArrowGrey.svg";
import {BackArrowWhite} from "../assets/images/arrow_white.svg";
import {ExpandIcon} from "../assets/images/expandIcon.svg";
import {Close} from "../assets/images/close.svg";
import {Checked} from "../assets/images/checked.svg";
import {Unchecked} from "../assets/images/unchecked.svg";
import {ExpandWhite} from "../assets/images/expandWhite.svg";
import {SearchIcon} from "../assets/images/search_icon.svg";
import {NonVerdantIcon} from "../assets/images/nonVerdantIcon.svg";
import FastImage from "react-native-fast-image";
import Popover, {PopoverPlacement} from "react-native-popover-view";
const screen=
  Platform.OS=="ios"? Dimensions.get("screen"):Dimensions.get("window");

type SearchRestaurant={
  name: string;
  rating: number;
  place_id: string;
  photo: string;
  location: {
    latitude: number;
    longitude: number;
  };
  keywords: string;
  distance: number;
};

export const Styles=StyleSheet.create({
  screenDiv: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF", //'#F4F5F6'
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    paddingHorizontal: screen.width*0.059,
    paddingTop: screen.height*0.037,
  },
  headTextSF: {
    fontSize: screen.height*0.03,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    color: "#858783",
    width: screen.width*0.88,
    textAlign: "left",
  },
  labelTextSF: {
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.025,
    fontWeight: "400",
    color: "#A8AAA5",
    marginVertical: screen.height*0.021,
  },
  searchViewSF: {
    borderColor: "#D1D3CD",
    borderWidth: 1,
    borderRadius: 5,
    padding: screen.height*0.01,
    borderStyle: "solid",
    width: screen.width*0.88,
    height: screen.height*0.05,
    display: "flex",
    flexDirection: "row",
  },
  prefImg: {
    height: screen.width*0.10795,
    width: screen.width*0.1138,
    marginHorizontal: screen.width*0.04,
  },
  headText: {
    fontSize: screen.height*0.03,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    color: "#858783",
    width: screen.width*0.88,
    textAlign: "left",
    marginVertical: screen.height*0.02,
  },
  prefView: {
    backgroundColor: "#FFF",
    paddingHorizontal: screen.width*0.056,
    paddingVertical: screen.height*0.07,
  },
  expandPopover: {
    height: screen.height*0.06,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: screen.height*0.02,
  },
  prefBtnText: {
    color: "#858783",
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.025,
    fontFamily: "Poppins-Regular",
  },
  nextBtn: {
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
    position: "absolute",
    bottom: screen.height*0.036,
  },
  logoImg: {
    height: screen.width*0.16421,
    width: screen.width*0.17312,
  },
  priceLogoImg: {
    height: screen.width*0.1653,
    width: screen.width*0.1653,
    marginRight: screen.width*0.0347,
  },
  locationIcon: {
    height: screen.height*0.0213,
    width: screen.height*0.0154,
    // marginVertical: 20
  },
  locationIconBtn: {
    height: screen.height*0.0213,
    width: screen.height*0.0154,
    marginRight: screen.height*0.02,
  },
  shareIcon: {
    height: screen.height*0.02,
    width: screen.height*0.02,
  },
  bellIcon: {
    height: screen.height*0.02,
    width: screen.height*0.0175,
  },
  shareIconBtn: {
    height: screen.height*0.02,
    width: screen.height*0.02,
    marginRight: screen.height*0.02,
  },
  bellIconBtn: {
    height: screen.height*0.02,
    width: screen.height*0.0175,
  },
  leafImg: {
    position: "absolute",
    top: screen.height*0.675,
    left: screen.width*0.723,
    height: screen.height*0.358,
    width: screen.height*0.193,
  },
  screenTopDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E4E5B", //'#F4F5F6'
    height: Dimensions.get("window").height*0.1,
    width: Dimensions.get("window").width,
    position: "relative",
    paddingHorizontal: screen.width*0.053,
  },
  locationBar: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: screen.height*0.016,
  },
  locationText: {
    color: "#FFF",
    fontSize: screen.height*0.02,
    flexGrow: 1,
  },
  mainView: {
    paddingHorizontal: screen.width*0.0613,
    flexGrow: 1,
    backgroundColor: "#FFF",
    paddingBottom: screen.height*0.09,
    position: "relative",
  },
  secTitle: {
    fontSize: screen.height*0.0175,
    color: "#636661",
    textTransform: "uppercase",
    marginTop: screen.height*0.02,
    marginBottom: screen.height*0.015,
  },
  filterBtn: {
    width: screen.width*0.2293,
    height: screen.width*0.0623,
    borderRadius: screen.width*0.013,
    borderColor: "#DFE0DC",
    borderStyle: "solid",
    borderWidth: 1,
    paddingHorizontal: screen.width*0.0186,
    // paddingBottom: screen.width*.013,
    flexDirection: "row",
    marginRight: screen.height*0.01,
    alignItems: "center",
  },
  filterBtnText: {
    color: "#A8AAA5",
    fontFamily: "Poppins-Medium",
    fontSize: screen.width*0.0293,
  },
  sortBtn: {
    minWidth: screen.width*0.304,
    height: screen.width*0.0623,
    borderRadius: screen.width*0.013,
    borderColor: "#DFE0DC",
    borderStyle: "solid",
    borderWidth: 1,
    paddingHorizontal: screen.width*0.009,
    // paddingBottom: screen.width*.013,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
    backgroundColor: "#FFF",
  },
  subText: {
    fontSize: screen.height*0.015,
    color: "#A8AAA5",
  },
  friendsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: screen.width*0.8773,
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "#DFE0DC",
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: "solid",
    // height: screen.height*.09,
    paddingVertical: screen.height*0.01,
    paddingHorizontal: screen.width*0.032,
  },
  findFriends: {
    fontSize: screen.height*0.015,
    color: "#447682",
    lineHeight: screen.height*0.0225,
    letterSpacing: screen.height*0.015*0.12,
  },
  addFriendIconBtn: {
    width: screen.height*0.04,
    height: screen.height*0.04,
    marginHorizontal: screen.width*0.01,
  },
  addFriendIcon: {
    width: screen.height*0.04,
    height: screen.height*0.04,
  },
  mapView: {
    width: screen.width*0.8773,
    height: screen.height*0.19,
    borderRadius: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  homeIconBtnSelected: {
    width: screen.width*0.2113,
    height: screen.height*0.09,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "#447682",
    borderTopWidth: screen.height*0.005,
    borderStyle: "solid",
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
  restaurantsListView: {
    height: screen.height*0.34606,
  },
  restaurantView: {
    // minHeight: screen.width*.352,
    // flexDirection:'row',
    marginVertical: screen.height*0.01,
  },
  verdantRestaurantView: {
    // minHeight: screen.width*.352,
    // flexDirection:'row',
    marginVertical: screen.height*0.01,
    borderStyle: "solid",
    borderColor: "#D9EF59",
    borderRadius: 10,
    borderWidth: 1,
    position: "relative",
  },
  verdantStrip: {
    width: "100%",
    backgroundColor: "#D9EF59",
    // position: 'absolute',
    // bottom: 0,
    height: screen.height*0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  resRow1: {
    flexDirection: "row",
  },
  picSection: {
    width: screen.width*0.3087,
    height: screen.height*0.1208,
    marginRight: screen.width*0.048,
    borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
  },
  nvPicSection: {
    width: screen.width*0.3087,
    height: screen.height*0.1208,
    marginRight: screen.width*0.048,
  },
  restautantInfo: {
    minHeight: screen.height*0.1108,
    width: screen.width*0.5387,
    flexDirection: "column",
    paddingBottom: screen.height*0.01,
  },
  restaurantName: {
    color: "#636661",
    fontSize: screen.height*0.02,
    lineHeight: screen.height*0.03,
    fontFamily: "Poppins-Medium",
  },
  restaurantLocation: {
    color: "#858783",
    fontSize: screen.height*0.015,
    // marginVertical:screen.height*.01,
    lineHeight: screen.height*0.02,
    fontFamily: "Poppins-Light",
  },
  restaurantKeywords: {
    color: "#636661",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.02,
    textTransform: "capitalize",
    fontFamily: "Poppins-Regular",
    marginTop: screen.height*0.005,
  },
  restaurantRating: {
    color: "#636661",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.0225,
    fontFamily: "Poppins-Medium",
  },
  restaurantDistance: {
    color: "#636661",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.02,
    fontFamily: "Poppins-Regular",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: screen.height*0.01,
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
  restaurantLink: {
    color: "#447682",
    lineHeight: screen.height*0.02,
    fontSize: screen.height*0.015,
  },
  notVerdantView: {
    backgroundColor: "#DFE0DC",
    borderRadius: 5,
    height: screen.height*0.03,
    width: screen.width*0.288,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: screen.height*.01,
    // paddingVertical: screen.height*.005,
    marginTop: screen.height*0.0125,
  },
  notVerdantText: {
    fontSize: screen.height*0.014,
    lineHeight: screen.height*0.03,
    color: "#A8AAA5",
  },
  searchView: {
    borderTopColor: "rgba(223,224,220,.41)",
    borderTopWidth: 1,
    borderStyle: "solid",
    width: screen.width,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // position: "relative",
    backgroundColor: "#FFF",
  },
  searchTextSec: {
    // marginTop: screen.height*.021,
    // paddingHorizontal: 10,
    paddingVertical: screen.height*0.01,
    width: screen.width*0.78,
    height: screen.height*0.06,
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  searchFlatList: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: screen.height*0.035,
    paddingHorizontal: screen.width*0.0426,
  },
  searchResItem: {
    flexDirection: "row",
    marginBottom: screen.height*0.0175,
    borderColor: "#D9EF59",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 18,
    padding: screen.width*0.032,
  },
  searchResPic: {
    height: screen.height*0.065,
    width: screen.height*0.065,
    borderRadius: screen.height*0.065*0.5,
    marginRight: screen.height*0.02,
  },
  searchResKeywords: {
    color: "#A8AAA5",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.0225,
    fontFamily: "Poppins-Light",
    letterSpacing: 0.5,
    textTransform: "capitalize",
  },
  searchRatingSection: {
    flexDirection: "row",
    alignItems: "center",
    height: screen.height*0.0225,
  },
  overlayView: {
    height: screen.height*0.9,
    position: "relative",
  },
  backIconBtn: {
    // height: screen.height*0.03,
    // width: screen.height*0.03,
    // backgroundColor: '#FFF',
    // marginBottom:25,
    // marginLeft: 10
    // position: "absolute",
    // top: 0,
    // marginHorizontal: screen.height*0.02,
  },
  backIcon: {
    color: "#000",
    height: screen.height*0.03,
    width: screen.height*0.03,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: screen.height*0.02,
    fontFamily: "Poppins-Medium",
    lineHeight: screen.height*0.03,
    textTransform: "uppercase",
  },

  selectedText: {
    color: "#FFF",
    fontSize: screen.height*0.0175,
    flexGrow: 1,
  },
  userBackground: {
    backgroundColor: "#B1CC3E",
  },
  userView: {
    backgroundColor: "#FFF",
    borderTopRightRadius: 80,
  },
  userProfileView: {
    // height:screen.height*.1872
    paddingVertical: screen.height*0.025,
    paddingHorizontal: screen.width*0.053,
    borderBottomColor: "#D1D3CD",
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  userProfileEditView: {
    // height:screen.height*.1872
    paddingVertical: screen.height*0.025,
    paddingHorizontal: screen.width*0.053,
    alignItems: "center",
  },
  userPic: {
    height: 60,
    width: 60,
    borderRadius: 360,
    backgroundColor: "#E7E7E7",
    marginRight: screen.height*0.02,
  },
  profileRow1: {
    flexDirection: "row",
  },
  userPrefRow: {
    flexDirection: "row",
    marginTop: screen.height*0.02,
    marginBottom: screen.height*0.03,
    justifyContent: "center",
  },
  userName: {
    fontSize: screen.height*0.02,
    color: "#636661",
    lineHeight: screen.height*0.03,
  },
  userEmail: {
    fontSize: screen.height*0.015,
    color: "#636661",
    lineHeight: screen.height*0.0225,
  },
  userBio: {
    fontSize: screen.height*0.0175,
    color: "#636661",
    lineHeight: screen.height*0.025,
    marginVertical: screen.height*0.02,
  },
  userPrefTitle: {
    fontSize: screen.height*0.0175,
    color: "#636661",
    lineHeight: screen.height*0.025,
  },
  userPrefName: {
    fontSize: screen.height*0.014,
    color: "#858783",
    lineHeight: screen.height*0.02,
    width: screen.width*0.1866,
    marginTop: screen.height*0.01,
    flexWrap: "wrap",
    fontFamily: "Poppins-Light",
    textAlign: "center",
  },
  userPrefEdit: {
    fontSize: screen.height*0.015,
    color: "#A8AAA5",
    lineHeight: screen.height*0.0225,
  },
  userPrefView: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: screen.width*0.048,
  },
  userFriendIcon: {
    width: screen.height*0.08,
    height: screen.height*0.08,
  },
  userFriendName: {
    color: "#636661",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.0225,
    marginTop: screen.height*0.01,
  },
  userFriendSeeAll: {
    color: "#A8AAA5",
    fontSize: screen.height*0.015,
    lineHeight: screen.height*0.0225,
    textDecorationLine: "underline",
    alignSelf: "flex-end",
  },
  userMenuItem: {
    flexDirection: "row",
    marginVertical: screen.height*0.015,
  },
  userMenuItemText: {
    color: "#636661",
    fontSize: screen.height*0.0175,
    lineHeight: screen.height*0.02,
    textTransform: "uppercase",
  },
  filterView: {
    minHeight: screen.height*0.6205,
    backgroundColor: "#FFF",
    // position: 'absolute',
    // bottom: screen.height*.09
    paddingHorizontal: 0,
    paddingVertical: screen.height*0.02,
    marginTop: screen.height*0.26,
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: screen.width*0.093,
    borderRadius: 8,
    // marginHorizontal: 40,
    marginTop: screen.height*0.0425,
    marginBottom: screen.height*0.02,
    width: screen.width*0.8787,
    height: screen.height*0.0735,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#447682",
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
  cancelBtn: {
    padding: 10,
    borderRadius: 8,
    borderColor: "#447682",
    borderStyle: "solid",
    borderWidth: 0,
    // marginHorizontal: 40,
    // marginVertical:  22,
    width: screen.width*0.8787,
    height: 49,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
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
  yesBtn: {
    // padding: 10,
    borderRadius: 8,
    borderColor: "#447682",
    borderStyle: "solid",
    borderWidth: 1,
    // marginHorizontal: 40,
    marginVertical: 22,
    width: screen.width*0.32,
    height: 29,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
  },
  yesBtnText: {
    color: "#447682",
    fontSize: screen.height*0.015,
    fontFamily: "Poppins-Medium",
  },
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
});

type HomePageProps={
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
  restaurant?: RestaurantService;
  match?: any;
};

@inject("restaurant")
@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class HomePage extends React.Component<HomePageProps, {}> {


  backHandler: any;







  @observable
  loading=false;

  @observable
  userLocation: Location;

  @observable
  currentLocation={
    latitude: 41.4027328,
    longitude: 2.1564591,
  };

  @observable
  mapRef;

  @observable
  mapRegion=null;

  @observable
  currentAddress;

  @observable
  restaurantListObj;

  @observable
  restaurantList=[];

  @observable
  filteredRestaurantList=[];

  @observable
  isSearchRestaurant=false;

  @observable
  isSelectPreferences=false;

  @observable
  searchText="";

  @observable
  nameText="";

  @observable
  bioText="";

  @observable
  timer;

  @observable
  nameTimer;

  @observable
  bioTimer;

  @observable
  restaurantSearchResults=[];

  @observable
  searchLocRef=React.createRef();
  // searchLocRef = React.createRef<GooglePlacesAutocompleteRef>();

  @observable
  keyboardHeight=0;

  @observable
  searchResultHeight=screen.height*0.79;

  @observable
  sustainabilityPref=[];

  @observable
  selectedPreferences=[];

  @observable
  showPrefMenu=false;

  @observable
  isEditPreferences=false;

  @observable
  selectedMenu="HOME";

  @observable
  isSelectFriends=false;

  @observable
  friendsList=[];

  @observable
  filteredFriendsList=[];

  @observable
  dineInFriendsList=[];

  @observable
  searchFriend="";

  @observable
  showUserMenu=false;

  @observable
  isEditProfile=false;

  @observable
  isShareProfile=false;

  @observable
  image;

  @observable
  isVerdantFilter=false;

  @observable
  isDistanceSort=true;

  @observable
  userPriorityFriends=[];

  @observable
  isFilterView=false;

  @observable
  selectedFilter="CRITERIA";

  @observable
  filteredPrefList=[];

  @observable
  filteredCuisineList=[];

  @observable
  filteredPriceList=[];

  @observable
  filteredDietList=[];

  @observable
  filteredSAList=[];

  @observable
  showAltSort=false;

  @observable
  isLogoutDialog=false;

  @observable
  latDel=1000;

  @observable
  picLoading=false;
  @observable
  LoginResgister=false;
  backAction=() => {
    // switch (menu) {
    //   case "HOME":
    //     this.selectedMenu="HOME";
    //     break;
    //   case "SEARCH":
    //     this.selectedMenu="SEARCH";
    //     this.isSearchRestaurant=true;
    //     break;
    //   case "PREF":
    //     this.isSelectPreferences=true;
    //     this.selectedMenu="PREF";
    //     break;
    //   case "USER":
    //     this.selectedMenu="USER";
    //     // this.showUserMenu=true
    //     break;
    //   default:
    //     break;
    // }
    if (this.selectedMenu==="HOME") {
      Alert.alert("", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {text: "YES", onPress: () => BackHandler.exitApp()}
      ]);
    } else {
      this.isSearchRestaurant=false;
      this.selectedMenu="HOME"
    }
    return true;
  };


  @autobind
  async logout() {
    try {
      await this.props.storage.remove({key: "userID"});
      await this.props.storage.remove({key: "appPass"});
      this.props.account.loggedInUser=null;

      this.isLogoutDialog=false;
      this.props.routing.push("/login");
    } catch (err) {
      console.log("logout", err);
    }
  }

  @autobind
  async share() {
    try {
      const res=Share.share({
        title: "App link",
        message: `Looking for sustainable restaurants? Check out the Verdantips App, a place where you find restaurants that practice energy efficiency, water savings, waste reduction, and more. Download from play store today: PlayStore: ${googleLink}  `,//, Apple Store: ${appleLink}
        // url: Platform.OS === 'android'?googleLink:appleLink
      });
    } catch (err) {
      console.log("share", err);
    }
  }

  _keyboardDidShow=(e) => {
    if (Platform.OS=="ios") {
      this.keyboardHeight=e.endCoordinates.height;
      this.searchResultHeight=screen.height*0.39;
    } else {
      this.keyboardHeight=0;
      this.searchResultHeight=screen.height*0.39;
    }
  };

  @autobind
  _keyboardDidHide() {
    this.keyboardHeight=0;
    this.searchResultHeight=screen.height*0.79;
  }

  handleFooterMenu(menu) {
    switch (menu) {
      case "HOME":
        this.selectedMenu="HOME";
        break;
      case "SEARCH":
        this.selectedMenu="SEARCH";
        this.isSearchRestaurant=true;
        break;
      case "PREF":
        this.isSelectPreferences=true;
        this.selectedMenu="PREF";
        break;
      case "USER":
        if (this.props.account.loggedInUser) {
          this.selectedMenu="USER";
        } else {
          this.LoginResgister=true
        }
        // this.showUserMenu=true
        break;
      default:
        break;
    }
  }

  @autobind
  handleVerdantRestaurantSearch(text: string) {
    this.searchText=text;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer=setTimeout(async () => {
      this.restaurantSearchResults=[
        ...this.restaurantList.filter((res) => res.name.indexOf(text)>-1),
      ];
    }, 1000);
  }

  @autobind
  handleRestaurantSearch(text: string) {
    this.searchText=text;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer=setTimeout(async () => {
      const url=
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
      const location=`&location=${this.currentLocation.latitude},${this.currentLocation.longitude}`;
      const radius=`&radius=5000&type=restaurant`;
      const keyword=`&keyword=${this.searchText}`;
      const key=`&key=${GOOGLE_PLACES_API_KEY}`;
      const restaurantSearchUrl=url+location+radius+keyword+key;
      let result=await fetch(restaurantSearchUrl).then((response) =>
        response.json()
      );
      let searchResListPromises: SearchRestaurant[]=result.results.map(
        async (resObj) => {
          let photo=null;
          if (resObj.photos) {
            const picUrl="https://maps.googleapis.com/maps/api/place/photo?";
            let maxWidth=`maxwidth=400`;
            let photoRef=`&photoreference=${resObj.photos[0].photo_reference}${key}`;
            let photoUrl=picUrl+maxWidth+photoRef;
            photo=await fetch(photoUrl).catch((err) => {
              return null;
            });
          }
          return {
            place_id: resObj.place_id,
            name: resObj.name,
            photo: photo?.url,
            location: {
              latitude: resObj.geometry.location.lat,
              longitude: resObj.geometry.location.lng,
            },
            keywords: resObj.types
              .join(", ")
              .replace("restaurant,", "")
              .replace("point_of_interest,", ""),
            rating: resObj.rating,
            distance: geolib.getDistance(
              {
                latitude: this.currentLocation.latitude,
                longitude: this.currentLocation.longitude,
              },
              {
                latitude: resObj.geometry.location.lat,
                longitude: resObj.geometry.location.lng,
              }
            ),
          };
        }
      );
      let searchResList=await Promise.all(searchResListPromises);
      this.restaurantSearchResults=searchResList;
    }, 200);
  }

  handlepreferenceSelect(prefId) {
    // if(this.isEditPreferences){

    //     switch (prefId) {
    //         case 'PLANFULL':
    //             let prefIndex1 = this.selectedPreferences.findIndex(pref=>pref.id==prefId)
    //             if(prefIndex1>-1){
    //                 this.selectedPreferences.splice(prefIndex1,1)
    //                 let prefIndex2 = this.selectedPreferences.findIndex(pref=>pref.id=='PLANFRIE')
    //                 this.selectedPreferences.splice(prefIndex2,1)
    //             }else{
    //                 if(this.selectedPreferences.length<=5){
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id==prefId)))
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id=='PLANFRIE')))
    //                 }
    //             }
    //             break;
    //         case 'VEGEFULL':
    //             let prefIndexv1 = this.selectedPreferences.findIndex(pref=>pref.id==prefId)
    //             if(prefIndexv1>-1){
    //                 this.selectedPreferences.splice(prefIndex1,1)
    //                 let prefIndex2 = this.selectedPreferences.findIndex(pref=>pref.id=='VEGEFRIE')
    //                 this.selectedPreferences.splice(prefIndex2,1)
    //             }else{
    //                 if(this.selectedPreferences.length<=5){
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id==prefId)))
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id=='VEGEFRIE')))
    //                 }
    //             }
    //             break;
    //         case 'PLASFREE':
    //             let prefIndexP1 = this.selectedPreferences.findIndex(pref=>pref.id==prefId)
    //             if(prefIndexP1>-1){
    //                 this.selectedPreferences.splice(prefIndex1,1)
    //                 let prefIndex2 = this.selectedPreferences.findIndex(pref=>pref.id=='PLASCONS')
    //                 this.selectedPreferences.splice(prefIndex2,1)
    //             }else{
    //                 if(this.selectedPreferences.length<=5){
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id==prefId)))
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id=='PLASCONS')))
    //                 }
    //             }
    //             break;
    //         default:
    //             let prefIndex = this.selectedPreferences.findIndex(pref=>pref.id==prefId)
    //             if(prefIndex>-1){
    //                 this.selectedPreferences.splice(prefIndex,1)
    //             }else{
    //                 if(this.selectedPreferences.length<=2){
    //                     this.selectedPreferences.push(Object.assign({},this.sustainabilityPref.find(pref=>pref.id==prefId)))
    //                 }
    //             }
    //             break;
    //     }
    let prefIndex=this.selectedPreferences.findIndex(
      (pref) => pref.id==prefId
    );
    if (prefIndex>-1) {
      this.selectedPreferences.splice(prefIndex, 1);
    } else {
      if (this.selectedPreferences.length<=2) {
        this.selectedPreferences.push(
          Object.assign(
            {},
            this.sustainabilityPref.find((pref) => pref.id==prefId)
          )
        );
      }
    }
  }

  @autobind
  async savePref() {
    this.isEditPreferences=false;
    let pushPrefList=[...this.selectedPreferences];
    // if (
    //   this.selectedPreferences.findIndex((pref) => pref.id == "PLANFULL") > -1
    // ) {
    //   pushPrefList.push(
    //     this.sustainabilityPref.find((pref) => pref.id == "PLANFRIE")
    //   );
    // }
    // if (
    //   this.selectedPreferences.findIndex((pref) => pref.id == "VEGEFULL") > -1
    // ) {
    //   pushPrefList.push(
    //     this.sustainabilityPref.find((pref) => pref.id == "VEGEFRIE")
    //   );
    // }
    // if (
    //   this.selectedPreferences.findIndex((pref) => pref.id == "PLASFREE") > -1
    // ) {
    //   pushPrefList.push(
    //     this.sustainabilityPref.find((pref) => pref.id == "PLASCONS")
    //   );
    // }

    await this.props.account.updateUserProfileDetails({
      preferences: [...pushPrefList.map((pref) => pref.id)],
    });
    // this.isEditPreferences = false;
  }

  onFriendClick(friend) {
    let selected=friend.selected;
    if (selected) {
      this.filteredFriendsList.find((f) => f.id==friend.id).selected=false;
      this.friendsList.find((f) => f.id==friend.id).selected=false;
    } else {
      this.filteredFriendsList.find((f) => f.id==friend.id).selected=true;
      this.friendsList.find((f) => f.id==friend.id).selected=true;
    }
  }

  handleSearchFriends(text) {
    this.searchFriend=text;
    if (text.trim().length==0) {
      this.filteredFriendsList=[...this.friendsList];
    } else {
      this.filteredFriendsList=this.friendsList.filter(
        (friend) => friend.name.toLowerCase().indexOf(text.toLowerCase())>-1
      );
    }
  }

  @autobind
  doneFriendsSelection() {
    console.log(this.friendsList.filter((f) => f.selected));
    this.dineInFriendsList=[...this.friendsList.filter((f) => f.selected)];
    this.isSelectFriends=false;
  }

  @autobind
  handleCloseFilter() {
    this.isFilterView=false;
    this.filteredCuisineList=[...this.props.account.filteredCuisineList];
    this.filteredDietList=[...this.props.account.filteredDietList];
    this.filteredPriceList=[...this.props.account.filteredPriceList];
    this.filteredPrefList=[...this.props.account.filteredPrefList];
    this.filteredSAList=[...this.props.account.filteredSAList];
  }

  @autobind
  handleApplyFilters() {
    let cuisineFilteredRes=[];
    let dietFilteredRes=[];
    let priceFilteredRes=[];
    let prefFilteredRes=[];
    let saFilteredRes=[];
    let frl=[...this.restaurantList];
    if (
      this.filteredCuisineList.length+
      this.filteredDietList.length+
      this.filteredPriceList.length+
      this.filteredPrefList.length+
      this.filteredSAList.length>
      0
    ) {
      if (this.filteredCuisineList.length>0) {
        frl=[...frl].filter((res) =>
          this.filteredCuisineList.some((item) => res.cuisine.includes(item.id))
        );
      }
      if (this.filteredDietList.length>0) {
        frl=[...frl].filter((res) =>
          this.filteredDietList.some((item) => res.dietary.includes(item.id))
        );
      }
      if (this.filteredPriceList.length>0) {
        frl=[...frl].filter((res) =>
          this.filteredPriceList.map((item) => item.price).includes(res.price)
        );
      }
      if (this.filteredPrefList.length>0) {
        frl=[...frl].filter((res) =>
          this.filteredPrefList.some((item) => res.susPref.includes(item.id))
        );
      }
      if (this.filteredSAList.length>0) {
        frl=[...frl].filter((res) =>
          this.filteredSAList.some((item) => res.serviceList.includes(item.id))
        );
      }
      // let frl = [...new Set([...cuisineFilteredRes,...dietFilteredRes,...priceFilteredRes,...prefFilteredRes,...saFilteredRes])]

      if (this.isDistanceSort) {
        this.filteredRestaurantList=[...frl]
          .filter(
            (res) =>
              res.location.latitude<=
              this.mapRegion.latitude+this.mapRegion.latitudeDelta&&
              res.location.latitude>=
              this.mapRegion.latitude-this.mapRegion.latitudeDelta&&
              res.location.longitude<=
              this.mapRegion.longitude+this.mapRegion.longitudeDelta&&
              res.location.longitude>=
              this.mapRegion.longitude-this.mapRegion.longitudeDelta
          )
          .sort((a, b) => a.distance-b.distance);
      } else {
        this.filteredRestaurantList=[...frl]
          .filter(
            (res) =>
              res.location.latitude<=
              this.mapRegion.latitude+this.mapRegion.latitudeDelta&&
              res.location.latitude>=
              this.mapRegion.latitude-this.mapRegion.latitudeDelta&&
              res.location.longitude<=
              this.mapRegion.longitude+this.mapRegion.longitudeDelta&&
              res.location.longitude>=
              this.mapRegion.longitude-this.mapRegion.longitudeDelta
          )
          .sort((a, b) => this.relevanceSortFn(a, b));
      }
      this.props.account.filteredCuisineList=[...this.filteredCuisineList];
      this.props.account.filteredDietList=[...this.filteredDietList];
      this.props.account.filteredPriceList=[...this.filteredPriceList];
      this.props.account.filteredPrefList=[...this.filteredPrefList];
      this.props.account.filteredSAList=[...this.filteredSAList];
    } else {
      if (this.isDistanceSort) {
        this.filteredRestaurantList=[...this.restaurantList]
          .filter(
            (res) =>
              res.location.latitude<=
              this.mapRegion.latitude+this.mapRegion.latitudeDelta&&
              res.location.latitude>=
              this.mapRegion.latitude-this.mapRegion.latitudeDelta&&
              res.location.longitude<=
              this.mapRegion.longitude+this.mapRegion.longitudeDelta&&
              res.location.longitude>=
              this.mapRegion.longitude-this.mapRegion.longitudeDelta
          )
          .sort((a, b) => a.distance-b.distance);
      } else {
        this.filteredRestaurantList=[...this.restaurantList]
          .filter(
            (res) =>
              res.location.latitude<=
              this.mapRegion.latitude+this.mapRegion.latitudeDelta&&
              res.location.latitude>=
              this.mapRegion.latitude-this.mapRegion.latitudeDelta&&
              res.location.longitude<=
              this.mapRegion.longitude+this.mapRegion.longitudeDelta&&
              res.location.longitude>=
              this.mapRegion.longitude-this.mapRegion.longitudeDelta
          )
          .sort((a, b) => this.relevanceSortFn(a, b));
      }
    }
    this.isFilterView=false;
  }

  @autobind
  onClickVerdantFilter() {
    this.isVerdantFilter=!this.isVerdantFilter;
    if (this.isVerdantFilter) {
      this.filteredRestaurantList=[
        ...this.restaurantList.filter((res) => res.isVerdant),
      ];
    } else {
      this.filteredRestaurantList=[...this.restaurantList];
    }
  }

  @autobind
  onClickSort() {
    this.isDistanceSort=!this.isDistanceSort;
    if (this.isDistanceSort) {
      this.filteredRestaurantList=[...this.restaurantList]
        .filter(
          (res) =>
            res.location.latitude<=
            this.mapRegion.latitude+this.mapRegion.latitudeDelta&&
            res.location.latitude>=
            this.mapRegion.latitude-this.mapRegion.latitudeDelta&&
            res.location.longitude<=
            this.mapRegion.longitude+this.mapRegion.longitudeDelta&&
            res.location.longitude>=
            this.mapRegion.longitude-this.mapRegion.longitudeDelta
        )
        .sort((a, b) => a.distance-b.distance);
    } else {
      console.log("this.props.account.loggedInUser", this.props.account.loggedInUser)
      if (this.props.account.loggedInUser) {
        if ("preferences" in this.props.account.loggedInUser) {
        } else {
          Toast.show(
            'Sorry! Looks like you didn`t save \nany sustainability preferences.\nPlease press the "leaf" icon at the bottom\nbar and register max 3\npreferences',
            Toast.LONG
          );
        }
      }

      this.filteredRestaurantList=[...this.restaurantList]
        .filter(
          (res) =>
            res.location.latitude<=
            this.mapRegion.latitude+this.mapRegion.latitudeDelta&&
            res.location.latitude>=
            this.mapRegion.latitude-this.mapRegion.latitudeDelta&&
            res.location.longitude<=
            this.mapRegion.longitude+this.mapRegion.longitudeDelta&&
            res.location.longitude>=
            this.mapRegion.longitude-this.mapRegion.longitudeDelta
        )
        .sort((a, b) => this.relevanceSortFn(a, b));
    }
    this.handleApplyFilters();
    this.showAltSort=!this.showAltSort;
  }

  relevanceSortFn(a, b) {
    let val=this.getRelevance(b)-this.getRelevance(a);
    if (val==0) {
      return a.distance-b.distance;
    }
    return val;
  }

  getRelevance(resObj): number {
    let ret=0;
    let commonPref=[...resObj.susPref].filter((s) =>
      this.props?.account?.loggedInUser?.preferences?.includes(s)
    );
    let commonCuis=[...resObj.cuisine].filter((c) =>
      this.filteredCuisineList.includes(c)
    );
    let commondiet=[...resObj.dietary].filter((c) =>
      this.filteredDietList.includes(c)
    );
    ret=commonPref.length+commonCuis.length+commondiet.length;
    return ret;
  }

  @autobind
  onClickFilter() {
    this.isFilterView=true;
  }

  @autobind
  clickBackPref() {
    if (this.isEditPreferences) {
      this.selectedPreferences=sustainabilityPref.filter((pref) =>
        this.props.account.loggedInUser?.preferences.includes(pref.id)
      );
      this.isEditPreferences=false;
    } else {
      this.selectedMenu="HOME";
    }
  }

  @autobind
  async handleProfileEdit() {
    this.loading=true;
    await this.props.account.updateUserProfileDetails({
      name: this.nameText,
      about: this.bioText,
    });
    this.loading=false;
    this.isEditProfile=false;
  }

  @autobind
  handlePhotoUpload() {
    this.picLoading=true;
    const options: ImagePicker.ImageLibraryOptions={
      mediaType: "photo",
      quality: 1,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true,
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
        this.picLoading=false;
        return;
      } else if (response.errorCode=="camera_unavailable") {
        console.log("Camera not available on device");
        this.picLoading=false;
        return;
      } else if (response.errorCode=="permission") {
        console.log("Permission not satisfied");
        this.picLoading=false;
        return;
      } else if (response.errorCode=="others") {
        console.log(response.errorMessage);
        this.picLoading=false;
        return;
      }
      const source={uri: response.uri, data: response.base64};

      this.image=`data:image/png;base64,${source.data}`;
      let userObj={profilePic: `data:image/png;base64,${source.data}`};
      console.log("userObj", userObj)
      await this.props.account.updateUserProfileDetails(userObj);
      this.picLoading=false;
    });
  }

  handleFilterPriceSelect(priceId) {
    let priceIndex=this.filteredPriceList.findIndex(
      (price) => price.id==priceId
    );
    if (priceIndex>-1) {
      this.filteredPriceList.splice(priceIndex, 1);
    } else {
      this.filteredPriceList.push(
        Object.assign(
          {},
          priceList.find((price) => price.id==priceId)
        )
      );
    }
  }

  handleFilterPrefSelect(prefId) {
    let prefIndex=this.filteredPrefList.findIndex(
      (pref) => pref.id==prefId
    );
    if (prefIndex>-1) {
      this.filteredPrefList.splice(prefIndex, 1);
    } else {
      this.filteredPrefList.push(
        Object.assign(
          {},
          this.sustainabilityPref.find((pref) => pref.id==prefId)
        )
      );
    }
    console.log(this.sustainabilityPref, this.filteredPrefList);
  }

  handleFilterCuisineSelect(cuisineId) {
    let cuisineIndex=this.filteredCuisineList.findIndex(
      (c) => c.id==cuisineId
    );
    if (cuisineIndex>-1) {
      this.filteredCuisineList.splice(cuisineIndex, 1);
    } else {
      this.filteredCuisineList.push(
        Object.assign(
          {},
          cuisinesList.find((c) => c.id==cuisineId)
        )
      );
    }
  }

  handleFilterDietSelect(dietId) {
    let dietIndex=this.filteredDietList.findIndex((c) => c.id==dietId);
    if (dietIndex>-1) {
      this.filteredDietList.splice(dietIndex, 1);
    } else {
      this.filteredDietList.push(
        Object.assign(
          {},
          dietList.find((d) => d.id==dietId)
        )
      );
    }
  }

  handleFilterSASelect(saId) {
    let saIndex=this.filteredSAList.findIndex((c) => c.id==saId);
    if (saIndex>-1) {
      this.filteredSAList.splice(saIndex, 1);
    } else {
      this.filteredSAList.push(
        Object.assign(
          {},
          saList.find((s) => s.id==saId)
        )
      );
    }
  }

  handleSelectRestaurant(restaurantId) {
    this.props.routing.push(`/restaurant/${restaurantId}`);
  }

  @autobind
  handleEditUserPref() {
    this.selectedMenu="PREF";
    this.isEditPreferences=true;
  }

  async handleMapRegionChange(region) {
    this.mapRegion=region;

    this.restaurantList=this.props.restaurant.verdantRestaurants.map((res) =>
      Object.assign(res, {
        distance: geolib.getDistance(
          {
            latitude: this.currentLocation.latitude,
            longitude: this.currentLocation.longitude,
          },
          {
            latitude: res.location.latitude,
            longitude: res.location.longitude,
          }
        ),
        isVerdant: true,
      })
    );
    this.loading=false;
    this.latDel=1000*111*region.latitudeDelta;
    this.filteredRestaurantList=[...this.restaurantList];
    this.handleApplyFilters();
  }

  async componentDidMount() {
    this.backHandler=BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this.loading=true;
    await this.props.restaurant.getVerdantRestaurants();

    if (this.props.account.userLocation) {
      this.currentLocation={
        latitude: this.props.account.userLocation.lat,
        longitude: this.props.account.userLocation.lng,
      };
    } else {
      this.currentLocation=await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          return location;
        })
        .catch((error) => {
          // if(this.props.account.userLocation){
          //     return {
          //         latitude: this.props.account.userLocation.lat,
          //         longitude: this.props.account.userLocation.lng
          //     }
          // }else{
          return {
            latitude: 41.4027328,
            longitude: 2.1564591,
          };
          // }
        });
    }

    Geocoder.from(this.currentLocation.latitude, this.currentLocation.longitude)
      .then((json) => {
        this.currentAddress=json.results[0].address_components[1];
        this.props.account.userLocation={
          lat: json.results[0].geometry.location.lat,
          lng: json.results[0].geometry.location.lng,
          description: json.results[0].formatted_address,
          tag: json.results[0].geometry.location_type,
        };
        // this.locRef.current?.setAddressText(addressComponent.long_name)
        // this.selectedLocation = {
        //     lat: location.latitude,
        //     lng: location.longitude,
        //     description: addressComponent.long_name,
        //     tag: ''
        // }
      })
      .catch((error) => console.log(error));
    this.userLocation=this.props.account.userLocation;
    // const url  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
    // const location = `location=${this.currentLocation.latitude},${this.currentLocation.longitude}`;
    // const radius = '&radius=5000';
    // const type = '&keyword=restaurant';
    // const key = `&key=${GOOGLE_PLACES_API_KEY}`;
    // const restaurantSearchUrl = url + location + radius + type + key;
    // this.restaurantListObj = await fetch(restaurantSearchUrl)
    // .then(res=>res.json())
    // .catch(err=>console.log(err))
    // console.log(this.restaurantListObj)
    // let restaurantListPromises = this.restaurantListObj.results.map(async(restObj)=>{
    //     let photo = null
    //     if(restObj.photos){
    //         const picUrl = 'https://maps.googleapis.com/maps/api/place/photo?'
    //         let maxWidth = `maxwidth=400`
    //         let photoRef = `&photoreference=${restObj.photos[0].photo_reference}${key}`
    //         let photoUrl = picUrl + maxWidth + photoRef
    //         photo = await fetch(photoUrl)
    //         .catch(err=>{
    //             console.log(err)
    //             return  null
    //         })
    //     }
    //     let details = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${restObj.place_id}&fields=id,formatted_address,website,url&key=${GOOGLE_PLACES_API_KEY}`)
    //     .then(result=>result.json())
    //     .catch(err=>{
    //         console.log(err)
    //         return null
    //     })
    //     // console.log(photo)
    //     console.log('details',details)
    //     let addressArray: Array<string> = restObj.vicinity.split(', ')
    //     if(details){
    //         return {
    //             place_id: restObj.place_id,
    //             name: restObj.name,
    //             photo: photo?.url,
    //             location: {
    //                 latitude: restObj.geometry.location.lat,
    //                 longitude: restObj.geometry.location.lng
    //             },
    //             address: addressArray.slice(addressArray.length-3,addressArray.length-1).join(', '),
    //             keywords: restObj.types.join(',').replace('restaurant,','').replace('point_of_interest,',''),
    //             rating: restObj.rating,
    //             url: details.result.url,
    //             distance: geolib.getDistance(
    //                 {
    //                     latitude:this.currentLocation.latitude,
    //                     longitude:this.currentLocation.longitude
    //                 },
    //                 {
    //                     latitude: restObj.geometry.location.lat,
    //                     longitude: restObj.geometry.location.lng
    //                 }
    //             ),
    //             isVerdant: false
    //         }
    //     }else{
    //         return null
    //     }
    // })
    // console.log('restaurantList',restaurantListPromises)
    // let resList = await Promise.all(restaurantListPromises)
    // console.log('resList',resList)
    // this.restaurantList = resList

    // this.restaurantList.map((res,r)=>{
    //     let vr = this.props.account.verdantRestaurants.find(verdant=>verdant.place_id==res.place_id)
    //     if(vr){
    //         let dist = this.restaurantList[r].distance
    //         this.restaurantList[r] = Object.assign({isVerdant: true,distance:dist},vr)
    //     }
    // })

    this.restaurantList=this.props.restaurant.verdantRestaurants.map(
      (res) => {
        let cd=geolib.getDistance(
          {
            latitude: this.currentLocation.latitude,
            longitude: this.currentLocation.longitude,
          },
          {
            latitude: res.location.latitude? res.location.latitude:0,
            longitude: res.location.longitude? res.location.longitude:0,
          }
        );
        return Object.assign(res, {
          distance: cd,
          isVerdant: true,
        });
      }
    );
    this.loading=false;
    this.mapRegion={
      latitude: this.currentLocation.latitude,
      longitude: this.currentLocation.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    };
    this.filteredRestaurantList=[...this.restaurantList]; //.filter(res=>res.distance<=this.latDel)].sort((a,b)=>a.distance-b.distance)
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    this.sustainabilityPref=sustainabilityPref;
    this.selectedPreferences=sustainabilityPref.filter((pref) =>
      this.props.account.loggedInUser?.preferences?.includes(pref.id)
    );
    this.nameText=this.props.account.loggedInUser?.name;
    this.bioText=this.props.account.loggedInUser?.about;
    this.friendsList=[
      {
        id: "friend1",
        icon: require("../assets/images/samples/user1.png"),
        name: "Karen Green",
        description: "The only thing I like better...",
        preferences: [
          {
            id: "susPref1",
            icon: require("../assets/images/sustMeat.png"),
            title: "Sustainable meat",
            description:
              "This icon is given to Lars Bertelsen as at least 25% of the meat served in their restaurant is EU Organic certified. They are now in the process of obtaining other certifications. The list is here as follows:",
          },
          {
            id: "susPref2",
            icon: require("../assets/images/veganFriendly.png"),
            title: "Vegan friendly",
          },
          {
            id: "susPref3",
            icon: require("../assets/images/noPlastic.png"),
            title: "Plastic unfriendly",
          },
        ],
        selected: false,
      },
      {
        id: "friend2",
        icon: require("../assets/images/samples/user2.png"),
        name: "Clay Johnson",
        description: "You know, food is such – it’s a hug",
        preferences: [
          {
            id: "susPref4",
            icon: require("../assets/images/foodRecycle.png"),
            title: "Food waste recycling",
          },
          {
            id: "susPref5",
            icon: require("../assets/images/covidMeasures.png"),
            title: "Coronavirus measures",
          },
          {
            id: "susPref3",
            icon: require("../assets/images/noPlastic.png"),
            title: "Plastic unfriendly",
          },
        ],
        selected: false,
      },
      {
        id: "friend3",
        icon: require("../assets/images/samples/user3.png"),
        name: "Mini Blossom",
        description: "There’s nothing more romantic than Italian food.",
        preferences: [
          {
            id: "susPref4",
            icon: require("../assets/images/foodRecycle.png"),
            title: "Food waste recycling",
          },
          {
            id: "susPref5",
            icon: require("../assets/images/covidMeasures.png"),
            title: "Coronavirus measures",
          },
          {
            id: "susPref2",
            icon: require("../assets/images/veganFriendly.png"),
            title: "Vegan friendly",
          },
        ],
        selected: false,
      },
    ];
    this.filteredFriendsList=[...this.friendsList];
    this.userPriorityFriends=[...this.friendsList];
    let {menuId}=this.props.match.params;

    if (menuId) {
      console.log("menuId", menuId)
      this.handleFooterMenu(menuId);
    }
    this.image=this.props.account.loggedInUser?.profilePic;
    this.filteredCuisineList=[...this.props.account.filteredCuisineList];
    this.filteredDietList=[...this.props.account.filteredDietList];
    this.filteredPriceList=[...this.props.account.filteredPriceList];
    this.filteredPrefList=[...this.props.account.filteredPrefList];
    this.filteredSAList=[...this.props.account.filteredSAList];
    this.handleApplyFilters();
  }

  componentWillUnmount() {
    this.backHandler.remove();
    Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
  }

  flatListItem=(res, r) => {
    return (
      <View
        style={
          res.isVerdant? Styles.verdantRestaurantView:Styles.restaurantView
        }
        key={`res-${r}`}
      >
        <TouchableOpacity
          onPress={() => this.handleSelectRestaurant(res.id)}
          style={Styles.resRow1}
        >
          {res.isVerdant&&res.photo.length>0? (
            <FastImage style={Styles.picSection} source={{uri: res.photo}} />
          ):(
            <SvgCss style={Styles.nvPicSection} xml={NonVerdantIcon} />
          )}
          <View style={Styles.restautantInfo}>
            <Text style={Styles.restaurantName}>{`${res.name
              .split(",")[0]
              .slice(0, 19)}${res.name.split(",")[0].length>18? "..":""
              }`}</Text>
            <Text style={Styles.restaurantLocation}>
              {res.isVerdant
                ? res.shortAddress.slice(0, 31)
                :res.address.slice(0, 31)}
            </Text>
            <Text style={Styles.restaurantKeywords}>
              {res.cuisine.slice(0, 2).join(", ").replace("_", " ")}
            </Text>
            <View style={Styles.ratingSection}>
              <Text style={Styles.restaurantDistance}>{`${Math.round(res.distance/100)/10
                } km`}</Text>
              <SvgCss xml={Dot} style={Styles.dot} />
              <Text style={Styles.restaurantDistance}>
                {Math.round(res.price)==1
                  ? `€`
                  :Math.round(res.price)==2
                    ? `€€`
                    :Math.round(res.price)==3
                      ? `€€€`
                      :Math.round(res.price)==4
                        ? `€€€€`
                        :`€`}
              </Text>
              <SvgCss xml={Dot} style={Styles.dot} />
              <SvgCss xml={Star} style={Styles.star} />
              <Text style={Styles.restaurantRating}>{res.rating}</Text>
            </View>
            {res.isVerdant? null:(
              <Text
                style={Styles.restaurantLink}
                onPress={() => Linking.openURL(res.url)}
              >{`google.com/${res.name.toLowerCase().replace(" ", "").split(" ")[0]
                }`}</Text>
            )}
          </View>
        </TouchableOpacity>
        {res.isVerdant? (
          <View style={Styles.verdantStrip}>
            <SvgCss
              xml={ResVerdantIcon}
              style={{
                marginLeft: -10,
                // width: screen.width*0.3812,
                height: screen.width*0.08616,
              }}
            />
            <View style={{flexGrow: 1}} />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{
                height: screen.height*0.05,
                width: screen.width*0.35,
                flexDirection: "row",
              }}
              contentContainerStyle={{alignItems: "center"}}
            >
              {this.sustainabilityPref
                .filter((spf) => res.susPref.indexOf(spf.id)>-1)
                .map((srItem, sri) => (
                  <View
                    key={`srItem-${sri}`}
                    style={{
                      backgroundColor: "#FFF",
                      height: screen.width*0.075,
                      width: screen.width*0.075,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: screen.width*0.04,
                      marginRight: screen.width*0.0693,
                    }}
                  >
                    <FastImage
                      style={{
                        width: screen.width*0.0797,
                        height: screen.width*0.0756,
                        borderRadius: screen.width*0.0797*0.5,
                      }}
                      source={srItem.icon}
                    />
                  </View>
                ))}
            </ScrollView>
            {this.sustainabilityPref.filter(
              (spf) => res.susPref.indexOf(spf.id)>-1
            ).length>
              0.488/0.1493? (
              <FastImage
                style={{
                  width: screen.width*0.01632,
                  height: screen.width*0.0253,
                  marginHorizontal: screen.width*0.0213,
                }}
                source={require("../assets/images/scrollArrow.png")}
              />
            ):(
              <View
                style={{
                  width: screen.width*0.01632,
                  height: screen.width*0.0253,
                  marginHorizontal: screen.width*0.0213,
                }}
              ></View>
            )}
          </View>
        ):null}
      </View>
    );
  };

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <>
          {this.selectedMenu=="HOME"? (
            <>
              <View style={Styles.screenTopDiv}>
                <View style={Styles.locationBar}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.routing.replace("/locationSearch/HOME")
                    }
                    style={Styles.locationIconBtn}
                  >
                    <SvgCss xml={LocationIconHome} style={Styles.shareIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.routing.replace("/locationSearch/HOME")
                    }
                  >
                    <Text style={Styles.locationText}>
                      {this.currentAddress?.long_name}
                    </Text>
                  </TouchableOpacity>
                  <View style={{flexGrow: 1}}></View>
                  <TouchableOpacity
                    onPress={this.share}
                    style={Styles.shareIconBtn}
                  >
                    <SvgCss xml={ShareIcon} style={Styles.shareIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={Styles.mainView}>
                <Text style={Styles.secTitle}>restaurants near me</Text>
                <View style={Styles.mapView}>
                  {this.loading? (
                    <View />
                  ):(
                    <MapView
                      // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                      style={Styles.map}
                      region={{
                        latitude: this.mapRegion
                          ? this.mapRegion.latitude
                          :this.currentLocation?.latitude,
                        longitude: this.mapRegion
                          ? this.mapRegion.longitude
                          :this.currentLocation?.longitude,
                        latitudeDelta: this.mapRegion
                          ? this.mapRegion.latitudeDelta
                          :0.015,
                        longitudeDelta: this.mapRegion
                          ? this.mapRegion.longitudeDelta
                          :0.0121,
                      }}
                      onRegionChangeComplete={(region) =>
                        this.handleMapRegionChange(region)
                      }
                      ref={(ref) => (this.mapRef=ref)}
                    >
                      <Marker
                        style={{
                          width: screen.width*0.04,
                          height: screen.width*0.0506,
                        }}
                        coordinate={{
                          latitude: this.currentLocation?.latitude,
                          longitude: this.currentLocation?.longitude,
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

                      {this.filteredRestaurantList.length>0
                        ? toJS(this.filteredRestaurantList).map((marker, m) => (
                          <Marker
                            style={{
                              width: screen.width*0.0433,
                              height: screen.width*0.062347,
                            }}
                            key={`marker-${m}`}
                            coordinate={marker.location}
                            title={marker.name}
                          >
                            <Image
                              source={require("../assets/images/verdanResPin.png")}
                              style={{
                                width: screen.width*0.0433,
                                height: screen.width*0.062347,
                              }}
                            />
                          </Marker>
                        ))
                        :null}
                    </MapView>
                  )}
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={Styles.secTitle}></Text>
                    <View style={{flexGrow: 1}}></View>
                    <TouchableOpacity
                      style={[
                        Styles.filterBtn,
                        {
                          backgroundColor:
                            this.filteredPrefList.length+
                              this.filteredPriceList.length+
                              this.filteredCuisineList.length+
                              this.filteredDietList.length+
                              this.filteredSAList.length>
                              0
                              ? "#D9EF59"
                              :"#FFFFFF",
                        },
                      ]}
                      onPress={this.onClickFilter}
                    >
                      <SvgCss
                        xml={FilterIcon}
                        style={{
                          height: screen.width*0.0285,
                          width: screen.width*0.03112,
                        }}
                      />
                      <View style={{flexGrow: 1}}></View>
                      <Text
                        style={[
                          Styles.filterBtnText,
                          {
                            color:
                              this.filteredPrefList.length+
                                this.filteredPriceList.length+
                                this.filteredCuisineList.length+
                                this.filteredDietList.length+
                                this.filteredSAList.length>
                                0
                                ? "#A8AAA5"
                                :"#A8AAA5",
                          },
                        ]}
                      >
                        Filters
                      </Text>
                    </TouchableOpacity>
                    <Popover
                      placement={PopoverPlacement.BOTTOM}
                      arrowStyle={{backgroundColor: "transparent"}}
                      backgroundStyle={{backgroundColor: "transparent"}}
                      isVisible={this.showAltSort}
                      onRequestClose={() =>
                        (this.showAltSort=!this.showAltSort)
                      }
                      from={
                        <TouchableOpacity
                          style={Styles.sortBtn}
                          onPress={() => (this.showAltSort=!this.showAltSort)}
                        >
                          {this.isDistanceSort? (
                            <Text style={Styles.filterBtnText}>
                              Sorted by: Distance
                            </Text>
                          ):(
                            <Text style={Styles.filterBtnText}>
                              Sorted by: Relevance
                            </Text>
                          )}
                        </TouchableOpacity>
                      }
                    >
                      <View
                        style={{
                          width: screen.width*0.3713,
                          height: screen.width*0.096,
                          justifyContent: "center",
                          borderRadius: 10,
                          backgroundColor: "transparent",
                        }}
                      >
                        <DropShadow
                          style={{
                            shadowColor: "#00000015",
                            shadowOffset: {
                              width: -3,
                              height: 4,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 10,
                            elevation: 15,
                            alignSelf: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              ...Styles.sortBtn,
                              borderWidth: 0,
                              borderRadius: 8,
                            }}
                            onPress={this.onClickSort}
                          >
                            {!this.isDistanceSort? (
                              <Text style={Styles.filterBtnText}>
                                Sorted by: Distance
                              </Text>
                            ):(
                              <Text style={Styles.filterBtnText}>
                                Sorted by: Relevance
                              </Text>
                            )}
                          </TouchableOpacity>
                        </DropShadow>
                      </View>
                    </Popover>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {this.filteredPrefList.length>0? (
                      <View
                        style={{
                          backgroundColor: "#D4D4D4",
                          alignItems: "center",
                          borderRadius: 15,
                          paddingVertical: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 7,
                            color: "gray",
                            fontFamily: "Poppins-Medium",
                            fontSize: screen.width*0.0293,
                          }}
                        >
                          Sustainability
                        </Text>
                      </View>
                    ):null}
                    {this.filteredPriceList.length>0? (
                      <View
                        style={{
                          backgroundColor: "#D4D4D4",
                          alignItems: "center",
                          borderRadius: 15,
                          marginLeft: 7,
                          paddingVertical: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 15,
                            color: "gray",
                            fontFamily: "Poppins-Medium",
                            fontSize: screen.width*0.0293,
                          }}
                        >
                          Price
                        </Text>
                      </View>
                    ):null}

                    {this.filteredCuisineList.length>0? (
                      <View
                        style={{
                          backgroundColor: "#D4D4D4",
                          alignItems: "center",
                          borderRadius: 15,
                          marginLeft: 7,
                          paddingVertical: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            color: "gray",
                            fontFamily: "Poppins-Medium",
                            fontSize: screen.width*0.0293,
                          }}
                        >
                          Cuisines
                        </Text>
                      </View>
                    ):null}

                    {this.filteredDietList.length>0? (
                      <View
                        style={{
                          backgroundColor: "#D4D4D4",
                          alignItems: "center",
                          borderRadius: 15,
                          marginLeft: 7,
                          paddingVertical: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            color: "gray",
                            fontFamily: "Poppins-Medium",
                            fontSize: screen.width*0.0293,
                          }}
                        >
                          Dietary
                        </Text>
                      </View>
                    ):null}
                    {this.filteredSAList.length>0? (
                      <View
                        style={{
                          backgroundColor: "#D4D4D4",
                          alignItems: "center",
                          borderRadius: 15,
                          marginLeft: 7,
                          paddingVertical: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            color: "gray",
                            fontFamily: "Poppins-Medium",
                            fontSize: screen.width*0.0293,
                          }}
                        >
                          Service & Ambiance
                        </Text>
                      </View>
                    ):null}
                  </ScrollView>
                </View>
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
                ):this.filteredRestaurantList.length>0? (
                  <>
                    {this.props.account.loggedInUser&&
                      "preferences" in this.props.account.loggedInUser? (
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.filteredRestaurantList}
                        renderItem={({item, index}) =>
                          this.flatListItem(item, index)
                        }
                      />
                    ):(
                      <View
                        style={{
                          height: screen.height*0.34606,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#A8AAA5",
                            fontSize: screen.height*0.0225,
                            lineHeight: screen.height*0.035,
                            marginTop: screen.height*0.01,
                            width: screen.width*0.88,
                            textAlign: "center",
                            fontFamily: "Poppins-Light",
                          }}
                        >
                          “'Sorry! Looks like you didn`t save any sustainability
                          preferences. Please press the "leaf" icon at the
                          bottom bar and register max 3 preferences”
                        </Text>
                      </View>
                    )}
                  </>
                ):(
                  <View
                    style={{
                      height: screen.height*0.34606,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#A8AAA5",
                        fontSize: screen.height*0.0225,
                        lineHeight: screen.height*0.035,
                        marginTop: screen.height*0.01,
                        width: screen.width*0.88,
                        textAlign: "center",
                        fontFamily: "Poppins-Light",
                      }}
                    >
                      “Sorry! There are no Verdant restaurants in your selected
                      map area. Please change your filter selection or explore
                      more within Barcelona.”
                    </Text>
                  </View>
                )}
              </View>
            </>
          ):this.selectedMenu=="PREF"? (
            <View>
              <View style={Styles.prefView}>
                <View style={{flexDirection: "row"}}>
                  <TouchableOpacity
                    onPress={this.clickBackPref}
                    style={{
                      alignSelf: "flex-start",
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
                  <View style={{flexGrow: 1}}></View>
                  <Popover
                    placement={PopoverPlacement.LEFT}
                    isVisible={this.showPrefMenu}
                    onRequestClose={() => (this.showPrefMenu=false)}
                    from={
                      <TouchableOpacity
                        style={{
                          alignSelf: "flex-end",
                          marginVertical: screen.height*0.01,
                        }}
                        onPress={() => (this.showPrefMenu=true)}
                      >
                        <SvgCss
                          xml={ExpandIcon}
                          style={{
                            width: screen.width*0.048,
                            height: screen.width*0.035,
                          }}
                        />
                      </TouchableOpacity>
                    }
                  >
                    <TouchableOpacity
                      style={Styles.expandPopover}
                      onPress={() => {
                        if (this.props.account.loggedInUser) {
                          this.showPrefMenu=false;
                          this.isEditPreferences=true;
                        } else {
                          this.LoginResgister=true
                        }
                      }}
                    >
                      <Text style={Styles.prefBtnText}>
                        Edit your preferences
                      </Text>
                    </TouchableOpacity>
                  </Popover>
                </View>
                {this.isEditPreferences? (
                  <>
                    <Text
                      style={{
                        color: "#A8AAA5",
                        fontSize: 14,
                        marginTop: screen.height*0.02,
                        width: screen.width*0.808,
                        lineHeight: screen.height*0.0315,
                      }}
                    >
                      Select your sustainability preferences
                    </Text>
                    <Text
                      style={{
                        color: "#A8AAA5",
                        fontSize: 12,
                        width: screen.width*0.808,
                        lineHeight: screen.height*0.027,
                      }}
                    >
                      (Select max 3)
                    </Text>
                  </>
                ):(
                  <Text style={Styles.headText}>
                    sustainability{" "}
                    <Text
                      style={{
                        fontWeight: "400",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      preferences
                    </Text>
                  </Text>
                )}

                <ScrollView showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 150}}>
                  {this.sustainabilityPref.map((pref, p) => {
                    console.log("pref", pref)
                    return (
                      <TouchableOpacity
                        key={pref.id}
                        disabled={this.isEditPreferences? false:true}
                        onPress={() => this.handlepreferenceSelect(pref.id)}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginVertical: screen.height*0.01874,
                          borderRadius: 10,
                          padding: 10,
                          backgroundColor:
                            this.selectedPreferences.findIndex(
                              (p) => pref.id==p.id
                            )>-1
                              ? "#F3F3F3"
                              :"#FFF",
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
                              fontSize: screen.height*0.02,
                              lineHeight: screen.height*0.0375,
                              fontFamily: "Poppins-Medium",
                            }}
                          >
                            {pref.title}
                          </Text>
                          <Text
                            style={{
                              color: "#858783",
                              fontSize: screen.height*0.015,
                              lineHeight: screen.height*0.027,
                              fontFamily: "Poppins-Light",
                            }}
                          >
                            {pref.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                  <View style={{height: screen.height*0.12}}></View>
                </ScrollView>
              </View>

              {this.isEditPreferences? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    marginVertical: 22,
                    width: screen.width*0.8787,
                    height: screen.height*0.0735,
                    alignItems: "center",
                    alignSelf: "center",
                    position: "absolute",
                    bottom: 90,
                    justifyContent: "center",
                    backgroundColor: "#447682",
                    shadowColor: "#44768270",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    flexDirection: "row",
                    shadowOpacity: 1,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                  onPress={this.savePref}
                >
                  <Text
                    style={{
                      ...Styles.selectedText,
                      fontWeight: "400",
                    }}
                  >
                    {`${this.selectedPreferences.length} selected`}
                  </Text>
                  <Text
                    style={{
                      ...Styles.loginBtnText,
                      fontWeight: "600",
                    }}
                  >
                    DONE
                  </Text>
                </TouchableOpacity>
              ):null}
            </View>
          ):this.selectedMenu=="USER"? (
            this.isEditProfile? (
              <View
                style={{
                  ...Styles.userBackground,
                  paddingTop: screen.height*0.095,
                }}
              >
                <View
                  style={{...Styles.userView, height: screen.height*0.9}}
                >
                  <View style={{marginTop: 15, marginLeft: 20}}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => {
                        this.isEditProfile=false
                      }}
                        style={{width: screen.width*.048, height: 40, }}>
                        <SvgCss
                          style={{width: screen.width*.048, height: screen.height*.03}}
                          xml={BackArrowGrey} />
                      </TouchableOpacity>

                    </View>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                  >
                    <View style={Styles.userProfileEditView}>

                      {this.picLoading? (
                        <View style={Styles.userPic}>
                          <ActivityIndicator
                            size="small"
                            color="#FFF"
                            style={{margin: 10}}
                          />
                        </View>
                      ):(
                        <Avatar
                          rounded
                          icon={{
                            name: "user",
                            type: "font-awesome",
                            color: "#CDCDCD",
                          }}
                          activeOpacity={1}
                          containerStyle={Styles.userPic}
                          size="large"
                          source={{
                            uri: this.image?.length>0? this.image:null,
                          }}
                          onPress={this.handlePhotoUpload}
                        />
                      )}
                      <RNP.TextInput
                        label={this.nameText?.length>0? "Name":null}
                        placeholder="Name"
                        value={this.nameText}
                        onChangeText={(text) => (this.nameText=text)}
                        selectionColor="#D4D4D4"
                        underlineColor="#D4D4D4"
                        // onFocus={()=>this.textLineColour='#2E4E5B'}
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
                        }}
                        textContentType="givenName"
                        theme={{
                          colors: {primary: "#2E4E5B", text: "#2E4E5B"},
                          fonts: {
                            light: {fontFamily: "Poppins-Light"},
                            medium: {fontFamily: "Poppins-Medium"},
                            regular: {fontFamily: "Poppins-Regular"},
                          },
                        }}
                      />
                      <RNP.TextInput
                        label={this.bioText?.length>0? "Bio":null}
                        placeholder="Bio"
                        value={this.bioText}
                        onChangeText={(text) => (this.bioText=text)}
                        selectionColor="#D4D4D4"
                        underlineColor="#D4D4D4"
                        // onFocus={()=>this.textLineColour='#2E4E5B'}
                        placeholderTextColor="#A8AAA5"
                        style={{
                          width: screen.width*0.8787,
                          // height:screen.height*.075,
                          backgroundColor: "#FFF",
                          paddingHorizontal: 0,
                          paddingTop: 0,
                          color: "#2E4E5B",
                          borderBottomColor: "#2E4E5B",
                          marginVertical: 10,
                          // flexWrap: 'wrap'
                        }}
                        textContentType="none"
                        multiline
                        theme={{
                          colors: {primary: "#2E4E5B", text: "#2E4E5B"},
                          fonts: {
                            light: {fontFamily: "Poppins-Light"},
                            medium: {fontFamily: "Poppins-Medium"},
                            regular: {fontFamily: "Poppins-Regular"},
                          },
                        }}
                      />
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
                          onPress={this.handleProfileEdit}
                          style={Styles.submitBtn}
                        >
                          <Text style={Styles.btnText}>Done</Text>
                        </TouchableOpacity>
                      </DropShadow>
                      <TouchableOpacity
                        style={Styles.cancelBtn}
                        onPress={() => (this.isEditProfile=false)}
                      >
                        <Text
                          style={{
                            color: "#2E4E5B",
                            fontSize: screen.height*0.02,
                            fontFamily: "Poppins-Medium",
                          }}
                        >
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            ):(
              <ScrollView>
                <View style={Styles.userBackground}>
                  <View
                    style={{
                      flexDirection: "row",
                      height: screen.height*0.09,
                    }}
                  >
                    <View style={{flexGrow: 1}}></View>
                    <Popover
                      placement={PopoverPlacement.LEFT}
                      onRequestClose={() => (this.showUserMenu=false)}
                      isVisible={this.showUserMenu}
                      from={
                        <TouchableOpacity
                          style={{
                            alignSelf: "flex-end",
                            marginVertical: screen.height*0.01,
                            marginRight: screen.width*0.056,
                          }}
                          onPress={() => (this.showUserMenu=true)}
                        >
                          <SvgCss
                            style={{
                              width: screen.width*0.048,
                              height: screen.width*0.035,
                            }}
                            xml={ExpandWhite}
                          />
                        </TouchableOpacity>
                      }
                    >
                      <TouchableOpacity
                        style={Styles.expandPopover}
                        onPress={() => {
                          this.showUserMenu=false;
                          this.isEditProfile=true;
                        }}
                      >
                        <Text style={Styles.prefBtnText}>Edit</Text>
                      </TouchableOpacity>
                    </Popover>
                  </View>
                  <View style={Styles.userView}>
                    <View style={Styles.userProfileView}>
                      <View style={Styles.profileRow1}>
                        <Avatar
                          rounded
                          icon={{
                            name: "user",
                            type: "font-awesome",
                            color: "#CDCDCD",
                          }}
                          activeOpacity={1}
                          containerStyle={Styles.userPic}
                          size="large"

                          source={{
                            uri: this.image?.length>0? this.image:null,
                          }}
                        // onPress={this.handlePhotoUpload}
                        />
                        <View>
                          <Text style={Styles.userName}>
                            {this.props.account.loggedInUser?.name}
                          </Text>
                          <Text style={Styles.userEmail}>
                            {this.props.account.loggedInUser?.username}
                          </Text>
                        </View>
                      </View>
                      <Text style={Styles.userBio}>
                        Bio -{this.props.account.loggedInUser?.about}
                      </Text>
                    </View>
                    <View style={Styles.userProfileView}>
                      <View style={Styles.profileRow1}>
                        <Text style={Styles.userPrefTitle}>MY PREFERENCES</Text>
                        <View style={{flexGrow: 1}} />
                        <TouchableOpacity onPress={this.handleEditUserPref}>
                          <Text style={Styles.userPrefEdit}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={Styles.userPrefRow}>
                        {this.sustainabilityPref
                          .filter(
                            (pref, p) =>
                              this.props.account.loggedInUser?.preferences?.indexOf(
                                pref.id
                              )>-1
                          )
                          .map((prefItem, pf) => (
                            <View
                              key={`prefItem-${pf}`}
                              style={Styles.userPrefView}
                            >
                              <FastImage
                                style={{...Styles.logoImg}}
                                source={prefItem.icon}
                              />
                              <Text style={Styles.userPrefName}>
                                {prefItem.title}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </View>

                    <View
                      style={{
                        paddingVertical: screen.height*0.025,
                        paddingHorizontal: screen.width*0.053,
                        flexGrow: 1,
                        height: screen.height*0.5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.props.routing.push("/favRestaurants")
                        }
                      >
                        <View style={Styles.userMenuItem}>
                          <SvgCss
                            xml={FavResIcon}
                            style={{
                              height: screen.height*0.025,
                              width: screen.height*0.0275,
                              marginRight: screen.height*0.02,
                            }}
                          />
                          <Text style={Styles.userMenuItemText}>
                            FAVOURITE RESTAURANTS
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.props.routing.push("/savedAddress")}
                      >
                        <View style={Styles.userMenuItem}>
                          <SvgCss
                            xml={LocationIcon}
                            style={{
                              height: screen.height*0.0314,
                              width: screen.height*0.0225,
                              marginRight: screen.height*0.02,
                            }}
                          />
                          <Text style={Styles.userMenuItemText}>
                            SAVED ADDRESSES
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.props.routing.push("/raisedIssues")}
                      >
                        <View style={Styles.userMenuItem}>
                          <SvgCss
                            xml={UserIssuesIcon}
                            style={{
                              height: screen.height*0.025,
                              width: screen.height*0.025,
                              marginRight: screen.height*0.02,
                            }}
                          />
                          <Text style={Styles.userMenuItemText}>
                            RAISED ISSUES
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.props.routing.push("/help")}
                      >
                        <View style={Styles.userMenuItem}>
                          <SvgCss
                            xml={HelpIcon}
                            style={{
                              height: screen.height*0.0251,
                              width: screen.height*0.0251,
                              marginRight: screen.height*0.02,
                            }}
                          />
                          <Text style={Styles.userMenuItemText}>HELP</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => (this.isLogoutDialog=true)}
                      >
                        <View style={Styles.userMenuItem}>
                          <SvgCss
                            xml={LogoutIcon}
                            style={{
                              height: screen.height*0.03,
                              width: screen.height*0.02778,
                              marginRight: screen.height*0.02,
                            }}
                          />
                          <Text style={Styles.userMenuItemText}>LOGOUT</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )
          ):null}
          {!this.isEditPreferences? (
            <>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 0, y: 0}}
                colors={["#F4F4F4", "#FFF"]}
                style={{
                  height: screen.height*0.005,
                  width: "100%",
                  position: "absolute",
                  bottom: screen.height*0.09,
                }}
              ></LinearGradient>
              <View style={Styles.homeFooter}>
                <TouchableOpacity
                  style={
                    this.selectedMenu=="HOME"
                      ? Styles.homeIconBtnSelected
                      :Styles.homeIconBtn
                  }
                  onPress={() => this.handleFooterMenu("HOME")}
                >
                  <SvgCss
                    xml={
                      this.selectedMenu=="HOME"? HomeIconSelected:HomeIcon
                    }
                    style={Styles.homeIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.selectedMenu=="SEARCH"
                      ? Styles.homeIconBtnSelected
                      :Styles.homeIconBtn
                  }
                  onPress={() => this.handleFooterMenu("SEARCH")}
                >
                  <SvgCss xml={HomeSearchIcon} style={Styles.searchIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.selectedMenu=="PREF"
                      ? Styles.homeIconBtnSelected
                      :Styles.homeIconBtn
                  }
                  onPress={() => this.handleFooterMenu("PREF")}
                >
                  <SvgCss
                    xml={
                      this.selectedMenu=="PREF"
                        ? HomePrefIconSelected
                        :HomePrefIcon
                    }
                    style={Styles.prefIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.selectedMenu=="USER"
                      ? Styles.homeIconBtnSelected
                      :Styles.homeIconBtn
                  }
                  onPress={() => this.handleFooterMenu("USER")}
                >
                  <SvgCss
                    xml={
                      this.selectedMenu=="USER"
                        ? HomeUserIconSelected
                        :HomeUserIcon
                    }
                    style={Styles.homeIcon}
                  />
                </TouchableOpacity>
              </View>
            </>
          ):null}
          <Overlay
            fullScreen
            isVisible={this.isSearchRestaurant}
            overlayStyle={{
              backgroundColor: "#fff",
              // justifyContent: "flex-end",
              // paddingHorizontal: 0,
              // position: "relative",
            }}
            backdropStyle={
              {
                // backgroundColor:'transparent',
              }
            }
            onBackdropPress={() => {
              this.selectedMenu="HOME"
              this.isSearchRestaurant=false
            }}
          >
            {/* <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            > */}
            <>
              <View>

                <View style={{
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  alignItems: "center",
                  borderRadius: 10,
                  // paddingRight:10
                }}>
                  <TouchableOpacity
                    style={Styles.backIconBtn}
                    onPress={() => {
                      this.isSearchRestaurant=false;
                      this.selectedMenu="HOME";
                    }}
                  >
                    <FeatherIcon name="chevron-left" size={22} />
                    {/* <SvgCss style={Styles.backIcon} xml={BackArrowWhite} /> */}
                  </TouchableOpacity>
                  <TextInput

                    style={Styles.searchTextSec}
                    autoFocus={true}
                    onChangeText={(text) =>
                      this.handleVerdantRestaurantSearch(text)
                    }
                    value={this.searchText}
                  />
                  <SvgCss
                    style={{
                      width: screen.width*0.044,
                      height: screen.width*0.044,
                      marginRight: 50,
                    }}
                    xml={SearchIcon}
                  />
                </View>
              </View>

              <View style={Styles.overlayView}>

                <View
                  style={{
                    // position: "absolute",
                    // bottom: 0+this.keyboardHeight,
                    marginTop: 10
                  }}
                >
                  {this.restaurantSearchResults.length>0? (
                    <FlatList
                      // style={{
                      //   ...Styles.searchFlatList,
                      //   maxHeight: this.searchResultHeight,
                      // }}
                      data={this.restaurantSearchResults}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => this.handleSelectRestaurant(item.id)}
                          style={Styles.searchResItem}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {item.photo.trim().length>0? (
                              <FastImage
                                style={Styles.searchResPic}
                                source={{uri: item.photo}}
                              />
                            ):(
                              <FastImage
                                style={Styles.searchResPic}
                                source={require("../assets/images/nonVerdantIcon.png")}
                              />
                            )}
                            <View>
                              <Text style={{...Styles.restaurantName}}>
                                {item.name.split(",")[0]}
                              </Text>
                              <View style={{flexDirection: "row"}}>
                                <View style={Styles.searchRatingSection}>
                                  <Text style={Styles.restaurantRating}>{`${Math.round(item.distance/100)/10
                                    } km`}</Text>
                                  <SvgCss xml={Dot} style={Styles.dot} />
                                  <Text
                                    style={{
                                      ...Styles.searchResKeywords,
                                      width: screen.width*0.4266,
                                    }}
                                  >
                                    {`${item.keywords
                                      .slice(0, 3)
                                      .join(", ")
                                      .toLowerCase()
                                      .replace("_", " ")}${item.keywords.length>3? "..":""
                                      }`}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginTop: screen.height*0.01,
                                }}
                              >
                                {item.susPref.length<=6? (
                                  <>
                                    {sustainabilityPref
                                      .filter((sp) =>
                                        item.susPref.includes(sp.id)
                                      )
                                      .slice(0, 6)
                                      .map((pref, p) => (
                                        <FastImage
                                          key={`searchResPref-${p}`}
                                          style={{
                                            width: screen.width*0.0744,
                                            height: screen.width*0.0707,
                                            borderRadius:
                                              screen.width*0.0744*0.5,
                                            marginRight: screen.width*0.04,
                                          }}
                                          source={pref.icon}
                                        />
                                      ))}
                                  </>
                                ):(
                                  <>
                                    {sustainabilityPref
                                      .filter((sp) =>
                                        item.susPref.includes(sp.id)
                                      )
                                      .slice(0, 5)
                                      .map((pref, p) => (
                                        <FastImage
                                          key={`searchResPref-${p}`}
                                          style={{
                                            width: screen.width*0.0744,
                                            height: screen.width*0.0707,
                                            borderRadius:
                                              screen.width*0.0744*0.5,
                                            marginRight: screen.width*0.04,
                                          }}
                                          source={pref.icon}
                                        />
                                      ))}
                                    <View
                                      style={{
                                        width: screen.width*0.0744,
                                        height: screen.width*0.0707,
                                        borderRadius:
                                          screen.width*0.0744*0.5,
                                        backgroundColor: "#F7F7F7",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          ...Styles.searchResKeywords,
                                          color: "#B8BAB6",
                                        }}
                                      >
                                        {`+${item.susPref.length-5}`}
                                      </Text>
                                    </View>
                                  </>
                                )}
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  ):null}

                </View>
              </View>
            </>
            {/* </TouchableWithoutFeedback> */}
          </Overlay>
          <Overlay
            fullScreen
            isVisible={this.isSelectFriends}
            overlayStyle={{
              backgroundColor: "#FFF",
              paddingHorizontal: 0,
              position: "relative",
            }}
          >
            <View style={Styles.prefView}>
              <TouchableOpacity
                onPress={() => (this.isSelectFriends=false)}
                style={{alignSelf: "flex-start", marginVertical: 24}}
              >
                <SvgCss
                  style={{
                    width: screen.width*0.048,
                    height: screen.width*0.035,
                  }}
                  xml={BackArrowGrey}
                />
              </TouchableOpacity>
              <Text style={Styles.headTextSF}>
                select <Text style={{fontWeight: "400"}}>friends</Text>
              </Text>
              <Text style={Styles.labelTextSF}>
                Tap on friends you want to eat out with.
              </Text>
              <View style={Styles.searchViewSF}>
                <Image
                  style={{
                    width: screen.width*0.044,
                    height: screen.width*0.044,
                    marginRight: 10,
                  }}
                  source={require("../assets/images/search_icon.png")}
                />
                <TextInput
                  placeholder="Search friends"
                  value={this.searchFriend}
                  onChangeText={(text) => this.handleSearchFriends(text)}
                  selectionColor="#D4D4D4"
                  multiline={true}
                  // onFocus={()=>this.textLineColour='#2E4E5B'}
                  placeholderTextColor="#A8AAA5"
                  style={{
                    width: screen.width*0.75,
                    height: screen.height*0.025,
                    backgroundColor: "#FFF",
                    padding: 0,
                    color: "#2E4E5B",
                  }}
                />
              </View>
              <ScrollView
                style={{
                  marginVertical: screen.height*0.01874,
                  width: screen.width*0.896,
                }}
              >
                {this.filteredFriendsList.map((friend, f) => (
                  <TouchableOpacity
                    key={friend.id}
                    onPress={() => this.onFriendClick(friend)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginVertical: screen.height*0.00874,
                      width: screen.width*0.896,
                      borderBottomWidth: 1,
                      borderStyle: "solid",
                      borderBottomColor: "#DFE0DC",
                      paddingTop: screen.height*0.01,
                      paddingBottom: screen.height*0.02,
                      paddingHorizontal: screen.width*0.05,
                      backgroundColor: friend.selected? "#F8FCDE":"#FFF",
                      borderRadius: 10,
                    }}
                  >
                    <View style={{marginRight: screen.width*0.0267}}>
                      <FastImage style={Styles.logoImg} source={friend.icon} />
                    </View>
                    <View
                      style={{
                        width: screen.width*0.4267,
                        marginRight: screen.width*0.05,
                      }}
                    >
                      <Text
                        style={{
                          color: "#636661",
                          fontSize: 16,
                          lineHeight: screen.height*0.0375,
                        }}
                      >
                        {friend.name}
                      </Text>
                      <Text
                        style={{
                          color: "#858783",
                          fontSize: 12,
                          lineHeight: screen.height*0.027,
                        }}
                      >
                        {friend.description}
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginTop: screen.height*0.015,
                        }}
                      >
                        {friend.preferences.map((pref) => (
                          <FastImage
                            key={pref.id}
                            style={Styles.prefImg}
                            source={pref.icon}
                          />
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
                  style={Styles.nextBtn}
                  onPress={this.doneFriendsSelection}
                >
                  <Text style={{...Styles.loginBtnText, fontWeight: "600"}}>
                    DONE
                  </Text>
                </TouchableOpacity>
              </DropShadow>
            </View>
          </Overlay>
          <Overlay
            fullScreen
            isVisible={this.isFilterView}
            onBackdropPress={() => (this.isFilterView=false)}
            overlayStyle={{
              backgroundColor: "transparent",
              paddingHorizontal: 0,
              position: "relative",
            }}
          >
            <View style={Styles.filterView}>
              <View
                style={{
                  paddingHorizontal: screen.width*0.0587,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={this.handleCloseFilter}
                  style={{
                    width: screen.height*0.03,
                    height: screen.height*0.03,
                  }}
                >
                  <SvgCss
                    style={{
                      width: screen.height*0.02,
                      height: screen.height*0.02,
                    }}
                    xml={Close}
                  />
                </TouchableOpacity>
              </View>
              {this.selectedFilter=="CRITERIA"? (
                <ScrollView
                  style={{
                    height: screen.height*0.3966,
                    paddingHorizontal: screen.width*0.0587,
                  }}
                  contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    alignItems: "flex-end",
                  }}
                >
                  {this.sustainabilityPref.map((item, pf) => (
                    <TouchableOpacity
                      key={`item-${pf}`}
                      onPress={() => this.handleFilterPrefSelect(item.id)}
                      style={{
                        marginVertical: screen.height*0.02,
                        height: screen.width*0.27,
                        width: screen.width*0.27,
                        padding: screen.width*0.01,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: this.filteredPrefList.find(
                          (p) => p.id==item.id
                        )
                          ? "#F2F3F1"
                          :"transparent",
                      }}
                    >
                      <FastImage style={Styles.logoImg} source={item.icon} />
                      <Text style={Styles.userPrefName}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ):this.selectedFilter=="PRICE"? (
                <View
                  style={{
                    height: screen.height*0.3966,
                    paddingHorizontal: screen.width*0.0587,
                    paddingBottom: screen.height*0.064,
                    flexDirection: "row",
                    // flexWrap:'wrap',
                    justifyContent: "space-evenly",
                    alignItems: "flex-end",
                  }}
                >
                  {priceList.map((price, p) => (
                    <TouchableOpacity
                      key={`price-${p}`}
                      style={{
                        height: screen.width*0.1653,
                        width: screen.width*0.1653,
                      }}
                      onPress={() => this.handleFilterPriceSelect(price.id)}
                    >
                      <SvgCss
                        style={{
                          ...Styles.priceLogoImg,
                          marginVertical: screen.height*0.02,
                        }}
                        xml={
                          this.filteredPriceList.find((p) => p.id==price.id)
                            ? price.selectedIcon
                            :price.icon
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ):this.selectedFilter=="CUISINE"? (
                <ScrollView
                  style={{
                    height: screen.height*0.3966,
                    paddingHorizontal: screen.width*0.0587,
                  }}
                  contentContainerStyle={
                    {
                      // flexDirection:'row',
                      // flexWrap:'wrap',
                      // justifyContent:'space-evenly',
                      // alignItems: 'flex-end',
                    }
                  }
                >
                  {cuisinesList.map((cuisine, c) => (
                    <View
                      style={{
                        flexDirection: "row",
                        height: screen.height*0.04,
                        marginVertical: screen.height*0.01,
                        backgroundColor:
                          this.filteredCuisineList.findIndex(
                            (c) => c.id==cuisine.id
                          )>-1
                            ? "#F1F4F5"
                            :"#FFF",
                        alignItems: "center",
                      }}
                      key={`cuisine-${cuisine.id}`}
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
                          this.filteredCuisineList.findIndex(
                            (c) => c.id==cuisine.id
                          )>-1
                        }
                        onPress={() =>
                          this.handleFilterCuisineSelect(cuisine.id)
                        }
                      />
                      <Text
                        onPress={() =>
                          this.handleFilterCuisineSelect(cuisine.id)
                        }
                        style={{
                          color: "#858783",
                          fontSize: screen.height*0.018,
                          lineHeight: screen.height*0.02,
                          fontFamily: "Poppins-Light",
                        }}
                      >
                        {cuisine.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ):this.selectedFilter=="DIET"? (
                <ScrollView
                  style={{
                    height: screen.height*0.3966,
                    paddingHorizontal: screen.width*0.0587,
                  }}
                >
                  {dietList.map((diet, d) => (
                    <View
                      style={{
                        flexDirection: "row",
                        height: screen.height*0.04,
                        marginVertical: screen.height*0.01,
                        backgroundColor:
                          this.filteredDietList.findIndex(
                            (i) => i.id==diet.id
                          )>-1
                            ? "#F1F4F5"
                            :"#FFF",
                        alignItems: "center",
                      }}
                      key={`diet-${diet.id}`}
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
                        // checked={false}
                        checked={
                          this.filteredDietList.findIndex(
                            (dietary) => dietary.id==diet.id
                          )>-1
                        }
                        onPress={() => this.handleFilterDietSelect(diet.id)}
                      />
                      <Text
                        onPress={() => this.handleFilterDietSelect(diet.id)}
                        style={{
                          color: "#858783",
                          fontSize: screen.height*0.018,
                          lineHeight: screen.height*0.02,
                          fontFamily: "Poppins-Light",
                        }}
                      >
                        {diet.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ):this.selectedFilter=="SERVICE"? (
                <ScrollView
                  style={{
                    height: screen.height*0.3966,
                    paddingHorizontal: screen.width*0.0587,
                  }}
                >
                  {saList.map((sa, s) => (
                    <View
                      style={{
                        flexDirection: "row",
                        height: screen.height*0.04,
                        marginVertical: screen.height*0.01,
                        backgroundColor:
                          this.filteredSAList.findIndex((i) => i.id==sa.id)>
                            -1
                            ? "#F1F4F5"
                            :"#FFF",
                        alignItems: "center",
                      }}
                      key={`sa-${sa.id}`}
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
                        // checked={false}
                        checked={
                          this.filteredSAList.findIndex(
                            (service) => service.id==sa.id
                          )>-1
                        }
                        onPress={() => this.handleFilterSASelect(sa.id)}
                      />
                      <Text
                        onPress={() => this.handleFilterSASelect(sa.id)}
                        style={{
                          color: "#858783",
                          fontSize: screen.height*0.018,
                          lineHeight: screen.height*0.02,
                          fontFamily: "Poppins-Light",
                        }}
                      >
                        {sa.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ):null}
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: screen.width*0.0587,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => (this.selectedFilter="CRITERIA")}
                  style={{
                    paddingVertical: screen.height*0.02,
                    borderBottomWidth:
                      this.selectedFilter=="CRITERIA"? 2:0,
                    borderBottomColor: "#707070",
                    borderStyle: "solid",
                  }}
                >
                  <Text
                    style={{
                      color: "#636661",
                      fontSize: screen.height*0.014,
                      fontFamily: "Poppins-Regular",
                      lineHeight: screen.height*0.025,
                      textAlign: "center",
                    }}
                  >
                    Sustainability
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => (this.selectedFilter="PRICE")}
                  style={{
                    paddingVertical: screen.height*0.02,
                    borderBottomWidth: this.selectedFilter=="PRICE"? 2:0,
                    borderBottomColor: "#707070",
                    borderStyle: "solid",
                  }}
                >
                  <Text
                    style={{
                      color: "#636661",
                      fontSize: screen.height*0.014,
                      fontFamily: "Poppins-Regular",
                      lineHeight: screen.height*0.025,
                      minWidth: screen.width*0.136,
                      textAlign: "center",
                    }}
                  >
                    Price
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => (this.selectedFilter="CUISINE")}
                  style={{
                    paddingVertical: screen.height*0.02,
                    borderBottomWidth: this.selectedFilter=="CUISINE"? 2:0,
                    borderBottomColor: "#707070",
                    borderStyle: "solid",
                  }}
                >
                  <Text
                    style={{
                      color: "#636661",
                      fontSize: screen.height*0.014,
                      fontFamily: "Poppins-Regular",
                      lineHeight: screen.height*0.025,
                      minWidth: screen.width*0.136,
                      textAlign: "center",
                    }}
                  >
                    Cuisines
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => (this.selectedFilter="DIET")}
                  style={{
                    paddingVertical: screen.height*0.02,
                    borderBottomWidth: this.selectedFilter=="DIET"? 2:0,
                    borderBottomColor: "#707070",
                    borderStyle: "solid",
                  }}
                >
                  <Text
                    style={{
                      color: "#636661",
                      fontSize: screen.height*0.014,
                      fontFamily: "Poppins-Regular",
                      lineHeight: screen.height*0.025,
                      minWidth: screen.width*0.136,
                      textAlign: "center",
                    }}
                  >
                    Dietary
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => (this.selectedFilter="SERVICE")}
                  style={{
                    paddingVertical: screen.height*0.02,
                    borderBottomWidth: this.selectedFilter=="SERVICE"? 2:0,
                    borderBottomColor: "#707070",
                    borderStyle: "solid",
                  }}
                >
                  <Text
                    style={{
                      color: "#636661",
                      fontSize: screen.height*0.014,
                      fontFamily: "Poppins-Regular",
                      lineHeight: screen.height*0.025,
                      flexWrap: "wrap",
                      maxWidth: screen.width*0.165,
                      textAlign: "center",
                    }}
                  >{`Services & Ambiance`}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: screen.width*0.0587,
                  height: screen.height*0.055,
                  borderTopColor: "#D1D3CD",
                  borderStyle: "solid",
                  borderTopWidth: 1,
                }}
              ></View>
              <TouchableOpacity
                style={{
                  marginHorizontal: screen.width*0.0587,
                  height: screen.height*0.06,
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "solid",
                  borderColor: "#2E4E5B",
                  borderWidth: 1,
                  borderRadius: 10,
                }}
                onPress={this.handleApplyFilters}
              >
                <Text
                  style={{
                    fontSize: screen.height*0.02,
                    fontFamily: "Poppins-Medium",
                    color: "#447682",
                    lineHeight: screen.height*0.03,
                  }}
                >
                  DONE
                </Text>
              </TouchableOpacity>
            </View>
          </Overlay>
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
              Login/Register to continue..
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

          <Overlay
            isVisible={this.isLogoutDialog}
            overlayStyle={{
              alignItems: "center",
              justifyContent: "center",
              width: screen.width*0.84,
              // height: screen.width*.8533
              borderRadius: screen.height*0.04,
            }}
          >
            <Text style={Styles.overlayText}>
              You are about to logout from Verdantips. {"\n"}Click NO to cancel
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: screen.width*0.6933,
              }}
            >
              <TouchableOpacity style={Styles.yesBtn} onPress={this.logout}>
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
                  onPress={() => (this.isLogoutDialog=false)}
                >
                  <Text style={Styles.noBtnText}>NO</Text>
                </TouchableOpacity>
              </DropShadow>
            </View>
          </Overlay>
        </>
      </>
    );
  }
}
