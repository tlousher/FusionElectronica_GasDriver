
import { FirestoreService } from './../services/firestore.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { User } from '../shared/user.class' ;
import { ToastController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {GoogleMaps,GoogleMap,GoogleMapsEvent,GoogleMapOptions,CameraPosition,
  MarkerOptions,
  Marker,
  MyLocation,
  GoogleMapsAnimation,
  Geocoder
} from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google;
@Component({
  selector: 'app-registro-control',
  templateUrl: './registro-control.page.html',
  styleUrls: ['./registro-control.page.scss'],
})

export class RegistroControlPage implements OnInit {

  @ViewChild('map',{ static: true }) mapElement: ElementRef;
  loading: any;
  message:any;
  textMessage:any;
  user:User =new User();
  toast: any;
  ref:any;
  nombreUser:any;
  emailUser: any;
  datos_User:any;
  datos_User1:any; 
  private todo : FormGroup;
  private todo1 : FormGroup;
  map: GoogleMap;
  userLocation;
  userCity;
  lat;
  lng;
  location;
  latLngResult;
  userLocationFromLatLng;
  streetPrincipal:any;
  agregarDireccion=false;
  etiqueta:any='Agregar Dirección 2 (Opcional)';
  params:any;
  data:any;
  latitud:any;
  longitud:any;
  constructor(
    private firestoreService: FirestoreService,
    public loadingController:LoadingController,
    private formBuilder: FormBuilder,
    private router:Router,
    public toastController: ToastController,
    private alertController:AlertController,
    private platform: Platform,
    private nativeGeocoder: NativeGeocoder,
    private route:ActivatedRoute) {
    
    this.todo = this.formBuilder.group({
      calle1: [''],
      calle2: [''],
      numcasa: [''],
      otros: [''],
  
    });
    this.todo1 = this.formBuilder.group({
      calle1: [''],
      calle2: [''],
      numcasa: [''],
      otros: [''],
    

    });
  
   
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      //this.refresh = params["refresh"];
      this.params = JSON.parse(params["registro1"]);
      console.log(this.params)
  });
    this.platform.ready();
    this.loadMap1();
   
  }

  async loadMap1(){
   
    this.map = GoogleMaps.create('map_canvas', {
    
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
    this.latitud=fixLat;
    this.longitud=fixLng;

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
        //draggable:true,
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });
      //show the infoWindow
      marker.showInfoWindow();
      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
       // this.showToast('clicked!');
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
  

  addAddressPrincipal() {
    console.log(this.todo.value)
    console.log( this.datos_User)
    if(this.todo.value.calle1=='' || this.todo.value.calle2==''
    || this.todo.value.numcasa==''|| this.todo.value.otros=='' 
    
    ){
      this.showToast("Llene todos los campos");
    }else{
  
        this.addAdress1()
    }
   
  }
  addAddressOpcional() {
    console.log(this.todo.value)
    console.log( this.datos_User)
    if(this.todo1.value.calle1=='' || this.todo1.value.calle2==''
    || this.todo1.value.numcasa==''|| this.todo1.value.otros=='' 
    
    ){
      this.showToast("Llene todos los campos");
    }else{
  
       this.addAdress2()
    }
   
  }
 
 addDireccion(){
  if(this.todo.value.calle1=='' || this.todo.value.calle2==''
  || this.todo.value.numcasa==''|| this.todo.value.otros=='' 
  
  ){
    this.showToast("Llene los campos de la dirección principal primero");
  }else{

    this.agregarDireccion=!this.agregarDireccion
    if(this.agregarDireccion==true){
     this.etiqueta='Agregar Dirección 1 (Obligatorio)'
    }else{
     this.etiqueta='Agregar Dirección 2 (Opcional)'
   }
  }
   
 }
  async addAdress1(){
    this.data={
      registro2_principal:{
        Ubicacion:'Principal',
        latitud:this.latitud,
        longitud:this.longitud,
        calle_principal: this.todo.value.calle1,
        calle_secundaria:this.todo.value.calle2,
        numero_casa: this.todo.value.numcasa,
        otros:this.todo.value.otros,
      },
      registro2_opcional1:{
        Ubicacion:'Secundaria 1',
        latitud:'',
        longitud:'',
        calle_principal: "",
        calle_secundaria:"",
        numero_casa: "",
        otros:"",
      },
      registro2_opcional2:{
        Ubicacion:'Secundaria 2',
        latitud:'',
        longitud:'',
        calle_principal: "",
        calle_secundaria:"",
        numero_casa: "",
        otros:"",
      }
      
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
          registro1: JSON.stringify(this.params),
   
      }
   };
      this.firestoreService.insertarAdministradoresUpdate("usuarios",
      this.params.email, this.data).then(() => {
        console.log('Datos Cargados!');
        this.quitLoad(); 
       this.presentAlert('Dirección Principal Agregada',navigationExtras);
      }, (error) => {
        this.quitLoad(); 
        console.log(error);
      });
    
    
  }
  async addAdress2(){
    this.data={
     
      registro2_principal:{
        Ubicacion:'Principal',
        latitud:this.latitud,
        longitud:this.longitud,
        calle_principal: this.todo.value.calle1,
        calle_secundaria:this.todo.value.calle2,
        numero_casa: this.todo.value.numcasa,
        otros:this.todo.value.otros,
      },
      registro2_opcional1:{
        Ubicacion:'Secundaria 1',
        latitud:'',
        longitud:'',
        calle_principal: this.todo1.value.calle1,
        calle_secundaria:this.todo1.value.calle2,
        numero_casa: this.todo1.value.numcasa,
        otros:this.todo1.value.otros,
      },
      registro2_opcional2:{
        Ubicacion:'Secundaria 2',
        latitud:'',
        longitud:'',
        calle_principal: '',
        calle_secundaria:'',
        numero_casa: '',
        otros:'',
      }
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
          registro1: JSON.stringify(this.params),
   
      }
   };
      this.firestoreService.insertarAdministradoresUpdate("usuarios",
      this.params.email, this.data).then(() => {
        console.log('Datos Cargados!');
        this.quitLoad(); 
       this.presentAlert('Dirección Principal y Opcional Agregadas',navigationExtras);
      }, (error) => {
        this.quitLoad(); 
        console.log(error);
      });
    
    
  }
 
  async onLoad(){
    
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere porfavor...',
    });
    await this.loading.present();
    
  }
 async quitLoad(){

    this.loading.dismiss();
   
  }
  async showToast(message) {
    this.toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
      this.toast.present();
    
  } 
      async presentAlert(mensaje,NavigationExtras) {
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Mensaje',
            backdropDismiss:false,
            message: mensaje,
            buttons: [{text: 'Continuar',
            handler: () => {
              console.log('Confirm Okay');
              this.router.navigate(['/registro-final'],NavigationExtras);
            }}]
          });
      
          await alert.present();
        }
       
}
