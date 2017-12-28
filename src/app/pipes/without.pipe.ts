import { Pipe, PipeTransform } from '@angular/core';

//TODO @@@slava pretty common name, seems like withoutUser

@Pipe({
  name: 'without'
})
export class WithoutPipe implements PipeTransform {
  transform(users: Array<any>, without: any): Array<any> {
    if (users && users.length) {
      return users.filter((user) => ((user && user.key) || (user && user.uid) || (user && user._id)) !==
      ((without && without.uid) || (without && without._id)));
    } else {
      return [];
    }
  }
}
