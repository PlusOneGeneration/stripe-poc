import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrivateComponent} from './private.component';
import {PrivateCanActivate} from "./private.canActivate";
import {WithoutUserPipe} from "../pipes/without-user.pipe";
import {FormsModule} from "@angular/forms";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ProfileComponent} from './profile/profile.component';
import {BlankComponent} from './blank/blank.component';
import {PrivateRoutingModule} from "./private-routing.module";
import {PaymentService} from "./services/payment.service";
import {ProductService} from "./services/product.service";
import {OfferService} from "./services/offer.service";
import {ProductsComponent} from './products/products.component';
import {OffersComponent} from './offers/offers.component';
import {OrdersComponent} from './orders/orders.component';
import {MakeOfferComponent} from './offers/make-offer/make-offer.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    HttpClientModule,
    PrivateRoutingModule
  ],
  declarations: [
    PrivateComponent,
    WithoutUserPipe,
    ProfileComponent,
    BlankComponent,
    ProductsComponent,
    OffersComponent,
    OrdersComponent,
    MakeOfferComponent
  ],
  providers: [
    PrivateCanActivate,
    WithoutUserPipe,
    PaymentService,
    ProductService,
    OfferService
  ],
  exports: [
    PrivateComponent,
    HttpClientModule
  ]
})
export class PrivateModule {
}
