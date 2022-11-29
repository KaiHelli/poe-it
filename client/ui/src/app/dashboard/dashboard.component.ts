import {Component, OnInit, ViewChild} from '@angular/core';
import {FeedService} from "../services/feed.service";
import {FilterBarComponent} from "../general/filter-bar/filter-bar.component";
import {AppConfig} from "../config/app.config";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private feedService: FeedService) { }

  @ViewChild('filterBar', {static: true}) filterBar!: FilterBarComponent;

  poemList: PrivatePoemFeed = [];
  errorMessage = "";
  feedValid = true;

  poemsLoaded = 0;
  reachedEnd = false;

  keywords: string[] = [];
  sorting: string = AppConfig.APP_DEFAULTS.sorting;
  filter: string[] = [];

  ngOnInit(){
    this.loadPoems(AppConfig.APP_DEFAULTS.cardsOnInit, this.poemsLoaded, this.keywords, this.sorting, this.filter);
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
}
