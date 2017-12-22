import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-private',
  templateUrl: 'private.component.html',
  styleUrls: ['private.component.css']
})
export class PrivateComponent implements OnInit {
  me: any = null;
  users$: Observable< Array<any> >;
  products$: Observable< Array<any> >;
  error: any = {};
  productFormState: boolean = false;

  constructor(private db: AngularFireDatabase,
              private UserService: UserService) {
    this.UserService.user$.subscribe((user) => {
      this.me = user;

      if (this.me && this.me._id) {
        this.users$ = this.db.list('/users').snapshotChanges();
        this.products$ = this.db.list('/products', ref => ref.orderByChild('createdBy').equalTo(this.me._id)).snapshotChanges();
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

  cancel(form) {
    form.reset();
    this.resetError();
    this.toggleProductForm();
  }

  resetError() {
    this.error = {};
  }

  ngOnInit() {
  }
}
