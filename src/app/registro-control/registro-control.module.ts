import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroControlPageRoutingModule } from './registro-control-routing.module';

import { RegistroControlPage } from './registro-control.page';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroControlPageRoutingModule
  ],
  declarations: [RegistroControlPage]
})
export class RegistroControlPageModule {}
