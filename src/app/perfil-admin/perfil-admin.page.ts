import { FirestoreService } from './../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../services/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfil-admin.page.html',
  styleUrls: ['./perfil-admin.page.scss'],
})
export class PerfilAdminPage implements OnInit {

  pathFotoLocal:any;
  email:any;
  document:any={
    id:'',
    data:''
  };
  loading:any;

  constructor(
    public router:Router,
    public navCtrl:NavController,
    public toastCtrl: ToastController,
    private aAuth: AngularFireAuth,
    private firestoreService: FirestoreService, 
    private loadingController:LoadingController
   ) {
    this.presentLoading();
    this.aAuth.auth.onAuthStateChanged((user)=> {
      if (user) {
        //this.router.navigate(['/menu']);
        console.log(user.email)
        this.email=user.email
        this.firestoreService.consultarPorId('administradores',this.email).
        subscribe((res)=>{
          if(res.payload.data() != null) {
            console.log(res.payload.id)
            this.document.id = res.payload.id
            this.document.data = res.payload.data();
            this.pathFotoLocal=this.document.data.fotoLocal
            
            console.log(this.pathFotoLocal);
            this.loading.dismiss();
          }
        },(error)=>{
          this.loading.dismiss();
          console.log(error)
        })
      
      } 
    },(error)=>{
      this.loading.dismiss();
      console.log(error)
    });
    
  }
  
  ngOnInit() { 
    console.log('ngOnInit')

  }
  
  backMenu(){
    this.navCtrl.navigateBack('/admin')
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
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  async presentLoading() {
     this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...',
    });
    await this.loading.present();
  }
  
}

