import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserService} from "../../services/user.service";
import {environment} from "../../../environments/environment";
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {SubscribeService} from "../../services/subscribe.service";

@Injectable()
export class PaymentService {
  user: any = null;
  stripeApi = environment.apiEndpoint;

  constructor(private db: AngularFireDatabase,
              private http: HttpClient,
              private UserService: UserService,
              private SubscribeService: SubscribeService) {
    let subUser = this.UserService.getMe().subscribe((user) => this.user = user);
    this.SubscribeService.add(subUser);
  }

  updateStripe(data) {
    if (!this.user) {
      return Promise.reject(new Error('no user'));
    }

    return this.db.object('/stripes/' + this.user._id).set(data)
  }

  getStripeData() {
    return this.user && this.user._id ? this.db.object('/stripes/' + this.user._id).valueChanges() : Observable.of(null);
  }

  openCheckout(offer: any): void {
    let stripeData = {
      name: environment.name,
      description: `Purchase: "${offer.payload.val().product.title}"`,
      amount: offer.payload.val().product.price * 100,
      email: Date.now() + this.user.email // TODO: remove Date.now
    };

    let handler = (<any>window).StripeCheckout.configure({
      key: offer.payload.val().stripePublicKey,
      locale: 'auto',
      token: (token: any) => this.makePayment(token, offer, stripeData)
    });

    handler.open(stripeData);
  }

  makePayment(token: any, offer: any, stripeData: any) {
    let payload = {
      source: token.id,
      customerId: this.user._id,
      stripeCustomerId: this.user.stripeCustomerId || null,
      offerId: offer.key,
      stripePublicKey: offer.payload.val().stripePublicKey,
      shopId: offer.payload.val().createdBy
    };

    let postData = Object.assign({}, stripeData, payload);

    this.http
      .post(`${this.stripeApi}/charge`, postData)
      .subscribe(res => {
        console.log('all is good: ----> ', res);
      }, err => {
        console.log("Error occured: ----> ", err);
      });
  }
}
