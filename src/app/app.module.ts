import { PipesModule } from './pipes/pipes.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from './../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ PipesModule,AngularFirestoreModule,AngularFireModule,BrowserModule, 
    IonicModule.forRoot({hardwareBackButton: false}), AppRoutingModule,AngularFireDatabaseModule ,AngularFireModule.initializeApp(environment.firebaseConfig),AngularFireAuthModule, BrowserAnimationsModule],
  providers: [
    LaunchNavigator,
    FCM,
    StatusBar,
    NativeGeocoder,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
