import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrivateComponent} from './private.component';
import {PrivateCanActivate} from "./private.canActivate";
import {WithoutPipe} from "../pipes/without.pipe";
import {FormsModule} from "@angular/forms";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ProfileComponent} from './profile/profile.component';
import {BlankComponent} from './blank/blank.component';
import {PrivateRoutingModule} from "./private-routing.module";
import {PaymentService} from "./services/payment.service";

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
    WithoutPipe,
    ProfileComponent,
    BlankComponent
  ],
  providers: [
    PrivateCanActivate,
    WithoutPipe,
    PaymentService
  ],
  exports: [
    PrivateComponent,
    HttpClientModule
  ]
})
export class PrivateModule {
}
