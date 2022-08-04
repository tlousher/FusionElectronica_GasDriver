import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../shared/user.class';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'Firebase';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public errormessage: any;
  public isLogged: any ;
  referencia:any;
  
  constructor(public aAuth: AngularFireAuth,public fireRef:AngularFireDatabase,public router: Router,public toastController: ToastController) { 

    aAuth.authState.subscribe(user => (
      this.isLogged = user));

  }
  async onLoad(option:any){
    try {
     this.referencia=this.fireRef.database.ref("Sistema").child("TIHbL8IEeoQilwpQUn6NgQohg9W2"+"/productos/"+option+"/Pera")
     this.referencia.on("value",function(snapshot:any){
      var datos=snapshot.val();
  
         return datos.precio


  })
    } catch (error) {
      console.log(error);
      this.errormessage=error.code;
    }
  }
  
  async onLogin(user: User){
    try {
      return await this.aAuth.auth.signInWithEmailAndPassword(user.email,user.password)
    } catch (error) {
      console.log(error);
      this.errormessage=error.code;
    }
  }
  
  async onRegister(user: User){
    try{
      return await this.aAuth.auth.createUserWithEmailAndPassword(user.email,user.password)
      
    } catch (error) {
      console.log(error);
      this.errormessage=error.code;
    }
  }
  async onResetPassword(user:User){
    try {
      console.log(user.email)
      this.errormessage="Se le ha enviado un correo!";
      return await this.aAuth.auth.sendPasswordResetEmail(user.email);
    } catch (error) {
      
      console.log(error);
      this.errormessage=error.code;
      
    }
  }
  
  async sendVerifcationEmail(): Promise<void> {
    try {
      console.log("envío de correo de verificación")
      return (await this.aAuth.auth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error->', error);
    }
  }
  async loginGoogle() {
    try {
      const { user } = await this.aAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
     // this.updateUserData(user);
      return user;
    } catch (error) {
      console.log('Error->', error);
    }
  }
}
