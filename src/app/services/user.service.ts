import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class UserService {
  user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {
  }

  updateUser(user) {
    this.user$.next(user);
  }

  getMe() {
    return this.user$;
  }

  getUsers() {
    return this.db.list('/users').snapshotChanges();
  }

  login(email: string, pass: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, pass)
  }

  updateUserData(user, data) {
    let userId = user && (user._id || user.uid) ? (user._id || user.uid) : user;
    let dataToUpdate = Object.assign({}, {
      _id: userId
    }, data);

    return new Promise((resolve, reject) => {
      return this.db.object('/users/' + userId)
        .update(dataToUpdate).then(
          () => resolve(true),
          (err) => reject(err)
        );
    });
  }

  getUserById(userId) {
    return this.db.object('/users/' + userId).snapshotChanges();
  }

  setUserById(userId, data) {
    return new Promise((resolve, reject) => {
      return this.db.list('/users').set(userId, data)
        .then(
          () => resolve(true),
          (err) => reject(err)
        );
    });
  }

  signup(email: string, pass: string, name: string) {
    let setUserData = (user) => {
      return {
        _id: user.uid,
        fullName: name,
        email: email
      }
    };

    return new Promise((resolve, reject) => {
      return this.afAuth.auth
        .createUserWithEmailAndPassword(email, pass)
        .then((authUser) => authUser && authUser.uid && this.setUserById(authUser.uid, setUserData(authUser)))
        .then((res) => resolve(res))
        .catch((err: any) => {
          // Ensure User in DB if already exists in FB AUTH but not in FB DB
          if (err && err.code === 'auth/email-already-in-use') {
            this.login(email, pass)
              .then((authUser) => {
                if (!authUser) {
                  return reject('No user after login');
                }

                this.getUserById(authUser.uid).subscribe((userInDb) => {
                  return userInDb && userInDb.payload.val() ?
                    resolve(userInDb.payload.val()) :
                    resolve(this.setUserById(authUser.uid, setUserData(authUser)));
                })
              })
              .catch((err) => reject(err));
          } else {
            return reject(err);
          }
        });
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }
}
