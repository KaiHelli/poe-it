import { Component } from '@angular/core';
import { FeedService } from "../../services/feed.service";

@Component({
  selector: 'app-public-card',
  templateUrl: './public-card.component.html',
  styleUrls: ['./public-card.component.scss', '../../app.component.scss']
})

export class PublicCardComponent  {
  public publicPoem!: PublicPoem;

  errorMessage: string = "";
  poemValid: boolean = true;

  constructor(private feedService: FeedService) {
    feedService.getPublicPoem().subscribe({
      next: (res: PublicPoem) => {
      this.publicPoem = res
    },
    error: err => {
      this.errorMessage = err.message;
      this.poemValid = false;
    }
  });
  }
}



