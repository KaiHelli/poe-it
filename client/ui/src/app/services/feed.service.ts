import { Injectable } from '@angular/core';
import {AppConfig} from "../config/app.config";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "./message.service";
import {Observable} from "rxjs";

const POEM_API = AppConfig.API_URL + 'poems/';

const httpOptions = AppConfig.HTTP_OPTIONS;

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  public getPoems(): Observable<any> {
    return new Observable<any>();
  }

  public createPoem(poemText: string): Observable<any> {
    return new Observable<any>();
  }

  public updatePoem(poemID: number, poemText: string): Observable<any> {
    return new Observable<any>();
  }

  public deletePoem(poemID: number): Observable<any> {
    return new Observable<any>();
  }

  public changeFollowedState(userID: number, state: boolean): Observable<any> {
    return new Observable<any>();
  }

  public changeFavoriteState(poemID: number, state: boolean): Observable<any> {
    return new Observable<any>();
  }

  public updateRating(poemID: number, rating: Rating): Observable<any> {
    return new Observable<any>();
  }

  public createReport(poemID: number, reportText: string): Observable<any> {
    return new Observable<any>();
  }
}
