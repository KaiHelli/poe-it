import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { MessageService } from "./message.service";

const AUTH_API = 'http://localhost:8080/v1/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'body' as const,
  responseType: 'json' as const,
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {
  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.isSignedIn().subscribe(value => {
      if (!value) {
        this.router.navigateByUrl('auth/signin')
      }
    });

    return true;
  }

  public signin(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions).pipe(
      tap((data: any) => {
        this.messageService.UserAuthChangedEvent.next(true);
      }),
      catchError(this.handleError),
    );
  }

  public signup(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      password
    }, httpOptions).pipe(
      tap((data: any) => {
        this.messageService.UserAuthChangedEvent.next(true);
      }),
      catchError(this.handleError),
    );
    ;
  }

  public signout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {
    }, httpOptions).pipe(
      tap((data: any) => {
        this.messageService.UserAuthChangedEvent.next(false);
      }),
      catchError(this.handleError),
    );
  }

  public isSignedIn(): Observable<boolean> {
    return this.http.get(AUTH_API + 'signedin', httpOptions).pipe(map(
      (data: any) => {
        if (data.message === true) {
          return true;
        }
        return false;
      }
    ));
  }

  private handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // handle client-side error
      msg = error.error.message;
    } else {
      // handle server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(msg));
  }
}
