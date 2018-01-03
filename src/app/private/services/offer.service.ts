import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserService} from "../../services/user.service";
import {PaymentService} from "./payment.service";

@Injectable()
export class OfferService {
  user: any = null;
  userStripe: any = null;

  constructor(private db: AngularFireDatabase,
              private UserService: UserService,
              private PaymentService: PaymentService) {
    this.UserService.getMe().subscribe((user) => {
      this.user = user;
      this.PaymentService.getStripeData().subscribe((userStripe: any) => this.userStripe = userStripe);
    });
  }

  addOffer(data) {
    if (!this.userStripe || !this.userStripe.public_key) {
      return Promise.reject('No Stripe key. Add Public / Secure keys to your Profile');
    }

    data['createdBy'] = this.user._id;
    data['from'] = this.user._id;
    data['statusPaid'] = false;
    data['stripePublicKey'] = this.userStripe.public_key;

    return new Promise((resolve, reject) => {
      //noinspection TypeScriptUnresolvedFunction
      return this.db.list('/offers')
        .push(data)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });

  }

  getMyOffers() {
    return this.db.list('/offers',
      ref => ref.orderByChild('createdBy').equalTo(this.user._id)
    ).snapshotChanges().map((data) => {
      data.map((item) => {
        item['customer$'] = this.UserService.getUserById(item.payload.val().to);
      });
      return data;
    })
  }

  getOffersForMe() {
    return this.db.list('/offers',
      ref => ref.orderByChild('to').equalTo(this.user._id)
    ).snapshotChanges().map((data) => {
      data.map((item) => {
        item['shop$'] = this.UserService.getUserById(item.payload.val().from);
      });

      // show only unpaid
      data = data.filter((item) => !item.payload.val().statusPaid);
      return data;
    });
  }

  getMyOrders() {
    return this.db.list('/orders',
      ref => ref.orderByChild('to').equalTo(this.user._id)
    ).snapshotChanges();
  }
}
