import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { MaterialModule } from '../material.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot({hardwareBackButton: false}),
    RouterModule.forChild([{ path: '', component: LoginPage }]),
    MaterialModule
    
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
