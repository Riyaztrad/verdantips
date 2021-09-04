import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import { observable } from "mobx";
import autobind from "autobind-decorator";
import {
  TextInput,
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Storage from "react-native-storage";
import AccountService from "../service/AccountService";
import DropShadow from "react-native-drop-shadow";
import { SvgCss } from "react-native-svg";
import { BackArrowGrey } from "../assets/images/backArrowGrey.svg";
import FastImage from "react-native-fast-image";

const screen =
  Platform.OS == "ios" ? Dimensions.get("screen") : Dimensions.get("window");

export const Styles = StyleSheet.create({
  headText: {
    fontSize: screen.height * 0.03,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    color: "#858783",
    width: screen.width * 0.88,
    textAlign: "left",
  },
  labelText: {
    fontSize: screen.height * 0.0175,
    lineHeight: screen.height * 0.025,
    fontWeight: "400",
    color: "#A8AAA5",
    marginVertical: screen.height * 0.021,
  },
  searchView: {
    borderColor: "#D1D3CD",
    borderWidth: 1,
    borderRadius: 5,
    padding: screen.height * 0.01,
    borderStyle: "solid",
    width: screen.width * 0.88,
    height: screen.height * 0.05,
    display: "flex",
    flexDirection: "row",
  },
  logoImg: {
    height: screen.height * 0.069,
    width: screen.height * 0.069,
    // marginVertical: 20
  },
  prefImg: {
    height: screen.width * 0.10795,
    width: screen.width * 0.1138,
    marginHorizontal: screen.width * 0.04,
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
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF", //'#F4F5F6'
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    paddingHorizontal: screen.width * 0.059,
    paddingTop: screen.height * 0.037,
  },
  nextBtn: {
    padding: 10,
    borderRadius: 8,
    // marginHorizontal: 40,
    marginVertical: 22,
    width: screen.width * 0.8787,
    height: screen.height * 0.0735,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#447682",
    position: "absolute",
    bottom: screen.height * 0.036,
  },
  addBtn: {
    // padding: 10,
    borderRadius: 8,
    borderColor: "#D1D3CD",
    borderStyle: "solid",
    borderWidth: 1,
    // marginHorizontal: 40,
    marginVertical: 5,
    width: screen.width * 0.25067,
    height: screen.height * 0.042,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
  },
  addBtnText: {
    color: "#424441",
    fontSize: screen.height * 0.0175,
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
  },
});

type SelectDineInFriendsPageProps = {
  storage?: Storage;
  routing?: RouterStore;
  account?: AccountService;
};

@inject("routing")
@inject("storage")
@inject("account")
@observer
export default class SelectDineInFriendsPage extends React.Component<
  SelectDineInFriendsPageProps,
  {}
> {
  @observable
  searchFriend = "";

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
  friendsList = [];

  @observable
  filteredFriendsList = [];

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
  gotoBack() {
    this.props.routing.push("/home");
  }

  @autobind
  async goNext() {
    console.log(this.friendsList.filter((f) => f.selected));
    this.props.account.dineInFriendsList = [
      ...this.friendsList.filter((f) => f.selected),
    ];
    this.props.routing.push("/home");
  }

  onFriendClick(friend) {
    let selected = friend.selected;
    console.log(friend, this.filteredFriendsList, this.friendsList);
    if (selected) {
      this.filteredFriendsList.find((f) => f.id == friend.id).selected = false;
      this.friendsList.find((f) => f.id == friend.id).selected = false;
    } else {
      this.filteredFriendsList.find((f) => f.id == friend.id).selected = true;
      this.friendsList.find((f) => f.id == friend.id).selected = true;
    }
    console.log("finish", this.filteredFriendsList, this.friendsList);
  }

  handleSearchFriends(text) {
    this.searchFriend = text;
    if (text.trim().length == 0) {
      this.filteredFriendsList = [...this.friendsList];
    } else {
      this.filteredFriendsList = this.friendsList.filter(
        (friend) => friend.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
    }
  }

  componentDidMount() {
    this.friendsList = [
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
    this.filteredFriendsList = [...this.friendsList];
  }

  componentWillUnmount() {
    clearTimeout(this.fn);
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <View style={Styles.screenDiv}>
          <TouchableOpacity
            onPress={this.gotoBack}
            hitSlop={{bottom:10,top:10,right:10,left:10}}
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
            select <Text style={{ fontWeight: "400" }}>friends</Text>
          </Text>
          <Text style={Styles.labelText}>
            Tap on friends you want to eat out with.
          </Text>
          <View style={Styles.searchView}>
            <Image
              style={{
                width: screen.width * 0.044,
                height: screen.width * 0.044,
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
                width: screen.width * 0.75,
                height: screen.height * 0.025,
                backgroundColor: "#FFF",
                padding: 0,
                color: "#2E4E5B",
              }}
            />
          </View>
          <ScrollView
            style={{
              marginVertical: screen.height * 0.01874,
              width: screen.width * 0.896,
            }}
          >
            {this.filteredFriendsList.map((friend, f) => (
              <TouchableOpacity
                key={friend.id}
                onPress={() => this.onFriendClick(friend)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginVertical: screen.height * 0.00874,
                  width: screen.width * 0.896,
                  borderBottomWidth: 1,
                  borderStyle: "solid",
                  borderBottomColor: "#DFE0DC",
                  paddingTop: screen.height * 0.01,
                  paddingBottom: screen.height * 0.02,
                  paddingHorizontal: screen.width * 0.05,
                  backgroundColor: friend.selected ? "#F8FCDE" : "#FFF",
                  borderRadius: 10,
                }}
              >
                <View style={{ marginRight: screen.width * 0.0267 }}>
                  <FastImage style={Styles.logoImg} source={friend.icon} />
                </View>
                <View
                  style={{
                    width: screen.width * 0.4267,
                    marginRight: screen.width * 0.05,
                  }}
                >
                  <Text
                    style={{
                      color: "#636661",
                      fontSize: 16,
                      lineHeight: screen.height * 0.0375,
                    }}
                  >
                    {friend.name}
                  </Text>
                  <Text
                    style={{
                      color: "#858783",
                      fontSize: 12,
                      lineHeight: screen.height * 0.027,
                    }}
                  >
                    {friend.description}
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: screen.height * 0.015,
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
          <TouchableOpacity style={Styles.nextBtn} onPress={this.goNext}>
            <Text style={{ ...Styles.loginBtnText, fontWeight: "600" }}>
              DONE
            </Text>
          </TouchableOpacity>
        </DropShadow>
      </>
    );
  }
}
