import { Component } from '@angular/core';
import { FeedService } from "../../services/feed.service";

@Component({
  selector: 'app-public-card',
  templateUrl: './public-card.component.html',
  styleUrls: ['./public-card.component.scss', '../../app.component.scss']
})

export class PublicCardComponent  {
  public publicPoem!: PublicPoem;
  poemID: number = 7  
  title: string = ""
  name: string = ""
  text: string = ""
  tags: string = ""
  errorMessage: string = "";
  poemValid: boolean = true;

  constructor(private feedService: FeedService) {
    let id : any;
    feedService.getPublicPoem().subscribe({
      next: (res: PublicPoem) => {
        this.publicPoem = res;
        this.title = res.poemTitle;
        this.name = res.poetName;
        this.text = res.poemText;
        id = res.poemID;

        feedService.getPublicPoemTags(id).subscribe(
          res => {
            this.tags = res.tags
          });
      },
      error: err => {
        this.errorMessage = err.message;
        this.poemValid = false;
      }
    });
    
    
  }
}



