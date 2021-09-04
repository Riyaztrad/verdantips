import * as React from 'react'
import { createMemoryHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route, Switch} from 'react-router';
import { observer, Provider} from "mobx-react"
import { observable } from 'mobx'; 
import SplashPage from './auth/SplashPage';
import AccountService from './service/AccountService'; 
import {  StyleSheet,Dimensions, View,  Platform,  Linking  } from 'react-native'; 
import { Provider as PaperProvider } from 'react-native-paper';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import autobind from 'autobind-decorator';
import SignupPage from './auth/SignupPage';
import SigninPage from './auth/SigninPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import HomePage from './auth/HomePage';
import OpenMailPage from './auth/OpenMailPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import ResetSuccessPage from './auth/ResetSuccessPage';
import PersonalDetails1Page from './auth/PersonalDetails1Page';
import PersonalDetails2Page from './auth/PersonalDetails2Page';
import SearchLocationPage from './auth/SearchLocationPage';
import SelectLocationPage from './auth/SelectLocationPage';
import SelectDineInFriendsPage from './auth/SelectDineInFriendsPage';
import RestaurantPage from './auth/RestaurantPage';
import RestaurantService from './service/RestaurantService';
import FavRestaurantsPage from './auth/FavRestaurantsPage';
import IssuesListPage from './auth/IssuesListPage';
import SavedAddressesPage from './auth/SavedAddressesPage';
import HelpPage from './auth/HelpPage';
import OverviewPage from './auth/OverviewPage';
import UseAppPage from './auth/UseAppPage';
import ContactUsPage from './auth/ContactUsPage'; 
var base64 = require('base-64');
var utf8 = require('utf8');

const Styles = StyleSheet.create({
    saViewV: {
        flex: 1, 
        backgroundColor: '#F3F4FC',
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height
    },
    saViewH: {
        flex: 1, 
        backgroundColor: '#fdffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height
    },
}) 
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
    }
  });

const browserHistory = createMemoryHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
const accountService = new AccountService();
const restaurantService = new RestaurantService();

@observer
export default class AppRouter extends React.Component {

    @observable
    loading = false;

    @observable
    style = Styles.saViewV;

    // CheckConnectivity = () => {
    //     // For Android devices
    //     if (Platform.OS === "android") {
    //       NetInfo.isConnected.fetch().then(isConnected => {
    //         if (isConnected) {
    //           Alert.alert("You are online!");
    //         } else {
    //           Alert.alert("You are offline!");
    //         }
    //       });
    //     } else {
    //       // For iOS devices
    //       NetInfo.isConnected.addEventListener(
    //         "connectionChange",
    //         this.handleFirstConnectivityChange
    //       );
    //     }
    //   };
    
    //   handleFirstConnectivityChange = isConnected => {
    //     NetInfo.isConnected.removeEventListener(
    //       "connectionChange",
    //       this.handleFirstConnectivityChange
    //     );
    
    //     if (isConnected === false) {
    //       Alert.alert("You are offline!");
    //     } else {
    //       Alert.alert("You are online!");
    //     }
    //   };

    @autobind
    layoutChange(e){
        const screenHeight = Dimensions.get("screen").height;
        const screenWidth = Dimensions.get("screen").width;
         if(screenWidth>550){
            this.style = Styles.saViewH;
        }else{
            this.style = Styles.saViewV;
        }
    }

    @autobind
    async gotoLogin() {
    //   routingStore.push('/locationSelect')
        let uid = await storage.load({
            key: 'userID'
        }).then(ret=>{
            
            return ret;
        })
        .catch(err => { 
            switch (err.name) {
              case 'NotFoundError':
                return null
                break;
              case 'ExpiredError':
                return null
                break;
            }
          }); 
        if(!uid){
            let appKey = await storage.load({
                key: 'appKey'
            }).then(ret=>{
                console.log(ret);
                return ret;
            })
            .catch(err => { 
                switch (err.name) {
                  case 'NotFoundError':
                    return null;
                    break;
                  case 'ExpiredError':
                    return null;
                    break;
                }
              });
            
            if(appKey){
                 routingStore.push('/login')
            }else{
                routingStore.push('/register')
            }
            
        }else{
            let appPass = await storage.load({
                key: 'appPass'
            }).catch(err=>{
                console.log(err)
                return null
            })
            let googleCred = await storage.load({
                key: 'googleCred'
            }).catch(err=>{
                console.log(err)
                return null
            })
            let fbCred = await storage.load({
                key: 'fbCred'
            }).catch(err=>{
                console.log(err)
                return null
            })
          
            let res = await accountService.autoSignInWithUID(uid,appPass,googleCred,fbCred)
            if(res=='SUCCESS'){ 
                routingStore.push('/home')
            }else{ 
                 routingStore.push('/login')
            }
            
        }
        
        //this.props.routing.replace('/login')
    }
    
    renderPage() {
        return (
            <PaperProvider>
            <Router history={history}>
                <Switch>
                    
                                         
                    <Route path='/contact' component={ContactUsPage} />
                    <Route path='/use' component={UseAppPage} />
                    <Route path='/overview' component={OverviewPage}/>
                    <Route path='/help' component={HelpPage}/>
                    <Route path='/savedAddress' component={SavedAddressesPage}/>
                    <Route path='/raisedIssues' component={IssuesListPage}/>
                    <Route path='/favRestaurants' component={FavRestaurantsPage}/>
                    <Route path='/restaurant/:restaurantId' component={RestaurantPage}/>
                    <Route path='/locationSelect/:pageId' component={SelectLocationPage}/>
                    <Route path='/locationSelect' component={SelectLocationPage}/> 
                    <Route path='/locationSearch/:pageId' component={SearchLocationPage}/> 
                    <Route path='/locationSearch' component={SearchLocationPage}/> 
                    <Route path='/profile2' component={PersonalDetails2Page}/> 
                    <Route path='/profile1' component={PersonalDetails1Page}/> 
                    <Route path='/home/:menuId' component={HomePage}/> 
                    <Route path='/home' component={HomePage}/> 
                    <Route path='/dineInFriends' component={SelectDineInFriendsPage}/> 
                    <Route path='/mail' component={OpenMailPage}/> 
                    <Route path='/reset/:id' component={ResetPasswordPage}/> 
                    <Route path='/resetSuccess' component={ResetSuccessPage}/> 
                    <Route path='/forgot' component={ForgotPasswordPage}/> 
                    <Route path='/login' component={SigninPage}/> 
                    <Route path='/register' component={SignupPage}/> 
                    <Route path='/' component={SplashPage}/> 
                </Switch>
            </Router>
            </PaperProvider>
        )
    }

    @observable
    fn = null;

    async componentDidMount(){
        console.log("Approuter-componentDidMount")
        if (Platform.OS === 'android') {
            let url = await Linking.getInitialURL();
            if(url){
                console.log('componentDidMount',url)
                this.navigate(url);
            }else{
                this.fn = setTimeout(this.gotoLogin,3000)
            }
        } else {
            let url = await Linking.getInitialURL();
            console.log('ios',url)
            if(url){
                this.navigate(url);
            }else{
                this.fn = setTimeout(this.gotoLogin,3000)
            }
            Linking.addEventListener('url', e=>this.handleOpenURL(e));
        }
    }

    componentWillUnmount(){
        clearTimeout(this.fn)
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    @autobind
    handleOpenURL(event) { 
        console.log('handleOpenURL',event.url)
        if(event.url){
            this.navigate(event.url);
        }else{
            this.fn = setTimeout(this.gotoLogin,3000)
        }
        
    }


    navigate(url) {
        const route = url.replace(/.*?:\/\//g, '');
        const id = route.match(/\/([^\/]+)\/?$/)[1];
        const routeName = route.split('/')[0];
        
        let idBytes = base64.decode(id)
        let destId = utf8.decode(idBytes)
         if (routeName === 'user') {
            routingStore.replace(`/reset/${destId}`)
        };
    }

    render() {
         return (
            <View style={{...this.style}} onLayout={this.layoutChange}>
                <Provider routing={routingStore} account={accountService} 
                restaurant={restaurantService}
                storage={storage}>{/* login={loginStore} */}
                
                    {this.renderPage()}
                
                </Provider>
            </View>
        )
    }

}