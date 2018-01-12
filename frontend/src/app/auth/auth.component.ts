import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  tab: number = 1;
  error: any = {};

  constructor(private UserService: UserService) {
  }

  ngOnInit() {
  }

  setTab(tab) {
    this.tab = tab;
    this.error = {};
  }

  logout() {
    this.UserService.logout();
  }

  login(form) {
    if (form.value && form.valid) {
      this.UserService.login(form.value.email, form.value.password)
        .then(() => form.reset())
        .catch((err) => this.error = err);
    } else {
      this.error = {
        code: 'Check form',
        message: 'form data is invalid'
      }
    }
  }

  signup(form) {
    if (form.value && form.valid) {
      this.UserService.signup(form.value.email, form.value.password, form.value.fullName)
        .then((res) => form.reset())
        .catch((err) => this.error = err);
    } else {
      this.error = {
        code: 'Check form',
        message: 'form data is invalid'
      }
    }
  }

  resetError() {
    this.error = {};
  }
}
