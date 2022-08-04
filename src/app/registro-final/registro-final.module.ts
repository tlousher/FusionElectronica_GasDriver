import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { RegistroFinalPageRoutingModule } from './registro-final-routing.module';

import { RegistroFinalPage } from './registro-final.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistroFinalPageRoutingModule
  ],
  declarations: [RegistroFinalPage]
})
export class RegistroFinalPageModule {}
