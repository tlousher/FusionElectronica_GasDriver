import { AlertController, ToastController } from '@ionic/angular';
import { FirestoreService } from './../services/firestore.service';
import { NavigationService } from './../services/navigation.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { timer } from 'rxjs';
import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'Firebase';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  showSplash=true;
  zone: NgZone;
  constructor(
    private toastCtrl:ToastController,
    private alertController:AlertController,
    private firestoreService:FirestoreService,
    private navigationService:NavigationService,
    private aAuth: AngularFireAuth,
    private router: Router) { 
    timer(4000).subscribe(()=>this.change() )
   
  }

  ngOnInit() {
   
  }
   consultarPedido(){
    this.firestoreService.consultarData("pedido-tracking",
    firebase.auth().currentUser.email).subscribe((res) => {
          if(res.exists){
            this.navigationService.navigatePagePedido()
            
          }else{
            this.navigationService.navigatePageHome()
          }
          
          
    },(error)=>{
      console.log(error)
    });
  }
  change(){
    this.showSplash=false
    this.zone = new NgZone({});
    const unsubscribe= this.aAuth.auth.onAuthStateChanged((user)=> {
      this.zone.run(() => {

        if(user){
          if (user.emailVerified==true) {
            //this.router.navigate(['/menu']);
            this.firestoreService.consultarUsuarios("drivers",firebase.auth().currentUser.email).
            subscribe((res) => {
             
             
              if (res.exists) {
                if(res.data().status==true){
              console.log('chofer detectado')
              //this.navigationService.navigatePageHome()
              this.consultarPedido();
               unsubscribe()
               }else{
                 this.presentAlert('Aún no se ha aprobado su registro ó ha sido deshabilitado del sistema')
                 this.router.navigate(['/login']);
                 unsubscribe()
               }
              //this.presentAlert('Sesión iniciada como administrador')
            }else{
              console.log('usuario detectado')
              this.router.navigate(['/login']);
              this.presentAlert('Está intentando ingresar como usuario, instale la app de usuario para iniciar sesión')
              unsubscribe()
      
            }
              
            }, (error) => {
              console.log(error);
            });
            //this.router.navigate(['/pre-home']);
            //unsubscribe()
          }else{
            this.router.navigate(['/login']);
            this.showToast('Verifique su correo');
            unsubscribe()
          }
        }
         else {
          this.router.navigate(['/login']);
          unsubscribe()
        }
        });
      });
    }
    async presentAlert(message) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Mensaje',
        backdropDismiss:false,
        message:message,
        buttons: [{text: 'Ok',
        handler: () => {
          console.log('Confirm Okay');
          
        }}]
      });
  
      await alert.present();
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
