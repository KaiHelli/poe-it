import { Component, Input } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { MessageService } from "../../services/message.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-poem-card',
  templateUrl: './poem-card.component.html',
  styleUrls: ['./poem-card.component.scss', '../../app.component.scss']
})
export class PoemCardComponent {
  @Input() poemID: number = 0;
  @Input() poemText: string = "";
  @Input() date: string = "";
  @Input() userID: number = 0;
  @Input() displayname: string = "";
  @Input() rating: number = 0;
  @Input() rated: Rating = null;
  @Input() favorite: boolean = false;
  @Input() followed: boolean = false;

  isAdmin: boolean = false;
  editPoemText: string;
  isEditing: boolean = false;
  isAuthor: boolean;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.editPoemText = this.poemText;
    this.isAuthor = authService.user!.userID === this.userID;
    this.isAdmin = authService.isAdmin();

    messageService.UserFollowChangedEvent.pipe(filter(value => value.userID === this.userID && value.emittedPoemID !== this.poemID)).subscribe(value => {
      this.followed = value.followed;
    })
  }

  onToggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.editPoemText = this.poemText;
  }

  onToggleFavorite(): void {
    this.favorite = !this.favorite;
  }

  onToggleFollow(): void {
    this.followed = !this.followed;
    this.messageService.UserFollowChangedEvent.next({userID: this.userID, emittedPoemID: this.poemID, followed: this.followed});
  }

  onUpdatePost(): void {
  }

  onUpvote(): void {
    this.rated = 1;
    this.rating += 1;
  }

  onDownvote(): void {
    this.rated = -1;
    this.rating -= 1;
  }
}
