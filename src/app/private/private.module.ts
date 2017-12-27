import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrivateComponent} from './private.component';
import {PrivateCanActivate} from "./private.canActivate";
import {WithoutPipe} from "../pipes/without.pipe";
import {FormsModule} from "@angular/forms";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    HttpClientModule
  ],
  declarations: [
    PrivateComponent,
    WithoutPipe
  ],
  providers: [
    PrivateCanActivate,
    WithoutPipe
  ],
  exports: [
    PrivateComponent,
    HttpClientModule
  ]
})
export class PrivateModule {
}
