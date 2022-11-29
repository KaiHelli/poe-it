import { HttpClient, HttpParams, HttpHeaders , HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { MessageService } from "./message.service";
import { Injectable } from '@angular/core';
import { AppConfig } from "../config/app.config";
//import { ErrorModule } from "../helper/error.module"

const POEM_API = AppConfig.API_URL + 'auth/';
//const httpOptions = AppConfig.HTTP_OPTIONS;

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  constructor(
    private http: HttpClient,
    private router: Router, 
    private messageService: MessageService) { }

  public publish(userID: string, poemText: string): Observable<any> {
    return this.http.post(POEM_API + 'private/publish/' + userID + '/' + poemText, {}/*, httpOptions*/).pipe(
      //catchError(ErrorModule.handleError),
    );
  }


}
