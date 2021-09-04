/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, {Component} from 'react';
 import {Platform, View,Text,SafeAreaView} from 'react-native';
 import AppRouter from './src/AppRouter'
 
 const instructions = Platform.select({
   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
   android:
     'Double tap R on your keyboard to reload,\n' +
     'Shake or press menu button for dev menu',
 });
 
 
 
 interface Props {}
 export default class App extends Component<Props> {
   render() {
     return (
      //  <View style={{
      //    flex:1,
      //    justifyContent:'center',
      //    alignItems:'center'
      //  }}>
      //    <Text>Hello World!</Text>
      //  </View>
         <AppRouter/>
     );
   }
 }
 