import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AuthService} from '../services/auth.service';
import {UserService} from "../services/user.service";
import {FormsModule} from "@angular/forms";
import {AuthCanActivate} from "./auth.canActivate";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  declarations: [
    AuthComponent
  ],
  providers: [
    AuthCanActivate,
    AuthService,
    UserService
  ]
})
export class AuthModule {
}
