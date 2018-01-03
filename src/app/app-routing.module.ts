import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {authRoutes} from './auth/auth-routing.module';
import {publicRoutes} from "./public/public-routing.module";
import {privateRoutes} from "./private/private-routing.module";

const routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      ...publicRoutes,
      ...authRoutes,
      ...privateRoutes
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
