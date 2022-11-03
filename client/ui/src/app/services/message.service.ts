import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public UserAuthChangedEvent : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
}
