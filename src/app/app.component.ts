import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import firebase from 'firebase/app';


var firebaseConfig = {
  apiKey: "AIzaSyAz6pfEG-A_qGud8aB722Xf0C0TLNbr24o",
  authDomain: "eventhub-6c0c8.firebaseapp.com",
  databaseURL: "https://eventhub-6c0c8.firebaseio.com",
  projectId: "eventhub-6c0c8",
  storageBucket: "eventhub-6c0c8.appspot.com",
  messagingSenderId: "1035188276794",
  appId: "1:1035188276794:web:53ac93e341dac4750f2f03",
  measurementId: "G-Y8L3039Q9Z"
};


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
