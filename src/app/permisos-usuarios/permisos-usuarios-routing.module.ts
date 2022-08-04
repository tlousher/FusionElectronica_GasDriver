import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermisosUsuariosPage } from './permisos-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: PermisosUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermisosUsuariosPageRoutingModule {}
