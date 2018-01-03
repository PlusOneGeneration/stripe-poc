import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {OfferService} from "../services/offer.service";
import {Observable} from "rxjs/Observable";
import {NgForm} from '@angular/forms';
import {SubscribeService} from "../../services/subscribe.service";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  me: any = null;
  users$: Observable< Array<any> >;
  offers$: Observable< Array<any> >;

  constructor(private UserService: UserService,
              private OfferService: OfferService,
              private SubscribeService: SubscribeService) {
    let sub = this.UserService.getMe().subscribe((user) => {
      this.me = user;

      if (this.me) {
        this.users$ = this.UserService.getUsers();
        this.offers$ = this.OfferService.getMyOffers();
      }
    });

    this.SubscribeService.add(sub);
  }

  ngOnInit() {
  }

}
