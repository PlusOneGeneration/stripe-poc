import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from "./auth.component";
import {AuthCanActivate} from "./auth.canActivate";

export const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthCanActivate]
  }
];

@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
