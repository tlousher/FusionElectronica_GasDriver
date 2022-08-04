import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreRegistroPage } from './pre-registro.page';

const routes: Routes = [
  {
    path: '',
    component: PreRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreRegistroPageRoutingModule {}
