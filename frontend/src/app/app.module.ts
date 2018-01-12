import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { provideRoutes} from '@angular/router';
import {AppComponent} from './app.component';
import {AuthModule} from "./auth/auth.module";
import {AppRoutingModule} from "./app-routing.module";
import {PublicModule} from './public/public.module';
import {AuthService} from "./services/auth.service";
import {PrivateModule} from "./private/private.module";
import {SubscribeService} from "./services/subscribe.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    PublicModule,
    PrivateModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    SubscribeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
