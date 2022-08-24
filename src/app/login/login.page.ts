import { FirestoreService } from './../services/firestore.service';
import { NavigationService } from './../services/navigation.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/user.class' ;
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loading: any;
  isLogged: boolean;
  message: any;
  textMessage: any;
  user: User = new User();
  toast: any;
  private todo: FormGroup;
  type = 'password';
  zone: NgZone;

  constructor(
    private alertController: AlertController,
    private firestoreService: FirestoreService,
    private navigationService: NavigationService,
    private aAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    private authSvc: AuthService,
    public toastController: ToastController) {

    this.todo = this.formBuilder.group({
      email: [''],
      clave: [''],
    });

  }

  ngOnInit = () => {

  }

  logForm() {

    if (this.todo.value.email === '' || this.todo.value.clave === '' ) {
       this.textMessage = 'Llene todos los campos';
       this.showToast();

    } else {

      this.onLoad();
      console.log(this.todo.value);
      this.user.email = this.todo.value.email;
      this.user.password = this.todo.value.clave;
      this.onLogin();
    }
  }
  consultarPedido() {
    this.firestoreService.consultarData('pedido-tracking',
    firebase.auth().currentUser.email).subscribe((res) => {
          if (res.exists) {
            this.quitLoad();
            this.navigationService.navigatePagePedido();

          } else {

            localStorage.setItem('email', this.todo.value.email);
            this.firestoreService.updateProfile(this.todo.value.email, {fcm_token: localStorage.fcm_token});
            this.quitLoad();
            this.navigationService.navigatePageHome();
          }


    }, (error) => {
      this.quitLoad();
      console.log(error);
    });
  }
  async onLogin() {
    const user = await this.authSvc.onLogin(this.user);
    if (user) {
      if (user.user.emailVerified === true) {
        // this.router.navigate(['menu/menu/home']);
        this.firestoreService.consultarUsuarios('drivers', this.todo.value.email).
        subscribe((res) => {

          console.log('Consulta realizada');
          if (res.exists) {
            console.log('chofer detectado');
            if (res.data().status === true) {

            this.consultarPedido();
          } else {
            this.quitLoad();
            this.showToastVerified('Aún no se ha aprobado su registro ó ha sido deshabilitado del sistema');
          }
        } else {
          this.quitLoad();
          console.log('usuario detectado');
          this.presentAlert('Está intentando ingresar como usuario, instale la app de usuario para iniciar sesión');

        }

        }, (error) => {
          this.quitLoad();
          console.log(error);
        });
      } else {
         this.showToastVerified('Verifique su correo');
         this.quitLoad();
      }

    } else {
      this.message = this.authSvc.errormessage;
      if (this.message === 'auth/wrong-password') {
        this.quitLoad();
        this.textMessage = 'Contraseña incorrecta';
        this.showToast();

      }
      if (this.message === 'auth/user-not-found') {
        this.quitLoad();
        this.textMessage = 'Correo no registrado';
        this.showToast();

     }
      if (this.message === 'auth/invalid-email') {
      this.quitLoad();
      this.textMessage = 'Email inválido';
      this.showToast();

   }

    }
  }
  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Mensaje',
      backdropDismiss: false,
      message,
      buttons: [{text: 'Ok',
      handler: () => {
        console.log('Confirm Okay');

      }}]
    });

    await alert.present();
  }
  eventHandler(e) {
    console.log(e);
    if (e.code === 13) {
      e.preventDefault();
      this.logForm();
      return false;
    }
  }

  async onLoad() {

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Iniciando...',
    });
    await this.loading.present();

  }
  async quitLoad() {
    setTimeout(() => {
      this.loading.dismiss();
    }, 2000);
  }
  showToast() {
    this.toast = this.toastController.create({
      message: this.textMessage,
      duration: 2000
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });
  }
  showToastVerified(message) {
    this.toast = this.toastController.create({
      message,
      duration: 2000
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });
  }
  showPassword() {
    console.log('showPassword');
    console.log(this.type);
    this.type = this.type === 'text' ? 'password' : 'text';


  }
}
