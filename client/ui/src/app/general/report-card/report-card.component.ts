import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { MessageService } from "../../services/message.service";
import {FeedService} from "../../services/feed.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {UserService} from "../../services/user.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-report-card[report]',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss', '../../app.component.scss']
})
export class ReportCardComponent implements OnInit, OnDestroy {
  onDestroy: Subject<boolean> = new Subject<boolean>();

  @Input() report!: Report;

  @Input() inputsDisabled: boolean = false;

  @Output() destroyCard = new EventEmitter();

  formattedDate: string = "";

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private feedService: FeedService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.formattedDate = new Date(this.report.timestamp).toLocaleString("en-US", {timeZoneName: 'short'});
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.unsubscribe();
  }

  onDeleteReport(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm',
        content: 'Are you sure you want to delete this report?',
        cancelText: 'Cancel',
        confirmText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feedService.deleteReport(this.report.poemID, this.report.reportingUserID).subscribe({
          next: _ => {
            this.snackBar.open('Successfully deleted report!', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 3000
            });

            this.destroyCard.emit(this.report);
          },
          error: err => {
            this.snackBar.open(`Failed to delete report! ${err.message}`, 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 3000
            });
          }
        });
      }
    })
  }

  onDeletePoem(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm',
        content: 'Are you sure you want to delete this poem?',
        cancelText: 'Cancel',
        confirmText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feedService.deletePoem(this.report.poemID).subscribe({
          next: _ => {
            this.snackBar.open('Successfully deleted poem!', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 3000
            });

            this.destroyCard.emit(this.report);
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
    })
  }
}
