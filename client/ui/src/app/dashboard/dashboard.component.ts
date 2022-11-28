import { Component, OnInit } from '@angular/core';
import {FeedService} from "../services/feed.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private feedService: FeedService) { }

  poemList: PrivatePoemFeed = [];
  errorMessage = "";
  feedValid = false;

  public key: string = "";

  ngOnInit(){
    this.feedService.getPoems().subscribe({
      next: (res: PrivatePoemFeed)=>{
        this.poemList = res;
        this.key = JSON.stringify(this.poemList);
      },
      error: err => {
        this.errorMessage = err.message;
        this.feedValid = false;
      }
    });
  }

  onPublishPoem(): void {
  }
}
