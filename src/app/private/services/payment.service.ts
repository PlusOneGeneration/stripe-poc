import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PaymentService {
  user: any = null;
  constructor(private db: AngularFireDatabase,
              private UserService:UserService) {
    this.UserService.user$.subscribe((user) => this.user = user);
  }

  updateStripe(data) {
    if (!this.user) {
      return Promise.reject(new Error('no user'));
    }

    return this.db.object('/stripes/' + this.user._id).set(data)
  }

  getStripeData() {
    return this.db.object('/stripes/' + this.user._id).valueChanges()
  }
}
