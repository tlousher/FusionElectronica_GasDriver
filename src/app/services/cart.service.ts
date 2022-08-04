import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})

 export class CartService {  

private subject = new Subject();

sendMessage(message:any) {
    this.subject.next(message);
}

clearMessage() {
    this.subject.next();
}

  getMessage(): Observable<any> {
     return this.subject.asObservable();
  }
}

