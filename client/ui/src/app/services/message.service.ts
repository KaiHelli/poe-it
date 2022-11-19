import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public UserAuthChangedEvent : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor() { }
}
