import {Component, OnInit} from '@angular/core';
import {OfferService} from "../services/offer.service";
import {Observable} from "rxjs/Observable";
import {PaymentService} from "../services/payment.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  offersForMe$: Observable< Array<any> >;
  orders$: Observable< Array<any> >;

  constructor(private OfferService: OfferService,
              private PaymentService: PaymentService) {
    this.offersForMe$ = this.OfferService.getOffersForMe();
    this.orders$ = this.OfferService.getMyOrders();
  }

  ngOnInit() {
  }

  openCheckout(offer: any) {
    this.PaymentService.openCheckout(offer);
  }
}
