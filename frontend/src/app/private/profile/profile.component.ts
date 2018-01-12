import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgForm} from '@angular/forms';
import {PaymentService} from "../services/payment.service";
import {SubscribeService} from "../../services/subscribe.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  me: any = null;
  stripe: any = null;

  constructor(private UserService: UserService,
              private PaymentService: PaymentService,
              private SubscribeService: SubscribeService) {
    let subUser = this.UserService.getMe().subscribe((user) => {
      this.me = user;

      let subStripe = this.PaymentService.getStripeData().subscribe((stripe) => this.stripe = stripe);
      this.SubscribeService.add(subStripe);
    });
    this.SubscribeService.add(subUser);
  }

  ngOnInit() {
  }

  update(form:NgForm) {
    this.UserService.updateUserData(this.me, form.value)
      .then((res) => console.log('>>>>> update User res', res))
      .catch((err) => console.log('>>>>> update User err', err));
  }

  updateStripe(form:NgForm) {
    this.PaymentService.updateStripe(form.value)
      .then((res) => console.log('>>>>> update Stripe res', res))
      .catch((err) => console.log('>>>>> update Stripe err', err));
  }

}
