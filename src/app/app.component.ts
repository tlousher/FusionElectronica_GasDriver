import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { timer } from 'rxjs';

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
  import { FirestoreService } from './services/firestore.service';
declare var window;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  arr:any;
  constructor(
    
    public aAuth: AngularFireAuth,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    private fcm: FCM,
    private firestoreService:FirestoreService,
   
    
  ) {
    this.arr = [];
    this.initializeApp();
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
     // this.splashScreen.hide();
      //this.statusBar.styleDefault();
        //add environment for android e ios
           //notifications setup
           this.fcm.hasPermission().then(data =>{
            console.log('has permissions',data)
            }).catch(error =>{
            console.log('has permissions error',error);
          });
            
           
          this.fcm.getToken().then(token => {
            console.log("notification token : ", token);
            localStorage.setItem('fcm_token', token);
    
            if (localStorage.email){
              this.firestoreService.updateProfile(localStorage.email,{fcm_token:token});
            }
    
          }).catch(error => {
              console.log(error);
              localStorage.setItem("fcm_token","no fcm");
          });
           //end
       //disable button back android device
        document.addEventListener("backbutton", function(e){
          console.log("boton atras desabilitado")
        },false)
      
      this.statusBar.styleLightContent();
    
     /* setTimeout(() => {
        this.splashScreen.hide();
        }, 1000);*/
   
       
      
        //fin code background geolocation
    });
  }
  
}
