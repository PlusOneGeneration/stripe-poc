import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from '@angular/forms';
import {OfferService} from "../../services/offer.service";
import {UserService} from "../../../services/user.service";
import {ProductService} from "../../services/product.service";
import {Observable} from "rxjs/Observable";
import {SubscribeService} from "../../../services/subscribe.service";

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrls: ['./make-offer.component.css']
})
export class MakeOfferComponent implements OnInit, OnDestroy {
  userId: string = null;
  user: any = null;
  products$: Observable< Array<any> >;
  private sub: any;
  error: any = {};
  selectedProduct: any;
  selectedUser: any;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private UserService: UserService,
              private ProductService: ProductService,
              private OfferService: OfferService,
              private SubscribeService: SubscribeService) {
    this.sub = this.route.params.subscribe(params => {
      this.userId = params['userId'];
      let subUser = this.UserService.getUserById(params['userId']).subscribe((user) => {
        this.user = user.payload.val();
      });

      this.SubscribeService.add(subUser);
    });

    this.products$ = this.ProductService.getProducts();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectProduct(product, form) {
    if (form && form.value && product && product.key) {
      form.value['product'] = product.payload.val();
      this.selectedProduct = product.payload.val();
      this.resetError();
    }
  }

  makeOffer(form) {
    if (form.value && form.valid && form.value.product && this.userId) {
      form.value['to'] = this.userId;
      this.OfferService.addOffer(form.value)
        .then(() => {
          form.reset();
          this.router.navigateByUrl('/private/offers');
        })
        .catch((err) => {
          this.error = {
            code: 'Adding Offer',
            message: 'Something goes wrong: ' + err
          };
        });
    } else {
      this.error = {
        code: 'Check form',
        message: 'form data is invalid'
      }
    }
  }

  cancel(form) {
    form.reset();
    this.resetError();
    this.selectedUser = false;
    this.selectedProduct = false;
    this.router.navigateByUrl('/private/offers');
  }

  resetError() {
    this.error = {};
  }

}
