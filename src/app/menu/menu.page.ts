import { NavigationService } from './../services/navigation.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  textMessage:any;
  toast: any;
  pages =
    [
     /* {
        title : "Ubicaciones",
        url   : "/menu/menu/location",
        icon  : "navigate"
      },
      {
        title : "Cilindro",
        url   : "/menu/menu/color",
        icon  : "color-palette"
      },*/
      {
        title : "Salir",
        url   : "/logout",
        icon  : "log-in"
      },
    ]
    selectedPath='';

  constructor(
    private navigationService:NavigationService,
    public aAuth: AngularFireAuth,
    private router:Router,
    public toastController: ToastController) { 
    this.router.events.subscribe((event: RouterEvent)=>{
      this.selectedPath=event.url;
    }); 
   
}
  ngOnInit() {}
  goToPageHome(){
    this.navigationService.navigatePageHome()

  }
  ruta(p:any){
    
    if(p=='Ubicaciones'){
  this.navigationService.navigatePageLocation();

    }
    if(p=='Cilindro'){
      this.navigationService.navigatePageColor();
    }
  if(p=='Salir'){
    this.router.navigate(["/logout"])
  }
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
