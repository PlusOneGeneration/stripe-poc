import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PrivateComponent} from "./private.component";
import {PrivateCanActivate} from "./private.canActivate";

export const privateRoutes: Routes = [
  {
    path: 'private',
    component: PrivateComponent,
    canActivate: [PrivateCanActivate]
  }
];

@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class PrivateRoutingModule {
}
