import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private counter = 0;

  constructor(private navCtrl: NavController) {}

  navigatePageLocation() {
    this.counter += 1;
    this.navCtrl.navigateRoot(`/menu/menu/location/${this.counter}`);
  }
  navigatePageColor() {
    this.counter += 1;
    this.navCtrl.navigateRoot(`/menu/menu/color/${this.counter}`);
  }
  navigatePageHome() {
    this.counter += 1;
    this.navCtrl.navigateRoot(`/menu/menu/home/${this.counter}`);
  }
  navigatePagePedido() {
    this.counter += 1;
    this.navCtrl.navigateRoot(`/menu/menu/pedido/${this.counter}`);
  }
  
}
