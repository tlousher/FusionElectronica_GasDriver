import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
 loading: any;
  constructor(public loadingController: LoadingController,public aAuth: AngularFireAuth,private router:Router) { }

  ngOnInit() {
    this.load()
    this.onLogout();
  }
  onLogout(){
   
    this.aAuth.auth.signOut();
    this.router.navigate(['/login']);
    setTimeout(() => {
      this.loading.dismiss();
    }, 3000);
    
  }
  async load(){
    this.loading = await this.loadingController.create({
      message:"Saliendo..."
    });
    this.loading.present()
  }
}
