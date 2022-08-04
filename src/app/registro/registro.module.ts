import { PipesModule } from './../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPage } from './registro.page';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot({hardwareBackButton: false}),
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: RegistroPage }]),
    MaterialModule
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
