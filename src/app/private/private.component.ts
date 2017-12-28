import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import {NgForm} from '@angular/forms';
import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';

//TODO @@@slava it seems all functionality in the one controller
//TODO @@@slava it make sense to split to routing and multiple controllers
@Component({
  selector: 'app-private',
  templateUrl: 'private.component.html',
  styleUrls: ['private.component.css']
})
export class PrivateComponent {
  me: any = null;
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

  //TODO @@@slava make it configurable in environment
  stripeApi = 'https://us-central1-stripe-poc-52493.cloudfunctions.net/api';

  constructor(private db: AngularFireDatabase,
              private http: HttpClient,
              private UserService: UserService) {

    //TODO @@@slava private db: AngularFireDatabase must be removed from Component/Controller part,
    //TODO @@@slava please extract all methods to the service and make it re-usable and readable
    //TODO @@@slava use YourService instead of db: AngularFireDatabase
    //TODO @@@slava please decide how many service do you need it seems like 2-3 services should help to solve the component tasks

    //TODO @@@slava please re-think it could be part of service, I mean codebase bellow
    // This part could be refactored to service, seems like common re-usable code
    //
    // this.products$ = this.db.list('/products',
    //   ref => ref.orderByChild('createdBy').equalTo(this.me._id)
    // ).snapshotChanges();
    //
    // this.offers$ = this.db.list('/offers',

    this.UserService.user$.subscribe((user) => {
      this.me = user;

      //TODO @@@slava can it be without ._id?
      if (this.me && this.me._id) {
        this.users$ = this.db.list('/users').snapshotChanges();
        //TODO @@@slava please take care about un-subscribe for this.users$ and other *$ props

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
    //TODO @@@slava please don't use this.db directly in the controller
    //TODO @@@slava please extract readable and re-usable methods to service
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
      data['from'] = this.me._id;
      data['statusPaid'] = false;

      //TODO @@@slava to service, etc..
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

    //TODO @@@slava 'Stripe POC' remove magic words
    let stripeData = {
      name: 'Stripe POC',
      description: `Purchase: "${offer.payload.val().product.title}"`,
      amount: offer.payload.val().product.price * 100,
      email: this.me.email
    };

    //TODO @@@slava to separated checkout service
    let handler = (<any>window).StripeCheckout.configure({
      key: environment.stripe.key,
      locale: 'auto',
      token: (token: any) => this.makePayment(token, offer, stripeData)
    });

    handler.open(stripeData);
  }

  makePayment(token: any, offer: any, stripeData: any) {
    let payload = {
      source: token.id,
      email: this.me.email,
      customerId: this.me._id,
      stripeId: this.me.stripeId || null,
      offerId: offer.key
    };

    let postData = Object.assign({}, stripeData, payload);

    //TODO @@@slava to service
    this.http
      .post(`${this.stripeApi}/charge`, postData)
      .subscribe(res => {
        console.log('all is good: ----> ', res);
      }, err => {
        console.log("Error occured: ----> ", err);
      });
  }
}
