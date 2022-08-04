import { NavigationService } from './../services/navigation.service';
import { FirestoreService } from './../services/firestore.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import {NavController} from '@ionic/angular'
import {CartService} from '../services/cart.service';
import * as firebase from 'Firebase';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import {GoogleMaps,GoogleMap,GoogleMapsEvent,
  Marker,
  MyLocation,
  GoogleMapsAnimation,
} from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderResult, 
  NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
//declare var google;
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
  @ViewChild('map',{ static: true }) mapElement: ElementRef;
  map: GoogleMap;
  loading: any;
  tipo:any;
  datos:any;
  fixLat:any;
  fixLng:any;
  locations:any=[];
  object:any;
  dataChofer:any;
  userId:any;
  userEmail:any;
  pedido:any=[];
  interval:any;
  latitude:any
  longitude:any
  latitudeUser:any
  longitudeUser:any
  constructor(
    private launchNavigator: LaunchNavigator,
    private alertCtrl:AlertController,
    private loadingController:LoadingController,
    private navigationService:NavigationService,
    private geolocation: Geolocation,
    private firestoreService:FirestoreService,
    public cartService:CartService,
    public router:Router,
    public navCtrl:NavController,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController, 
    ) {
      this.presentLoading() 
      this.loadMap1()
     
      this.firestoreService.consultarData('pedido-tracking',
      firebase.auth().currentUser.email).
      subscribe((res)=>{
      
        if(res.exists){
          console.log(res.data())
          this.userId=res.data().id
          this.userEmail=res.data().email
          
          this.getLocations()
          this.getPedido()
          this.getMeInfo()
        }       
      },(error)=>{
        this.loading.dismiss()
        console.log(error)
      })
       
  }

  ngOnInit() {
    
   }
   ionViewWillEnter() {
     
    this.interval=setInterval(() => {
      
      this.getLocation()
     }, 5000);
  }
   loadMapExternal(){
    let options: LaunchNavigatorOptions = {
      start: [this.latitude,this.longitude],
      app: this.launchNavigator.APP.GOOGLE_MAPS
    }
    
    this.launchNavigator.navigate([this.latitudeUser,this.longitudeUser], options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
   }
   sendFlagPedido(){
    this.firestoreService.insertarControl("pedidos-aceptados",
    this.userEmail,this.object).then(() => {
          console.log('pedido finalizado')
          
          this.navigationService.navigatePageHome();
          
          //add lat lng chofer
          
    },(error)=>{
      console.log(error)
    });
   }
   async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación!',
      backdropDismiss:false,
      message: '¿Está seguro de finalizar el pedido?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.endPedido()
          }
        }
      ]
    });

    await alert.present();
   }
   endPedido(){
    clearInterval(this.interval)
    this.firestoreService.deleteData("pedido-tracking",
      firebase.auth().currentUser.email).then((res) => {
            console.log('tracking borrado')
            this.showToast('pedido finalizado') 
            this.sendFlagPedido()
            
      },(error)=>{
        
        console.log(error)
      });
   }
   async presentLoading(){
    
    this.loading= await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Porfavor espere...',
      backdropDismiss: true
      
    });
    await this.loading.present();
 }
   getMeInfo(){
    this.firestoreService.consultarData('drivers',
    firebase.auth().currentUser.email).
    subscribe((res)=>{
      this.loading.dismiss()
      console.log(res.data())
      this.dataChofer=res.data()
      this.object={
        user:this.dataChofer.usuario,
        email:this.dataChofer.email,
        nombre:this.dataChofer.nombre,
        apellido:this.dataChofer.apellido,
        celular:this.dataChofer.celular,
        distribuidora:this.dataChofer.distribuidora_nombre,
        distribuidora_email:this.dataChofer.distribuidora_email,
        flagaceptado:1,
        flagend:1,
}
    },(error)=>{
      this.loading.dismiss()
      console.log(error)
    })
   }
 getPedido(){
   
  this.firestoreService.consultarData('pedidos',this.userEmail).
      subscribe((res)=>{
      if(res.exists){
        console.log('datos del pedido')
        this.pedido.push(res.data())
        console.log(this.pedido)
      }
       
      },(error)=>{
        console.log(error)
      })
 }
 deletePedido(email,id){
  this.firestoreService.deleteData("pedidos-borrador",
  email).then((res) => {
        console.log('datos borrados') 
     
  },(error)=>{
    
    console.log(error)
  });
 }
 
 getLocations(){
  firebase.database().ref("pedidos-aceptados").
  child(this.userId).on("value",res=>{
    
     var datos=res.val();
     
     for(let dato in datos){
       console.log(datos[dato])
       
      let latlng={
           lat: datos[dato].latitud,
           lng: datos[dato].longitud
       }
       this.locations.push(latlng)
       console.log(this.locations)
       if(datos[dato].id=='user'){
         this.goToLocationMe(latlng)
         this.latitudeUser=latlng.lat
         this.longitudeUser=latlng.lng
        
       } else{
         this.goToLocationChofer(latlng)
         this.latitude=latlng.lat
         this.longitude=latlng.lng
        
       }
      
     }
    // this.loadMapExternal() 
  },(err)=>{
    console.log(err)
   this.loading.dismiss();
  })      
 }
 getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      
     //console.log(resp.coords.latitude)
      //console.log(resp.coords.longitude)
      this.latitude=resp.coords.latitude
      this.longitude=resp.coords.longitude
      this.fixLat=parseFloat(resp.coords.latitude.toFixed(3));
     this.fixLng=parseFloat(resp.coords.longitude.toFixed(3));
      this.sendLocationRealTime();
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  
 }
  async loadMap1(){
   
    this.map = GoogleMaps.create('map_canvas', {
    
    });
    let latlng={
      lat:-2.903,
      lng: -79.004

  }
     // Move the map camera to the location with animation
    this.map.moveCamera({
      target: latlng,
      zoom: 12,
      duration: 3000
    });
    

  }
  goToLocationMe(latlng){

    this.map.clear();
    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null ,2));
 
      //console.log(location.latLng)
      //add a marker
    
      let marker: Marker = this.map.addMarkerSync({
        title: 'Cliente',
        snippet: '',
        icon: {
          url: "./assets/img/user.jpg",
          size:{
            width:30,
            height:30
          }, // scaled size
       },
        position: latlng,
        //animation: GoogleMapsAnimation.BOUNCE
      });
      //show the infoWindow
      //marker.showInfoWindow();
      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe(() => {
       //this.showToast('drag!');
      });
  
     /* this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {}
      ); */
    })
    .catch(err => {
      //this.showToast(err.error_message);
    });
   
  }
  goToLocationChofer(latlng){

    this.map.clear();
 
    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null ,2));
      //console.log(location.latLng)
      //add a marker
    
      let marker: Marker = this.map.addMarkerSync({
        title: 'Mi posición',
        snippet: '',
        icon: {
          url: "./assets/img/logo_gas.png",
          size:{
            width:20,
            height:30
          }, // scaled size
       },
        position: latlng,
        //animation: GoogleMapsAnimation.BOUNCE
      });
      //show the infoWindow
      //marker.showInfoWindow();
      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(() => {
        //this.showToast('drag!');
       });
      this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(
        (data) => {
          //this.showToast('drag!');
          
          }
      );
    })
    .catch(err => {
      //this.showToast(err.error_message);
    });
  }
  
 backHome(){
   this.navigationService.navigatePageHome()
 }
 sendLocationRealTime(){
   //this.count+=1
  let imagenRef=firebase.database().ref("pedidos-aceptados").
  child(this.userId).child(firebase.auth().currentUser.uid);
  imagenRef.set({
     id:'chofer',
     latitud:this.fixLat, 
     longitud:this.fixLng,
    
});
console.log("ubicacion chofer actualizada secundaria")
 }
 
  async showToast(message: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
}
