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

  public deleteReport(poemID: number, userID: number): Observable<any> {
    return this.http.delete(POEM_API + "private/" + poemID + "/report/" + userID, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public getReports(numReports: number, offset: number): Observable<any> {
    let params = new HttpParams({
      fromObject: {
        numReports: numReports,
        offset: offset
      }
    });

    return this.http.get(POEM_API + "reports/", {...httpOptions, params: params}).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public createPoem(poemText: string): Observable<any> {
    return this.http.post(POEM_API + 'private/', {poemText: poemText}, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public updatePoem(poemID: number, poemText: string): Observable<any> {
    return this.http.put(POEM_API + "private/" + poemID, {
      poemText
    }, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public deletePoem(poemID: number): Observable<any> {
    return this.http.delete(POEM_API + "private/" + poemID, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public changeFavoriteState(poemID: number, state: boolean): Observable<any> {
    return this.http.post(POEM_API + 'private/' + poemID + '/favorite/', {favorite: state}, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public updateRating(poemID: number, rating: Rating): Observable<any> {
    return this.http.post(POEM_API + 'private/' + poemID + '/rate/' + rating, {}, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public createReport(poemID: number, reportText: string): Observable<any> {
    return this.http.post(POEM_API + 'private/' + poemID + '/report/', {reportText: reportText}, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }

  public getPublicPoem(): Observable<any> {
    return this.http.get(POEM_API + 'public/', httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }
  public getPublicPoemTags(poemID: number): Observable<any> {
    return this.http.get(POEM_API + 'public/tags/' + poemID, httpOptions).pipe(
      catchError(ErrorModule.handleError),
    );
  }
}
