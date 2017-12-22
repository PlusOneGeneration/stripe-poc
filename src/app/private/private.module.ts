import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrivateComponent} from './private.component';
import {PrivateCanActivate} from "./private.canActivate";
import {WithoutPipe} from "../pipes/without.pipe";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    FormsModule,
    CommonModule
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
    PrivateComponent
  ]
})
export class PrivateModule {
}
