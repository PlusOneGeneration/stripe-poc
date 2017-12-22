import {Injectable} from "@angular/core";
import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable()
export class PrivateCanActivate implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.authService
        .isAuthenticated()
        .then((authResult) => resolve(!!authResult))
        .catch((err) => {
          console.log('[PrivateCanActivate ERROR]:', err);
          this.router.navigateByUrl('/auth');
          return resolve(true)
        })
    })
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
}
