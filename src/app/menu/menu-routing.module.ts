import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
         {
        path: 'home/:counter',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
           },
       
             {
                path: 'pedido/:counter',
                loadChildren: () => import('../pedido/pedido.module').then(m => m.PedidoPageModule)
                   },
               
          {
            path: '',
            redirectTo: '/menu/menu/home',
            pathMatch: 'full'
          }
        ]
      },
     
      {
        path: '',
        redirectTo: '/menu/menu/home',
        pathMatch: 'full'
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
