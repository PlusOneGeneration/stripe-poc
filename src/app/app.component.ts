import {Component} from '@angular/core';
import {UserService} from "./services/user.service";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  user: any = null;
  navState:boolean = false;

  constructor(private UserService: UserService,
              private AuthService: AuthService) {
    UserService.user$.subscribe(user => this.user = user)
  }

  logout() {
    this.UserService.logout();
  }

  toggleNav() {
    this.navState = !this.navState;
  }
}
