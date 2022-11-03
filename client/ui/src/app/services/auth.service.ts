import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export class AuthService {
  constructor(private http: HttpClient) {}

  public signin(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }


  public signup(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      password
    }, httpOptions);
  }

  public signout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {
    }, httpOptions);
  }

  public isSignedIn(): Observable<any> {
    return this.http.get(AUTH_API + 'signedin', httpOptions);
  }
}
