import { observable } from 'mobx';
import auth, { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
    GoogleSignin,
    statusCodes,
    } from 'react-native-google-signin';

import storage from '@react-native-firebase/storage';

function validateEmail(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
    }
    return false
}
export const GOOGLE_PLACES_API_KEY = 'AIzaSyATGUcU1eNhyVHVIF8r6o7Nae9dD9jtbU0'

export type RestaurantsResult = "SUCCESS" | "UNKNOWN_ERROR"

export type Location = {
  lat: number,
  lng: number,
  description: string,
  tag: string
}


export default class RestaurantService {

    constructor(){
        GoogleSignin.configure({
            scopes: ['email'],
            webClientId: '833571377199-rpgvjdc8jodu927q8rvcks7me9rvcdji.apps.googleusercontent.com',
            offlineAccess: true,
        })
    }

   
    @observable
    verdantRestaurants = []

    

  async getVerdantRestaurants(): Promise<RestaurantsResult> {
    try{
      this.verdantRestaurants = (await firestore().collection('restaurants').get()).docs.map(doc=>doc.data())
      return "SUCCESS"
    }catch(error) {
      console.log(error)
      return "UNKNOWN_ERROR";
    }
  }

  async getRestaurantById(restaurantId: string): Promise<any> {
    try{
      let result
      let restaurant = (await firestore().collection('restaurants').doc(restaurantId).get()).data()
      let photosObj = restaurant?.photos
      if(photosObj){
        let promises = Object.keys(photosObj).map(async(type)=>{
          let picItems  =  (await storage().ref(`${restaurantId}/photos/${type}`).listAll()).items;
          let downloadUrl = await Promise.all(picItems.map(item=>item.getDownloadURL()))
          restaurant.photos[`${type}`] = [...downloadUrl]
          console.log(restaurant.photos)
        })

        await Promise.all(promises)
      }
      
      result = Object.assign({},restaurant)
      return result;
    }catch(error) {
      console.log(error)
      return null;
    }
  }

  async submitUserIssue(issueObject): Promise<RestaurantsResult> {
    try{
      await firestore().collection('issues')
      .doc(`${issueObject.restaurantId}_${issueObject.userId}_${issueObject.raisedOn}`).set(Object.assign({
        id: `${issueObject.restaurantId}_${issueObject.userId}_${issueObject.raisedOn}`
      },issueObject))
      return "SUCCESS"
    }catch(error) {
      console.log(error)
      return "UNKNOWN_ERROR";
    }
  }

  async getRestaurantsList(resIds: string[]): Promise<any[]> {
    try{
      return (await firestore().collection('restaurants').where('id','in',resIds.slice(0,9)).get()).docs.map(doc=>doc.data())
    }catch(error) {
      console.log(error)
      return [];
    }
  }

  async getIssuesForUserId(userId: string): Promise<any[]> {
    try{
      return (await firestore().collection('issues').where('userId','==',userId).get()).docs.map(doc=>doc.data())
    }catch(error){
      console.log(error);
      return [];
    }
  }

}

