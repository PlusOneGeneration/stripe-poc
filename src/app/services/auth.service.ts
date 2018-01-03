import {Injectable} from "@angular/core";
import {UserService} from "./user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {
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
