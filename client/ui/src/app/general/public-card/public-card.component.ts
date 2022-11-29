import { Component } from '@angular/core';
import { FeedService } from "../../services/feed.service";

@Component({
  selector: 'app-public-card',
  templateUrl: './public-card.component.html',
  styleUrls: ['./public-card.component.scss', '../../app.component.scss']
})

export class PublicCardComponent  {
  public publicPoem!: PublicPoem;

  title: string = ""
  name: string = ""
  text: string = ""

  errorMessage: string = "";
  poemValid: boolean = true;

  constructor(private feedService: FeedService) {
    feedService.getPublicPoem().subscribe({
      next: (res: PublicPoem) => {
      this.publicPoem = res;
      this.title = res.poemTitle;
      this.name = res.poetName;
      this.text = res.poemText;
    },
    error: err => {
      this.errorMessage = err.message;
      this.poemValid = false;
    }
  });
  }
}



