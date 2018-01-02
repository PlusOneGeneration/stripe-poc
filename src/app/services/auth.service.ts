import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private afAuth: AngularFireAuth,
              private router: Router) {
    this.afAuth.auth.onAuthStateChanged((user) => {
      this.userService.updateUser(user);
      if (user && user.uid) {
        this.router.navigateByUrl('/private');
      } else {
        this.router.navigateByUrl('/auth');
      }
    });
  }

  isAuthenticated(): Promise<boolean|any> {
    return new Promise((resolve) => {
      this.userService.getMe()
        .subscribe((user) => {
          console.log('>>>>> user', user)
          if (user && (user._id || user.uid)) {
            return resolve(`logged in: ${user.uid || user._id}`);
          } else {
            return resolve(false);
          }
        });
    });
  }
}
