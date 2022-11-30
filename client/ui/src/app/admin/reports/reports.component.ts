import { Component } from '@angular/core';
import {AppConfig} from "../../config/app.config";
import {FeedService} from "../../services/feed.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss', '../../app.component.scss']
})
export class ReportsComponent {
  reportList: ReportFeed = [];
  errorMessage = "";
  feedValid = true;

  reportsLoaded = 0;
  reachedEnd = false;

  constructor(
    private feedService: FeedService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(){
    this.loadReports(AppConfig.APP_DEFAULTS.cardsOnInit, this.reportsLoaded);
  }

  loadReports(numReports: number, offset: number, resetArray: boolean = false): void {
    this.feedService.getReports(numReports, offset).subscribe({
      next: (res: ReportFeed) => {
        if (resetArray) {
          this.reportList = [];
          this.reportsLoaded = 0;
        }

        this.reportList = [...this.reportList, ...res]
        this.reportsLoaded += res.length;

        if (res.length < numReports) {
          this.reachedEnd = true;
        }
      },
      error: err => {
        this.errorMessage = err.message;
        this.feedValid = false;
      }
    });
  }

  onLoadReports(): void {
    this.loadReports(AppConfig.APP_DEFAULTS.cardsOnLoad, this.reportsLoaded);
  }

  onDestroyCard(value: Report): void {
    const index = this.reportList.indexOf(value);

    if (index >= 0) {
      this.reportList.splice(index, 1);
    }
  }
}
