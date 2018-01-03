import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PrivateComponent} from "./private.component";
import {PrivateCanActivate} from "./private.canActivate";
import {ProfileComponent} from "./profile/profile.component";
import {ProductsComponent} from "./products/products.component";
import {OffersComponent} from "./offers/offers.component";
import {OrdersComponent} from "./orders/orders.component";
import {MakeOfferComponent} from "./offers/make-offer/make-offer.component";
import {BlankComponent} from "./blank/blank.component";

export const privateRoutes: Routes = [
  {
    path: 'private',
    component: PrivateComponent,
    canActivate: [PrivateCanActivate],
    children: [
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'offers',
        component: BlankComponent,
        children: [
          {
            path: '',
            component: OffersComponent
          },
          {
            path: 'make-offer/:userId',
            component: MakeOfferComponent
          }
        ]
      },
      {
        path: 'make-offer/:userId',
        component: MakeOfferComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {path: '**', redirectTo: 'products'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(privateRoutes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {
}
