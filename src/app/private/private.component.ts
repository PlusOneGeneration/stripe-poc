import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {NgForm} from '@angular/forms';
import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-private',
  templateUrl: 'private.component.html',
  styleUrls: ['private.component.css']
})
export class PrivateComponent {
  me: any = null;
  userStripe: any = null;
  users$: Observable< Array<any> >;
  products$: Observable< Array<any> >;
  offers$: Observable< Array<any> >;
  offersForMe$: Observable< Array<any> >;
  orders$: Observable< Array<any> >;
  error: any = {};
  productFormState: boolean = false;
  offerFormState: boolean = false;
  selectedProduct: any;
  selectedUser: any;
  stripeApi = 'https://us-central1-stripe-poc-52493.cloudfunctions.net/api';

  constructor(private db: AngularFireDatabase,
              private http: HttpClient,
              private UserService: UserService) {
    this.UserService.user$.subscribe((user) => {
      this.me = user;

      if (this.me && this.me._id) {
        this.users$ = this.db.list('/users').snapshotChanges();

        this.db.object('/stripes/'+this.me._id)
          .valueChanges()
          .subscribe((userStripe:any) => {
            this.userStripe = userStripe;
          });

        this.products$ = this.db.list('/products',
          ref => ref.orderByChild('createdBy').equalTo(this.me._id)
        ).snapshotChanges();

        this.offers$ = this.db.list('/offers',
          ref => ref.orderByChild('createdBy').equalTo(this.me._id)
        ).snapshotChanges().map((data) => {
          data.map((item) => {
            item['customer$'] = this.db.object('/users/' + item.payload.val().to).snapshotChanges();
          });
          return data;
        });

        this.offersForMe$ = this.db.list('/offers',
          ref => ref.orderByChild('to').equalTo(this.me._id)
        ).snapshotChanges().map((data) => {
          data.map((item) => {
            item['shop$'] = this.db.object('/users/' + item.payload.val().from).snapshotChanges();
          });

          // show only unpaid
          data = data.filter((item) => !item.payload.val().statusPaid);
          return data;
        });

        this.orders$ = this.db.list('/orders',
          ref => ref.orderByChild('to').equalTo(this.me._id)
        ).snapshotChanges();
      }
    });
  }

  addProduct(form) {
    if (form.value && form.valid && this.me) {
      let data = form.value;
      data['createdBy'] = this.me._id;
      this.db.list('/products')
        .push(data);
      form.reset();
    } else {
      this.error = {
        code: 'Check form',
        message: 'form data is invalid'
      }
    }
  }

  toggleProductForm() {
    this.productFormState = !this.productFormState;
  }

  toggleOfferForm() {
    this.offerFormState = !this.offerFormState;
  }

  makeOffer(form) {
    if (form.value && form.valid && this.me) {
      let data = form.value;

      data['createdBy'] = this.me._id;
      data['stripePublicKey'] = this.userStripe.public_key;
      data['from'] = this.me._id;
      data['statusPaid'] = false;

      this.db.list('/offers').push(data);

      form.reset();
      this.selectedUser = false;
      this.selectedProduct = false;
    } else {
      this.error = {
        code: 'Check form',
        message: 'form data is invalid'
      }
    }
  }

  selectProduct(prod, form) {
    if (form && form.value && prod && prod.key) {
      form.value['product'] = prod.payload.val();
      this.selectedProduct = prod.payload.val();
    }
  }

  selectUser(user, form) {
    if (form && form.value && user && user.key) {
      form.value['to'] = user.key;
      this.selectedUser = user.payload.val();
    }
  }

  cancel(form) {
    form.reset();
    this.resetError();
    this.productFormState = false;
    this.offerFormState = false;
    this.selectedUser = false;
    this.selectedProduct = false;
  }

  resetError() {
    this.error = {};
  }

  openCheckout(offer: any) {
    let stripeData = {
      name: environment.name,
      description: `Purchase: "${offer.payload.val().product.title}"`,
      amount: offer.payload.val().product.price * 100,
      email: Date.now() + this.me.email
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
      customerId: this.me._id,
      stripeId: this.me.stripeId || null,
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
