import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PermisosUsuariosPageRoutingModule } from './permisos-usuarios-routing.module';

import { PermisosUsuariosPage } from './permisos-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PermisosUsuariosPageRoutingModule
  ],
  declarations: [PermisosUsuariosPage]
})
export class PermisosUsuariosPageModule {}
