import {HttpHeaders} from "@angular/common/http";

export class AppConfig {
  static readonly API_URL: string = 'http://localhost:8080/v1/';
  static readonly ADMIN_ROLE_ID: number = 1;
  static readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'body' as const,
    responseType: 'json' as const,
    withCredentials: true
  };
  static readonly APP_DEFAULTS = {
    cardsOnInit: 10,
    cardsOnLoad: 5,
    sorting: 'date'
  }
}
