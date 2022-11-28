import { HttpClient, HttpHeaders , HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { MessageService } from "./message.service";
import { Injectable } from '@angular/core';
import { AppConfig } from "../config/app.config";

const AUTH_API = AppConfig.API_URL + 'auth/';

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  constructor(
    private http: HttpClient,
    private router: Router, 
    private messageService: MessageService) { }

  public publish(userID: string, poemText: string, poemID: number): Observable<any> {
    return this.http.post(AUTH_API + 'publishPoem', {
      userID,
      poemText,
      poemID
    }
    )
  }


}
