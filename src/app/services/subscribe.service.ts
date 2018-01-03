import {Injectable} from '@angular/core';

@Injectable()
export class SubscribeService {
  subscribers: Array<any> = [];
  constructor() {
  }

  add(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribeAll() {
    let promises = this.subscribers.map((subscribe) => subscribe.unsubscribe());

    return Promise.all(promises);
  }
}
