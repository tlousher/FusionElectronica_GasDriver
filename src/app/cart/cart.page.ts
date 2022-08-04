import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import {CartService} from '../services/cart.service';
import {Subscription} from 'rxjs/Subscription';
import * as firebase from 'Firebase';
import { AngularFireDatabase } from '@angular/fire/database';
interface IFirebaseTodo {
  description?: string;
  index: number;
  name: string;
  isComplete: boolean;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  items: any;
  subscription: Subscription;
  arrayCantidades:any=[]
  count:any=0
  array:any=[]
  valor:any='Sin Items Agregados'
  total:any=0
  
  constructor(public router:Router,public toastCtrl: ToastController,public cartService:CartService,public db: AngularFireDatabase) {}
  ngOnInit() {
    this.cargar()
  }

  cargar(){
   this.count=0
   this.array=[];
   this.db.list<IFirebaseTodo>('Sistema/carrito/'+firebase.auth().currentUser.uid).valueChanges().subscribe((res: IFirebaseTodo[]) => {
    console.log(res);
    res.forEach((item) => {
       
        const valor1=item['producto']
        const valor2=item['subtotal']
        const valor4=item['cantidad']
        const sub=parseFloat(valor2)
        this.total=this.total+sub;
        this.arrayCantidades={
          'cantidad':valor4,
          'id':this.count,
          'producto':valor1,
          'subtotal':valor2

        }
        this.count=this.count+1
        this.array.push(this.arrayCantidades)
      

        });
      });
  
  }
  back(){
    this.router.navigate(['/menu']);
  }
  confirmar(){
    this.presentToastWithOptions()
  }
  async presentToastWithOptions() {
    const toast = await this.toastCtrl.create({
      header: 'Pedido Generado',
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
}
