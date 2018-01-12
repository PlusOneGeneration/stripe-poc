import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserService} from "../../services/user.service";

@Injectable()
export class ProductService {
  user: any = null;

  constructor(private db: AngularFireDatabase,
              private UserService: UserService) {
    this.UserService.getMe().subscribe((user) => this.user = user);
  }

  getProducts() {
    return this.db.list('/products/' + this.user._id,
      ref => ref.orderByChild('createdBy').equalTo(this.user._id)
    ).snapshotChanges();
  }

  addProduct(data) {
    data['createdBy'] = this.user._id;

    return new Promise((resolve, reject) => {
      //noinspection TypeScriptUnresolvedFunction
      return this.db.list('/products/' + this.user._id)
        .push(data)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }
}
