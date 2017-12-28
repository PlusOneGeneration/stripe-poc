import {Injectable} from "@angular/core";
import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthCanActivate implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //TODO @@@slava remove new Promise
    return new Promise((resolve) => {
      this.authService
        .isAuthenticated()
        .then((authResult) => resolve(!authResult))
        .catch((err) => {
          console.log('[AuthCanActivate ERROR]:', err);
          this.router.navigateByUrl('/private');
          return resolve(false)
        })
    })

  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
}
