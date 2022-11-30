import {Component, Inject} from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { FeedService } from "../../services/feed.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {
  reportText: string = "";
  reportValid: boolean = true;
  errorMessage: string = "";

  constructor(
    public snackBar: MatSnackBar,
    private feedService: FeedService,
    private dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
  }

  onSubmit(): void {
    this.feedService.createReport(this.data, this.reportText).subscribe({
      next: _ => {
        this.snackBar.open('Successfully reported poem!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });

        this.dialogRef.close(true);
      },
      error: err => {
        this.snackBar.open(`Failed to report poem! ${err.message}`, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });

        this.dialogRef.close(false);
      }
    });
  }
}
