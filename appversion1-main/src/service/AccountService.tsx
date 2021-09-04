import { observable } from "mobx";
import auth, { FirebaseAuthTypes, firebase } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin, statusCodes } from "react-native-google-signin";

import { LoginManager, AccessToken } from "react-native-fbsdk";
import Storage from "react-native-storage";
import AsyncStorage from "@react-native-community/async-storage";

const storage = new Storage({
  // maximum capacity, default 1000
  size: 1000,

  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage, // for web: window.localStorage

  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: null,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // we'll talk about the details later.
  },
});

function validateEmail(email: string): boolean {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}
export const GOOGLE_PLACES_API_KEY = "AIzaSyATGUcU1eNhyVHVIF8r6o7Nae9dD9jtbU0";

export type SignupResult =
  | "SUCCESS"
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "CONFIRM_PASSWORD_MISMATCH"
  | "INVALID_NAME"
  | "EMAIL_IN_USE"
  | "WEEK_PASSWORD"
  | "UNKNOWN_ERROR";
export type PasswordResetResult =
  | "SUCCESS"
  | "INVALID_EMAIL"
  | "NO_SUCH_USER"
  | "UNKNOWN_ERROR";
export type LoginResult =
  | "SUCCESS"
  | "INVALID_EMAIL"
  | "NO_SUCH_USER"
  | "INVALID_PASSWORD"
  | "UNKNOWN_ERROR";
export type UpdateResult = "SUCCESS" | "UNKNOWN_ERROR";
export type DeleteResult = "SUCCESS" | "UNKNOWN_ERROR";
export type AutoLoginResult =
  | "SUCCESS"
  | "INVALID_EMAIL"
  | "NO_SUCH_USER"
  | "INVALID_PASSWORD"
  | "USER_ALREADY_EXISTS"
  | "UNKNOWN_ERROR"
  | "TRY_AFTER_SOMETIME";

export type Location = {
  lat: number;
  lng: number;
  description: string;
  tag: string;
};

export default class AccountService {
  constructor() {
    GoogleSignin.configure({
      scopes: ["email"],
      webClientId:
        "833571377199-rpgvjdc8jodu927q8rvcks7me9rvcdji.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }

  public get user(): FirebaseAuthTypes.User {
    return this._user;
  }

  @observable
  private _user: FirebaseAuthTypes.User = null;

  @observable
  email: string = "";

  @observable
  password: string = "";

  @observable
  loggedInUser = null;

  @observable
  googleLoggedIn = false;

  @observable
  googleUserInfo;

  @observable
  userLocation: Location;

  @observable
  dineInFriendsList = [];

  @observable
  filteredCuisineList = [];

  @observable
  filteredDietList = [];

  @observable
  filteredPriceList = [];

  @observable
  filteredPrefList = [];

  @observable
  filteredSAList = [];

  async autoSignInWithUID(
    uid: string,
    password: string,
    googleCred: any,
    fbCred: any
  ): Promise<AutoLoginResult> {
    try {
      let dbUser = await firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((data) => data.data());
      console.log(dbUser);
      if (dbUser.userType == "EMAIL") {
        let userCred = await auth().signInWithEmailAndPassword(
          dbUser.username,
          password
        );

        this._user = userCred.user;
        console.log(this._user);
      } else if (dbUser.userType == "GOOGLE") {
        console.log("GOOGLE-autoSignInWithUID");
        // let {idToken,accessToken} = await GoogleSignin.getTokens();
        // const credential = auth.GoogleAuthProvider.credential(
        //     idToken,
        //     accessToken,
        // );
        console.log(googleCred);
        let userCred = await auth().signInWithCredential(googleCred);
        this._user = userCred.user;
      } else if (dbUser.userType == "FACEBOOK") {
        // const data = await AccessToken.getCurrentAccessToken();

        // if (!data) {
        //   throw 'Something went wrong obtaining access token';
        // }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(fbCred);

        // Sign-in the user with the credential
        let userCred = await auth().signInWithCredential(facebookCredential);
        this._user = userCred.user;
      }
      firestore()
        .collection("users")
        .doc(this._user.uid)
        .onSnapshot(
          (QuerySnapshot) => {
            this.loggedInUser = QuerySnapshot.data();
            console.log(this.loggedInUser);
          },
          (error) => console.log(error)
        );

      return "SUCCESS";
    } catch (error) {
      console.log(error);
      if (error.code === "auth/wrong-password") {
        console.log("The password is invalid!");
        return "INVALID_PASSWORD";
      }
      if (error.code === "auth/invalid-email") {
        console.log("The email does not exists!");
        return "INVALID_EMAIL";
      }
      if (error.code === "auth/user-not-found") {
        console.log("That email is invalid!");
        return "INVALID_EMAIL";
      }

      if (error.code === "auth/user-disabled") {
        console.log("That user is disabled!");
        return "NO_SUCH_USER";
      }

      return "UNKNOWN_ERROR";
    }
  }

  _googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
       const userInfo = await GoogleSignin.signIn();
       this.googleUserInfo = userInfo;
      this.googleLoggedIn = true;
      let { idToken, accessToken } = await GoogleSignin.getTokens();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );
       storage.save({
        key: "googleCred",
        data: credential,
        expires: null,
      });
      let userCred = await auth().signInWithCredential(credential);
      this._user = userCred.user;
      let userExists = (
        await firestore().collection("users").doc(this._user.uid).get()
      ).exists;
      if (userExists) {
        firestore()
          .collection("users")
          .doc(this._user.uid)
          .onSnapshot(
            (QuerySnapshot) => {
              this.loggedInUser = QuerySnapshot.data();
              console.log(this.loggedInUser);
            },
            (error) => console.log(error)
          );
        return "SUCCESS_EXISTS";
      } else {
        await firestore().collection("users").doc(this._user.uid).set({
          id: this._user.uid,
          username: this._user.email,
          firstName: userCred.additionalUserInfo.profile.given_name,
          lastName: userCred.additionalUserInfo.profile.family_name,
          photoUrl: this._user.photoURL,
          userType: "GOOGLE",
          profilePic: "",
        });
        firestore()
          .collection("users")
          .doc(this._user.uid)
          .onSnapshot(
            (QuerySnapshot) => {
              this.loggedInUser = QuerySnapshot.data();
              console.log(this.loggedInUser);
            },
            (error) => console.log(error)
          );
        return "SUCCESS_NOT_EXISTS";
      }

     } catch (error) {
       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("Cancel");
        return "CANCEL";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        console.log("Signin in progress");
        return "PROGRESS";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log("PLAY_SERVICES_NOT_AVAILABLE");
        return "PLAY_SERVICES_NOT_AVAILABLE";
      } else {
        // some other error happened
        console.log(error);
        return "ERROR";
      }
    }
  };

  googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.googleUserInfo = null;
      this.googleLoggedIn = false;
    } catch (error) {
      console.error(error);
    }
  };

  // Attempt a login using the Facebook login dialog asking for default permissions.
  async _fbSignIn() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      return "User cancelled the login process";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    storage.save({
      key: "fbCred",
      data: data.accessToken,
      expires: null,
    });
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // Sign-in the user with the credential
    let userCred = await auth().signInWithCredential(facebookCredential);
    this._user = userCred.user;
    let userExists = (
      await firestore().collection("users").doc(this._user.uid).get()
    ).exists;
    if (userExists) {
      firestore()
        .collection("users")
        .doc(this._user.uid)
        .onSnapshot(
          (QuerySnapshot) => {
            this.loggedInUser = QuerySnapshot.data();
            console.log(this.loggedInUser);
          },
          (error) => console.log(error)
        );
      return "SUCCESS_EXISTS";
    } else {
      await firestore().collection("users").doc(this._user.uid).set({
        id: this._user.uid,
        username: this._user.email,
        firstName: userCred.additionalUserInfo.profile.given_name,
        lastName: userCred.additionalUserInfo.profile.family_name,
        photoUrl: this._user.photoURL,
        userType: "FACEBOOK",
        profilePic: "",
      });
      firestore()
        .collection("users")
        .doc(this._user.uid)
        .onSnapshot(
          (QuerySnapshot) => {
            this.loggedInUser = QuerySnapshot.data();
            console.log(this.loggedInUser);
          },
          (error) => console.log(error)
        );
      return "SUCCESS_NOT_EXISTS";
    }

    // await firestore().collection('users').doc(this._user.uid).set({
    //   id: this._user.uid,
    //   username: this._user.email,
    //   firstName: userCred.additionalUserInfo.profile.given_name,
    //   lastName: userCred.additionalUserInfo.profile.family_name,
    //   photoUrl: this._user.photoURL,
    //   userType: 'FACEBOOK'
    // })
    // firestore().collection('users').doc(this._user.uid).onSnapshot((QuerySnapshot)=>{
    //   this.loggedInUser = QuerySnapshot.data()
    //   console.log(this.loggedInUser)
    // },error=>console.log(error))
    // return 'SUCCESS'
  }

  async signUp(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<SignupResult> {
    if (!validateEmail(email)) {
      return "INVALID_EMAIL";
    }

    if (password.length < 6) {
      return "INVALID_PASSWORD";
    }

    if (password != confirmPassword) {
      return "CONFIRM_PASSWORD_MISMATCH";
    }

    try {
      let userCred = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      this._user = userCred.user;
       await firestore().collection("users").doc(this._user.uid).set({
        id: this._user.uid,
        username: this._user.email,
        // firstName: name.split(' ')[0],
        // lastName: name.split(' ')[name.split(' ').length-1],
        // fullName: name,
        photoUrl: this._user.photoURL,
        userType: "EMAIL",
        profilePic: "",
      });
      firestore()
        .collection("users")
        .doc(this._user.uid)
        .onSnapshot(
          (QuerySnapshot) => {
            this.loggedInUser = QuerySnapshot.data();
            console.log(this.loggedInUser);
          },
          (error) => console.log(error)
        );
      this.email = email;
      this.password = password;

      return "SUCCESS";
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
        return "EMAIL_IN_USE";
      } else if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
        return "INVALID_EMAIL";
      } else if (error.code == "auth/weak-password") {
        console.log("That email address is invalid!");
        return "WEEK_PASSWORD";
      } else {
        return "UNKNOWN_ERROR";
      }
    }
  }

  async signInWithEmail(email: string, password: string): Promise<LoginResult> {
    if (!validateEmail(email)) {
      return "INVALID_EMAIL";
    }

    if (password.length < 8) {
      return "INVALID_PASSWORD";
    }
    try {
      let userCred = await auth().signInWithEmailAndPassword(email, password);

      this._user = userCred.user;
      console.log(this._user);
      firestore()
        .collection("users")
        .doc(this._user.uid)
        .onSnapshot(
          (QuerySnapshot) => {
            this.loggedInUser = QuerySnapshot.data();
            console.log(this.loggedInUser);
          },
          (error) => console.log(error)
        );
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      if (error.code === "auth/wrong-password") {
        console.log("The password is invalid!");
        return "INVALID_PASSWORD";
      }
      if (error.code === "auth/invalid-email") {
        console.log("The email does not exists!");
        return "INVALID_EMAIL";
      }
      if (error.code === "auth/user-not-found") {
        console.log("That email is invalid!");
        return "INVALID_EMAIL";
      }

      if (error.code === "auth/user-disabled") {
        console.log("That user is disabled!");
        return "NO_SUCH_USER";
      }
      return "UNKNOWN_ERROR";
    }
  }

  async sendPasswordResetMail(email: string): Promise<PasswordResetResult> {
    if (!validateEmail(email)) {
      return "INVALID_EMAIL";
    }
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      let url = `https://us-central1-verdantips-app.cloudfunctions.net/passwordResetMail?${encodeURIComponent(
        "dest"
      )}=${encodeURIComponent(email)}`;
      let result = await fetch(url);
      console.log(result);
      console.log(this._user);
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        console.log("That email is invalid!");
        return "INVALID_EMAIL";
      }

      if (error.code === "auth/user-not-found") {
        console.log("The user is missing!");
        return "NO_SUCH_USER";
      }
      return "UNKNOWN_ERROR";
    }
  }

  async resetPassword(code, password): Promise<PasswordResetResult> {
    try {
      let url =
        "https://us-central1-verdantips-app.cloudfunctions.net/passwordReset";
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({ emailId: code, password: password }),
      });

      return "SUCCESS";
    } catch (error) {
      console.log(error);
      return "UNKNOWN_ERROR";
    }
  }

  async updateUserProfileDetails(updateObj): Promise<UpdateResult> {
    try {
      console.log("updateObj,",updateObj);
      await firestore()
        .collection("users")
        .doc(this._user.uid)
        .update(updateObj);
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      return "UNKNOWN_ERROR";
    }
  }

  async addUserAddressToList(locationObj): Promise<UpdateResult> {
    try {
      console.log("addUserAddressToList", locationObj);
      // let addressList = (await firestore().collection('users').doc(this._user.uid)
      // .collection('addressList').get()).docs.map(doc=>Object.assign(doc.data(),{id: doc.id}))
      // if(addressList.length==0){
      await firestore()
        .collection("users")
        .doc(this._user.uid)
        .collection("addressList")
        .doc()
        .set(locationObj);
      // }else{

      // }
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      return "UNKNOWN_ERROR";
    }
  }

  async getUserAddressList(): Promise<any[]> {
    try {
      return (
        await firestore()
          .collection("users")
          .doc(this._user.uid)
          .collection("addressList")
          .get()
      ).docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async removeUserAddress(addressId): Promise<UpdateResult> {
    try {
      console.log(addressId);
      await firestore()
        .collection("users")
        .doc(this._user.uid)
        .collection("addressList")
        .doc(addressId)
        .delete();
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      return "UNKNOWN_ERROR";
    }
  }

  async deleteUserAccount(): Promise<DeleteResult> {
    try {
      //delete user obj, auth object
      await firestore().collection("users").doc(this._user.uid).delete();
      await auth().currentUser.delete();
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      return "UNKNOWN_ERROR";
    }
  }

  async addUserMessage(message: string): Promise<UpdateResult> {
    try {
      let datetime = Date.now();
      await firestore()
        .collection("messages")
        .doc(`${this._user.uid}_${datetime}`)
        .set({
          userId: this._user.uid,
          userEmail: this._user.email,
          datetime: datetime,
          message: message,
        });
      return "SUCCESS";
    } catch (error) {
      console.log(error);
      return "UNKNOWN_ERROR";
    }
  }
}
