import {Component, OnInit} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Observable} from "rxjs/Observable";
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable< Array<any> >;
  editState: boolean = false;
  error: any = null;

  constructor(private ProductService: ProductService) {
    this.products$ = this.ProductService.getProducts();
  }

  ngOnInit() {
  }

  toggleEdit() {
    this.editState = !this.editState;
  }

  addProduct(form) {
    if (form.value && form.valid) {
      this.ProductService.addProduct(form.value)
        .then(() => this.cancel(form))
        .catch((err) => {
          this.error = {
            code: 'Adding Product',
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
    this.editState = false;
  }

  resetError() {
    this.error = {};
  }
}
