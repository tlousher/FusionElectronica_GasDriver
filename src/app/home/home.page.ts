import { NavigationService } from './../services/navigation.service';
import { FirestoreService } from './../services/firestore.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import {NavController} from '@ionic/angular'
import {CartService} from '../services/cart.service';
import * as firebase from 'Firebase';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map',{ static: true }) mapElement: ElementRef;
  map: GoogleMap;
  address: string;
  loading: any;
  streetPrincipal:any;
  tipo:any;
  datos:any;
  color:any;
  color1:any;
  color2:any;
  fixLat:any;
  fixLng:any;
  locations:any=[];
  count:any=1;
  pedidos:any=[]
  variable:any;
  object:any;
  dataChofer:any;
  watch:any;
  subscription: any;
  constructor(
    private alertCtrl:AlertController,
    private fcm:FCM,
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
      
      this.firestoreService.consultarDatos('pedidos-borrador').
      subscribe((res)=>{
      
        res.forEach((doc)=>  {
          console.log(doc);
        
          this.pedidos.push(doc.payload.doc.data())
         
        }); 
        console.log(this.pedidos)
        
      },(error)=>{
        console.log(error)
      })
      this.getLocation()
        this.getMeInfo()
       
  }

  ngOnInit(){
    this.fcm.getToken().then(token => {
      console.log(token)
    });
    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background");
        
      } else {
        console.log("Received in foreground")
        console.log(data);
        this.presentAlertNotification(data.title,data.body)
      };
    });
     this.fcm.clearAllNotifications();

   }
   async presentAlertNotification(title,message) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: title,
      backdropDismiss:false,
      message:message,
      buttons: [{text: 'Ok',
      handler: () => {
        console.log('Confirm Okay');
        
      }}]
    });

    await alert.present();
  }
   doRefresh(event) {
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      this.navigationService.navigatePageHome()
    }, 2000);
  }
   getMeInfo(){
    this.firestoreService.consultarData('drivers',
    firebase.auth().currentUser.email).
    subscribe((res)=>{
    
      
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
        flagend:0,
}
console.log(this.object)
    },(error)=>{
      console.log(error)
    })
   }
   async presentLoading(){
    
    this.loading= await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Porfavor espere...',
      backdropDismiss: true
      
    });
    await this.loading.present();
 }
 aceptarPedido(email,id){
   //verificar status
   this.presentLoading()
   this.firestoreService.consultarData('drivers',
   firebase.auth().currentUser.email).
      subscribe((res)=>{
      if(res.data().status==true){
        
        //segunda funcion
        this.firestoreService.consultarData('pedidos-borrador',email).
      subscribe((res)=>{
      if(res.exists){
        this.showToast('pedido aceptado')
        setTimeout(() => {
          this.deletePedido(email,id)
        }, 1000);
       
        
      }else{
        this.loading.dismiss();
        this.showToast('pedido no disponible')
      }
       
      },(error)=>{
        this.loading.dismiss();
        console.log(error)
      })
        //fin segunda funcion
       
        
      }else{
        this.loading.dismiss();
        this.router.navigate(["/logout"])
        this.presentAlert('Ha sido deshabilitado del sistema')
      }
       
      },(error)=>{
        this.loading.dismiss();
        console.log(error)
      })
   //fin verificación
   
  
 }
 async presentAlert(message) {
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'Mensaje',
    backdropDismiss:false,
    message:message,
    buttons: [{text: 'Ok',
    handler: () => {
      //this.router.navigate(['/login']);
      
    }}]
  });

  await alert.present();
}
 deletePedido(email,id){
  this.firestoreService.deleteData("pedidos-borrador",
  email).then((res) => {
        console.log('datos borrados') 
     this.addDriver(email,id)
  },(error)=>{
    this.loading.dismiss();
    console.log(error)
  });
 }
 addDriver(email,id){
  
  let imagenRef=firebase.database().ref("pedidos-aceptados").
        child(id).child(firebase.auth().currentUser.uid);
        imagenRef.set({
          id:'chofer',
          latitud:this.fixLat, 
          longitud:this.fixLng,
    
}); 
this.firestoreService.insertarControl("pedido-tracking",
        firebase.auth().currentUser.email,{id:id,email:email}).then(() => {
              console.log('pedido en curso') 
              
        },(error)=>{
          this.loading.dismiss();
          console.log(error)
        });
  this.firestoreService.insertarControl("pedidos-aceptados",
        email,this.object).then(() => {
              console.log('datos chofer a firestore')
              setTimeout(() => {
                this.loading.dismiss();
              }, 1000);       
    this.navigationService.navigatePagePedido();
              //add lat lng chofer
              
        },(error)=>{
          this.loading.dismiss();
          console.log(error)
        });
 }
 getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      
    // console.log(resp.coords.latitude)
     // console.log(resp.coords.longitude)

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.watch = this.geolocation.watchPosition().subscribe((data) => {
  // data can be a set of coordinates, or an error (if an error occurred
  console.log(data.coords.latitude)
  console.log(data.coords.longitude)
  this.fixLat=parseFloat(data.coords.latitude.toFixed(3));
  this.fixLng=parseFloat(data.coords.longitude.toFixed(3));
    this.sendLocationRealTime();
  });
 }

 sendLocation(){
      if(this.fixLat!=undefined || this.fixLng!=undefined){
      
        let object={
          latitud:this.fixLat,
          longitud:this.fixLng
          }
          this.firestoreService.insertarControl("ubicaciones-choferes",
          firebase.auth().currentUser.email,object).then(() => {
                console.log('ubicacion agregada principal')
              
          },(error)=>{
            
            console.log(error)
          });
      }
 }
 sendLocationRealTime(){
   //this.count+=1
  let imagenRef=firebase.database().ref("Ubicaciones_choferes").
  child(firebase.auth().currentUser.uid);
  imagenRef.set({
     email:this.object.distribuidora_email,
     email_chofer:firebase.auth().currentUser.email,
     latitud:this.fixLat, 
     longitud:this.fixLng,
    
});
console.log("ubicacion chofer actualizada principal")
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
