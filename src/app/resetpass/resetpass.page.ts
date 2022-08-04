import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { User } from '../shared/user.class' ;
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reserpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage {
  loading: any;
  message:any;
  textMessage:any="Se le ha enviado un correo!";
  user:User =new User();
  toast: any;
  private todo : FormGroup;

  constructor( public loadingController: LoadingController,private formBuilder: FormBuilder,public router: Router,private authSvc:AuthService,public toastController: ToastController) {
    this.todo = this.formBuilder.group({
      email: ['', Validators.required]
    });
    
  }
  
  logForm(){
   
    if(this.todo.value.email==""){
       this.textMessage="Ingrese su correo";
       this.showToast();
       
    }
    else{
      this.onLoad();
      console.log(this.todo.value.email);
      this.user.email=this.todo.value.email;
      this.onResetPassword();
    }
  }
 
  async onResetPassword(){
    const user=await this.authSvc.onResetPassword(this.user);
    this.message=this.authSvc.errormessage;
    if(this.message=="Se le ha enviado un correo!"){
      this.quitLoad()
      this.textMessage="Se te envió un e-mail a tu cuenta de correo para que puedas recuperar tu contraeña.";
      this.showToast()
      //this.router.navigate(['/login']);
    }
      if(this.message=="auth/user-not-found"){
        this.quitLoad()
        this.textMessage="Correo no registrado";
        this.showToast()
     }
     if(this.message=="auth/invalid-email"){
      this.quitLoad()
      this.textMessage="Email inválido";
      this.showToast()
     } 
   
  }
  async onLoad(){
    
    this.loading = await this.loadingController.create();
    this.loading.present()
    
  }
  async quitLoad(){
    setTimeout(() => {
      this.loading.dismiss();
    }, 2000);
  }
  showToast() {
    this.toast = this.toastController.create({
      message: this.textMessage,
      duration: 2000
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }

}

