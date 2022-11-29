import { Injectable } from '@angular/core';
import {AppConfig} from "../config/app.config";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MessageService} from "./message.service";
import {catchError, Observable, tap} from "rxjs";
import {ErrorModule} from "../helper/error.module";

const POEM_API = AppConfig.API_URL + 'poems/';


const httpOptions = AppConfig.HTTP_OPTIONS;

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  public getPoems(numPoems: number, offset: number, keywords: string[], sorting: string, filter: string[]): Observable<any> {
    let params = new HttpParams({
      fromObject: {
        numPoems: numPoems,
        offset: offset,
        keywords: keywords,
        orderBy: sorting,
        filterFollowing: filter.includes('following'),
        filterPersonal: filter.includes('personal'),
        filterFavorite: filter.includes('favorite')
      }
    });

    return this.http.get(POEM_API + "private/", {...httpOptions, params: params}).pipe(
      catchError(ErrorModule.handleError),
    );
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
