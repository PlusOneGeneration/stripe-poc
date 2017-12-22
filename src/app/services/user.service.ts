import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class UserService {
  user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user && user.uid) {
        this.db.database.goOnline();
        this.db.object(`/users/${user.uid}`).valueChanges()
          .subscribe((userDb) => this.updateUser(userDb))
      } else {
        this.updateUser(null);
        this.db.database.goOffline();
      }
    });
  }

  updateUser(user) {
    this.user$.next(user);
  }

  getMe() {
    return this.user$;
  }

  login(email: string, pass: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, pass)
  }

  signup(email: string, pass: string, name: string) {
    let createUser = (user) => {
      return {
        _id: user.uid,
        fullName: name,
        email: email
      }
    };

    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, pass)
      .then((user) => {
        user && user.uid && this.db.list('/users')
          .set(user.uid, createUser(user));
      })
      .catch((err: any) => {
        // Ensure User in DB if already exists in FB AUTH but not in FB DB
        if (err && err.code === 'auth/email-already-in-use') {
          this.login(email, pass)
            .then((user) => {
              if (user && user.uid) {
                this.db.list('/users', ref => ref.orderByChild('_id').equalTo(user.uid))
                  .valueChanges()
                  .subscribe((userInDb) => {
                    if (userInDb && !userInDb.length) {
                      this.db.list('/users')
                        .set(user.uid, createUser(user));
                    }
                  });
              }
            })
            .catch((err) => {
              console.log('>>>>> email-already-in-use', err);
            });
        }
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
