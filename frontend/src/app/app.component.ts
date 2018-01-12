import {Component} from '@angular/core';
import {UserService} from "./services/user.service";
import {SubscribeService} from "./services/subscribe.service";

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
  private SubscribeService: SubscribeService) {
    UserService.getMe().subscribe(user => this.user = user)
  }

  logout() {
    this.SubscribeService.unsubscribeAll()
      .then(() => this.UserService.logout())
      .catch(() => {
        console.log('>>>>> unsubscribeAll ERROR');
        this.UserService.logout();
      });
  }

  toggleNav() {
    this.navState = !this.navState;
  }
}
