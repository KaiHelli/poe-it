import { Injectable } from '@angular/core';
import {AppConfig} from "../config/app.config";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MessageService} from "./message.service";
import {catchError, Observable, tap} from "rxjs";
import {ErrorModule} from "../helper/error.module";

const USER_API = AppConfig.API_URL + 'user/';

const httpOptions = AppConfig.HTTP_OPTIONS;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  public changeFollowedState(userID: number, state: boolean): Observable<any> {
    return this.http.post(USER_API + userID + '/follow/', {follow: state}, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }


}
