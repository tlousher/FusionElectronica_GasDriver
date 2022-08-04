
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FirestoreService } from './../services/firestore.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-final',
  templateUrl: './registro-final.page.html',
  styleUrls: ['./registro-final.page.scss'],
})
export class RegistroFinalPage implements OnInit {

  loading: any;
  message:any;
  textMessage:any;
  toast: any;
  datos_User:any; 
  private todo : FormGroup;
  data:any;
  params:any;
  constructor(
    private firestoreService: FirestoreService,
    public loadingController:LoadingController,
    private formBuilder: FormBuilder,
    private router:Router,
    public toastController: ToastController,
    private alertController:AlertController,
    private route:ActivatedRoute) {
    
    this.todo = this.formBuilder.group({
      tipo: [''],
      color1: [''],
      color2: [''],
     
    });
  
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      //this.refresh = params["refresh"];
      this.params = JSON.parse(params["registro1"]);
      console.log(this.params)
  });
  }

  loadData() {
    console.log(this.todo.value)
    if(this.todo.value.tipo=='' || this.todo.value.color1==''
    || this.todo.value.color2==''){

      this.showToast("Seleccione todas las opciones");
    }else{
      
     this.loadDatos()

    }
   
  }
 loadDatos(){
  this.data={
    registro3:{
      tipo_cilindro: this.todo.value.tipo,
      color1:this.todo.value.color1,
      color2: this.todo.value.color2,
      
     },
    
 }
 this.firestoreService.insertarAdministradoresUpdate("usuarios",
 this.params.email, this.data).then(() => {
   console.log('Datos Cargados!'); 
   this.presentAlert();
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
        
      async presentAlert() {
       
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Mensaje',
            backdropDismiss:false,
            message:'Datos cargados correctamente!!',
            buttons: [{text: 'Iniciar Sesión',
            handler: () => {
              console.log('Confirm Okay');
              this.router.navigate(['/login']);
            }}]
          });
      
          await alert.present();
        }
       
}

