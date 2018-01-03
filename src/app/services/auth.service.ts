import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {AngularFireAuth} from "angularfire2/auth";
import {Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              public afAuth: AngularFireAuth,
              private router: Router,
              private db: AngularFireDatabase) {
    this.userService.getMe().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/private');
      } else {
        this.router.navigateByUrl('/auth');
      }
    });

    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user && user.uid) {
        this.db.database.goOnline();
        this.userService.getUserById(user.uid)
          .subscribe((userDb) => {
            let user = userDb && userDb.payload && userDb.payload.val() || null;
            this.userService.updateUser(user);
          });
      } else {
        this.userService.updateUser(null);
        this.db.database.goOffline();
      }
    });
  }

  isAuthenticated(): Promise<boolean|any> {
    return new Promise((resolve) => {
      this.userService.getMe()
        .subscribe((user) => {
          if (user && (user._id || user.uid)) {
            return resolve(`logged in: ${user.uid || user._id}`);
          } else {
            return resolve(false);
          }
        });
    });
  }
}
