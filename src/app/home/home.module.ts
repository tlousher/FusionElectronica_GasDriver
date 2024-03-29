import { ComponentsModule } from './../components/components.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';


@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot({hardwareBackButton: false}),
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  
})
export class HomePageModule {}
