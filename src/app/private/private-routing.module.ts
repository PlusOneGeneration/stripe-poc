import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PrivateComponent} from "./private.component";
import {PrivateCanActivate} from "./private.canActivate";
import {ProfileComponent} from "./profile/profile.component";
import {BlankComponent} from "./blank/blank.component";

export const privateRoutes: Routes = [
  {
    path: 'private',
    component: BlankComponent,
    canActivate: [PrivateCanActivate],
    children: [
      {
        path: '',
        component: PrivateComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {path: '**', redirectTo: '/'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(privateRoutes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {
}
