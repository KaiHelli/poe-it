import {Component, OnInit, ViewChild} from '@angular/core';
import {FeedService} from "../services/feed.service";
import {AppConfig} from "../config/app.config";
import { AuthService } from "../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  displayname = '';
  userID = '';
  publishValidPoem = true;
  publishPoemErrorMessage = '';
  poemText = '';
  poemList: PrivatePoemFeed = [];
  errorMessage = "";
  feedValid = true;

  poemsLoaded = 0;
  reachedEnd = false;

  keywords: string[] = [];
  sorting: string = AppConfig.APP_DEFAULTS.sorting;
  filter: string[] = [];

  constructor(
    private feedService: FeedService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http:HttpClient) {
  }

  ngOnInit(){
    this.loadPoems(AppConfig.APP_DEFAULTS.cardsOnInit, this.poemsLoaded, this.keywords, this.sorting, this.filter);
    this.displayname = this.authService.user!.displayname;
    this.userID = this.authService.user!.userID.toString();
  }

  loadPoems(numPoems: number, offset: number, keywords: string[], sorting: string, filter: string[], resetArray: boolean = false): void {
    this.feedService.getPoems(numPoems, offset, keywords, sorting, filter).subscribe({
      next: (res: PrivatePoemFeed) => {
        if (resetArray) {
          this.poemList = [];
          this.poemsLoaded = 0;
        }

        this.poemList = [...this.poemList, ...res]
        this.poemsLoaded += res.length;

        if (res.length < numPoems) {
          this.reachedEnd = true;
        }
      },
      error: err => {
        this.errorMessage = err.message;
        this.feedValid = false;
      }
    });
  }

  onPublishPoem(): void {
    this.feedService.publish(this.userID,this.poemText).subscribe({
      next: _ => {
        this.publishValidPoem = true;

        this.snackBar.open('Poem published successfully.', 'Close',{
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        })
      },
      error: err => {
        this.publishPoemErrorMessage = err.message;
        this.publishValidPoem = false;
      }
    })


  }

  onLoadPoems(): void {
    this.loadPoems(AppConfig.APP_DEFAULTS.cardsOnLoad, this.poemsLoaded, this.keywords, this.sorting, this.filter);
  }

  onKeywordsChange(value: string[]): void {
    this.keywords = value;
    this.loadPoems(AppConfig.APP_DEFAULTS.cardsOnLoad, 0, this.keywords, this.sorting, this.filter, true);
  }

  onSortingChange(value: string): void {
    this.sorting = value === "" ? AppConfig.APP_DEFAULTS.sorting : value;
    this.loadPoems(AppConfig.APP_DEFAULTS.cardsOnLoad, 0, this.keywords, this.sorting, this.filter, true);
  }

  onFilterChanged(value: string[]): void {
    this.filter = value;
    this.loadPoems(AppConfig.APP_DEFAULTS.cardsOnLoad, 0, this.keywords, this.sorting, this.filter, true);
  }

  onDestroyCard(value: PrivatePoem): void {
    const index = this.poemList.indexOf(value);

    if (index >= 0) {
      this.poemList.splice(index, 1);
    }
  }
}
