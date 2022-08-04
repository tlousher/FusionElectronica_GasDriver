import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  loading:any;
  constructor(private loadingController:LoadingController) { 


  }

  ngOnInit() {}

  async presentLoading() {
    this.loading = await this.loadingController.create({
     cssClass: 'my-custom-class',
     message: 'Cargando...',
   });
   await this.loading.present();
  }
  logout(){
    
  }

}
