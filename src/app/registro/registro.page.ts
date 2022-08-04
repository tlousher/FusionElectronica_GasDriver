import { Administrador } from './../usuario';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { User } from '../shared/user.class' ;
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import * as firebase from 'Firebase';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  loading: any;
  message:any;
  textMessage:any;
  user:User =new User();
  toast: any;
  ref:any;
  nombreUser:any;
  emailUser: any;
  datos_User: Administrador; 
  private todo : FormGroup;
  data:any;
  distribuidoras:any=[]
  distribuidora_email:any;
  textoBuscar:string='';
  distribuidora:any='';
  constructor(
    private firestoreService: FirestoreService,
    public loadingController:LoadingController,
    private formBuilder: FormBuilder,
    private router:Router,
    private authSvc:AuthService,
    public toastController: ToastController,
    private alertController:AlertController) {
    this.getDistribuidoras()
    this.todo = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      email: [''],
      placa: [''],
      clave: [''],
      claveconfirm: [''],
      celular:['']
    

    });
    this.datos_User = {
    nombre: '',
    apellido:'',
    email: '',
    placa:'',
    clave:'',
    claveconfirm:'',
    celular:''

    } as Administrador;
  
  }
  ngOnInit(){
    
  }
  getDistribuidoras(){
    this.firestoreService.consultarDatos('distribuidoras').
    subscribe((res)=>{
    
      res.forEach(element => {
        
         this.distribuidoras.push(element.payload.doc.data()['datos'])
      });
      console.log(this.distribuidoras)
    },(error)=>{
      console.log(error)
    })
  }
 
  addAdmin() {
    console.log(this.todo.value)
    console.log(this.distribuidora)
    if(this.todo.value.nombre=='' || this.todo.value.apellido==''
    || this.todo.value.email==''|| this.todo.value.placa=='' 
    || this.todo.value.clave==''|| this.todo.value.claveconfirm==''
    || this.distribuidora==''||this.todo.value.celular==''
    
    ){

      
      this.showToast("Llene todos los campos");
    }else{
      this.user.email=this.todo.value.email;
      this.user.password=this.todo.value.clave;
      if(this.todo.value.clave===this.todo.value.claveconfirm){
       
        this.onRegister()
        
      }
      else{
        this.showToast("Contraseñas no coinciden")
      }

    }
   
  }
 
  async onRegister(){
   
    const user=await this.authSvc.onRegister(this.user);
    if(user){
      const userVerificado=await this.authSvc.sendVerifcationEmail();
      this.onLoad();
      this.data={
        
          nombre: this.todo.value.nombre,
          apellido:this.todo.value.apellido,
          email: this.todo.value.email,
          usuario:this.todo.value.placa,
          clave:this.todo.value.clave,
          distribuidora_nombre:this.distribuidora,
          distribuidora_email:this.distribuidora_email,
          celular:this.todo.value.celular,
          status:false,
          fcm_token: localStorage.fcm_token
        
      }
      this.firestoreService.insertarAdministradores("drivers",
      this.todo.value.email, this.data).then(() => {
        console.log('Datos Cargados!');
        this.quitLoad(); 
        this.presentAlert();
      }, (error) => {
       
        console.log(error);
      });
     // this.addUser();
    }else{
      
      this.message=this.authSvc.errormessage;
      if(this.message=="auth/weak-password"){
    
         this.showToast("Contraseña debe tener mínimo 6 carácteres")
      }
      if(this.message=="auth/email-already-in-use"){
       
        this.showToast("Correo ya está en uso")
     }
     if(this.message=="auth/invalid-email"){
    
      this.showToast("Email inválido")
   }
     
    }
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
  segmentChanged(event){
    this.distribuidora=event.detail.value;
    console.log(this.distribuidora)
    this.distribuidoras.forEach(element => {
      if(element.distribuidora==this.distribuidora){
        this.distribuidora_email=element.email
        console.log(this.distribuidora_email)
      }
 });
  }
  searchLocal(event){
    this.textoBuscar=event.detail.value;
  }
        
      async presentAlert() {
       
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Mensaje',
            backdropDismiss:false,
            message:'Chofer creado correctamente, se ha enviado un correo de confirmación revíselo antes de loguearse!!',
            buttons: [{text: 'Iniciar Sesión',
            handler: () => {
              console.log('Confirm Okay');
              this.router.navigate(['/login']);
            }}]
          });
      
          await alert.present();
        }
       
}
