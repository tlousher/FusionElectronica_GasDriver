import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetpassPageRoutingModule } from './resetpass-routing.module';

import { ResetpassPage } from './resetpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({hardwareBackButton: false}),
    ReactiveFormsModule,
    ResetpassPageRoutingModule,
    MaterialModule
  ],
  declarations: [ResetpassPage]
})
export class ResetpassPageModule {}
