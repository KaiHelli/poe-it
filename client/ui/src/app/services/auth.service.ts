import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { MessageService } from "./message.service";
import { AppConfig } from "../config/app.config";

const AUTH_API = AppConfig.API_URL + 'auth/';

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'body' as const,
  responseType: 'json' as const,
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {
  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {
    // Create an initial UserAuthChangedEvent once the AuthService is started.
    // This makes sure that all services are initialized with the correct state ones the website is opened up.
    this.isSignedIn().subscribe(_ => {
      this.messageService.UserAuthChangedEvent.next(this.user);
    });
  }

  public user: User | null = null;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isSignedIn().pipe(map(value => {
        if (value === true) {
          return true;
        } else {
          this.router.navigateByUrl('auth/signin');
          return false;
        }
      }
    ))
  }

  public signin(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions).pipe(
      tap((data: any) => {
        this.user = data.user;
        this.messageService.UserAuthChangedEvent.next(this.user);
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
        this.user = data.user;
        this.messageService.UserAuthChangedEvent.next(this.user);
      }),
      catchError(this.handleError),
    );
  }

  public changePassword(curPassword: string, newPassword: string): Observable<any> {
    return this.http.post(AUTH_API + 'changePassword', {
      curPassword,
      newPassword
    }, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  public changeUsername(newUsername: string): Observable<any> {
    return this.http.post(AUTH_API + 'changeUsername', {
      newUsername
    }, httpOptions).pipe(
      tap((data: any) => {
        this.user = {...data.user, role: this.user!.role};
        this.messageService.UserAuthChangedEvent.next(this.user);
      }),
      catchError(this.handleError),
    );
  }

  public signout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {
    }, httpOptions).pipe(
      tap(_ => {
        this.user = null;
        this.messageService.UserAuthChangedEvent.next(null);
      }),
      catchError(this.handleError),
    );
  }

  public isSignedIn(): Observable<boolean> {
    return this.http.get(AUTH_API + 'signedin', httpOptions).pipe(map(
      (data: any) => {
        if (data.signedIn === true) {
          this.user = data.user;
          return true;
        }
        return false;
      }
    ));
  }

  public isAdmin(): boolean {
    return this.user !== null && this.user.role.roleID === AppConfig.ADMIN_ROLE_ID;
  }

  private handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // handle client-side error
      msg = `Error: ${error.error.message}`;
    } else {
      // handle server-side error
      msg = `Error ${error.status}:\n ${error.error["errors"].join("\n")}`;
    }
    return throwError(() => new Error(msg));
  }
}
