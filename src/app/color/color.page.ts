import { NavigationService } from './../services/navigation.service';
import { FirestoreService } from './../services/firestore.service';

import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {NavController} from '@ionic/angular'
import {CartService} from '../services/cart.service';
import * as firebase from 'Firebase';



@Component({
  selector: 'app-color',
  templateUrl: './color.page.html',
  styleUrls: ['./color.page.scss'],
})
export class ColorPage implements OnInit {
  
 
  
  loading: any;
  datos:any;
  tipo:any;
  color1:any;
  color2:any;
  tipo_flag:any=false;
  color1_flag:any=false;
  color2_flag:any=false;

  constructor(
    private navigationService:NavigationService,
    private firestoreService:FirestoreService,
    public cartService:CartService,
    public router:Router,
    public navCtrl:NavController,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController, 
    ) { 
      this.firestoreService.consultarData("usuarios",
      firebase.auth().currentUser.email).subscribe((res) => {
        console.log(res.data().registro2_principal);
        this.datos=res.data()
        this.tipo=res.data().registro3.tipo_cilindro
        this.color1=res.data().registro3.color1
        this.color2=res.data().registro3.color2
     
      console.log(this.tipo)
      console.log(this.color1)
      console.log(this.color2)

      }, (error) => {
        console.log(error);
      });
  }
  
  ngOnInit() { }
  
 
  backHome(){
    this.navigationService.navigatePageHome()
  }
 
  changeTipo(){
    
    console.log(this.tipo)

  }
  changeColor1(){
    
    console.log(this.color1)

  }
  changeColor2(){
    
    console.log(this.color2)

  }
 
editar(){
  this.datos['registro3']={
    tipo_cilindro:this.tipo,
    color1:this.color1,
    color2:this.color2,
   
  }
   
  this.firestoreService.insertarAdministradoresUpdate("usuarios",
  firebase.auth().currentUser.email, this.datos).then(() => {
    console.log('Datos editados!');
    this.showToast('Datos modificados')
   this.navigationService.navigatePageColor()
   
  }, (error) => {
   
    console.log(error);
  });
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
