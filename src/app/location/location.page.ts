import { NavigationService } from './../services/navigation.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirestoreService } from './../services/firestore.service';

import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {NavController} from '@ionic/angular'
import {CartService} from '../services/cart.service';
import * as firebase from 'Firebase';
import {GoogleMaps,GoogleMap,GoogleMapsEvent,GoogleMapOptions,CameraPosition,
  MarkerOptions,
  Marker,
  MyLocation,
  GoogleMapsAnimation,
  Geocoder
} from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';


@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  @ViewChild('map',{ static: true }) mapElement: ElementRef;
 
  private todo : FormGroup;
  loading: any;
  address:any=[];
  flagAdress:any=false
  datos:any=[]
  edit:any=[]
  map: GoogleMap;
  markerlatlong:any;
streetPrincipal:any;
latitud:any;
longitud:any;
  constructor(
    private navigationService:NavigationService,
    private platform:Platform,
    private nativeGeocoder: NativeGeocoder,
    private toastController:ToastController,
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
    public router:Router,
    public navCtrl:NavController,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController, 
    ) { 
      this.todo = this.formBuilder.group({
        calle1: [''],
        calle2: [''],
        numcasa: [''],
        otros: [''],
    
      });
      
    
  }
  async loadMap(){
    this.platform.ready()
    this.map = GoogleMaps.create('map', {
    
    });
    this.goToMyLocation();

  }
  goToMyLocation(){

    this.map.clear();
 
    // Get the location of you
   
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null ,2));
 
      // Move the map camera to the location with animation
      this.map.moveCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });
      console.log(location.latLng)
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 1
    };
    let fixLat=parseFloat(location.latLng.lat.toFixed(3));
    let fixLng=parseFloat(location.latLng.lng.toFixed(3));
    console.log(fixLat)
    console.log(fixLng)

      this.nativeGeocoder.reverseGeocode(fixLat, fixLng, options)
      .then((result) => {
      console.log(JSON.stringify(result[0]))
       this.streetPrincipal=result[0].thoroughfare
       })
      .catch((error: any) =>
      console.log(error));
      
      //add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'Mi ubicación',
        snippet: '',
        draggable:true,
        position: location.latLng,
        animation: GoogleMapsAnimation.DROP
      });
      //show the infoWindow
      marker.showInfoWindow();
      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(() => {
       // this.showToast('clicked!');
       this.markerlatlong = marker.getPosition();

       this.latitud=parseFloat(this.markerlatlong.lat.toFixed(3));
       this.longitud=parseFloat(this.markerlatlong.lng.toFixed(3));
        console.log(this.latitud)
        console.log(this.longitud)
      
      });
      
      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
         
            console.log("Click MAP",data);
        }
      );
      setTimeout(() => {
        this.loading.dismiss();
      }, 3000);
     
    })
    .catch(err => {
    
      this.showToast(err.error_message);
      
    });
   
  }
  ngOnInit() { 
    this.firestoreService.consultarData("usuarios",
      firebase.auth().currentUser.email).subscribe((res) => {
        console.log(res.data().registro2_principal);
        this.datos=res.data()
        let addres1=res.data().registro2_principal
        let addres2=res.data().registro2_opcional1
        let addres3=res.data().registro2_opcional2
      this.address.push(addres1)
      this.address.push(addres2)
      this.address.push(addres3)
      console.log(this.address)

      }, (error) => {
        
        console.log(error);
      });
  }
  backHome(){
    this.navigationService.navigatePageHome()
  }
 editar(p){
  console.log(p)
  this.flagAdress=true
  this.edit=p
  this.loadMap()
 }
  editAddress(){
    if(this.todo.value.calle1=='' || this.todo.value.calle2==''
  || this.todo.value.numcasa==''|| this.todo.value.otros=='' 
  
  ){
    this.showToast("Llene todos los campos");
  }else{
    if(this.latitud==undefined || this.longitud==undefined)
    {

      this.showToast('Mueva el marker del mapa a una posición diferente')
    }else{
      this.addAdress1()
    }
   }
  }
 async addAdress1(){
   
   let ubicacion=this.edit.Ubicacion
   if(ubicacion=='Secundaria 1'){
  this.datos['registro2_opcional1']={
      Ubicacion:'Secundaria 1',
      latitud:this.latitud,
      longitud:this.longitud,
      calle_principal: this.todo.value.calle1,
      calle_secundaria:this.todo.value.calle2,
      numero_casa: this.todo.value.numcasa,
      otros:this.todo.value.otros,
    }
    
    this.firestoreService.insertarAdministradoresUpdate("usuarios",
      firebase.auth().currentUser.email, this.datos).then(() => {
        console.log('Ubicacion secundaria1 editada!');
        this.showToast('Ubicacion Secundaria 1 agregada')
       this.navigationService.navigatePageLocation()
       
      }, (error) => {
       
        console.log(error);
      });
    
    
  }
else{
  
    this.datos['registro2_opcional2']={
        Ubicacion:'Secundaria 2',
        latitud:this.latitud,
        longitud:this.longitud,
        calle_principal: this.todo.value.calle1,
        calle_secundaria:this.todo.value.calle2,
        numero_casa: this.todo.value.numcasa,
        otros:this.todo.value.otros,
      }
      
      this.firestoreService.insertarAdministradoresUpdate("usuarios",
      firebase.auth().currentUser.email, this.datos).then(() => {
        console.log('Ubicacion secundaria2 editada!');
        this.showToast('Ubicacion Secundaria 2 agregada')
        this.navigationService.navigatePageLocation()
       
      }, (error) => {
       
        console.log(error);
      });
 
   }
 }
  
 async presentToastWithOptions() {
  const toast = await this.toastCtrl.create({
    header: 'Item agregado',
    message: '',
    position: 'bottom',
    buttons: [
      {
        side: 'start',
        icon: 'cart',
        text: '',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Hecho',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  toast.present();
}
  async showToast(message: any) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
}
