import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { MessageService } from "../../services/message.service";
import {filter, Subject, takeUntil} from "rxjs";
import {FeedService} from "../../services/feed.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-poem-card[poem]',
  templateUrl: './poem-card.component.html',
  styleUrls: ['./poem-card.component.scss', '../../app.component.scss']
})
export class PoemCardComponent implements OnInit, OnDestroy {
  onDestroy: Subject<boolean> = new Subject<boolean>();

  @Input() poem!: PrivatePoem;

  @Output() destroyCard = new EventEmitter();

  isAdmin: boolean = false;
  editPoemText: string = "";
  isEditing: boolean = false;
  isAuthor: boolean = false;

  formattedDate: string = "";

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private feedService: FeedService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.editPoemText = this.poem.poemText;
    this.isAuthor = this.authService.user!.userID === this.poem.userID;
    this.isAdmin = this.authService.isAdmin();
    this.formattedDate = new Date(this.poem.timestamp).toLocaleString("en-US");

    this.messageService.UserFollowChangedEvent.pipe(takeUntil(this.onDestroy),filter(value => value.userID === this.poem.userID && value.emittedPoemID !== this.poem.poemID)).subscribe(value => {
      this.poem.isFollowing = value.followed;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.unsubscribe();
  }

  onToggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.editPoemText = this.poem.poemText;
  }

  onToggleFavorite(): void {
    this.poem.isFavorite = !this.poem.isFavorite;
  }

  onToggleFollow(): void {
    this.poem.isFollowing = !this.poem.isFollowing;
    this.messageService.UserFollowChangedEvent.next({userID: this.poem.userID, emittedPoemID: this.poem.poemID, followed: this.poem.isFollowing});
  }

  onUpdatePost(): void {
    this.feedService.updatePoem(this.poem.poemID, this.editPoemText).subscribe({
      next: _ => {
        this.snackBar.open('Successfully updated poem!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });

        this.poem.poemText = this.editPoemText;
        this.isEditing = false;
      },
      error: err => {
        this.snackBar.open(`Failed to update poem! ${err.message}`, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });
      }
    });
  }

  onDeletePost(): void {
    this.feedService.deletePoem(this.poem.poemID).subscribe({
      next: _ => {
        this.snackBar.open('Successfully deleted poem!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });

        this.destroyCard.emit(this.poem);
      },
      error: err => {
        this.snackBar.open(`Failed to delete poem! ${err.message}`, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });
      }
    });
  }

  onReportPost(): void {
  }

  onUpvote(): void {
    this.poem.rated = 1;
    this.poem.rating = +this.poem.rating + 1;
  }

  onDownvote(): void {
    this.poem.rated = -1;
    this.poem.rating = +this.poem.rating - 1;
  }
}
