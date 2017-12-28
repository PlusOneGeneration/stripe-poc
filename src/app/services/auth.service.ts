import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private afAuth: AngularFireAuth,
              private router: Router) {
    //TODO @@@slava this.afAuth.auth.onAuthStateChanged((user) => { seems like can be removed
    //TODO @@@slava it seems like we just can listen to user form user service
    //TODO @@@slava it will collect afAuth usage in one place instead of multiple refs in multipe service
    //TODO @@@slava SRP (single responsibility) only one service should listen to onAuthStateChanged

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
          if (user && (user._id || user.uid)) {
            //TODO @@@slava make sense to make it bool only
            return resolve(`logged in: ${user.uid || user._id}`);
          } else {
            return resolve(false);
          }
        });
    });
  }
}
