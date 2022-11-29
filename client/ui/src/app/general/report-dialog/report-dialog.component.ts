import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

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
    public snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.snackBar.open(`Failed to report poem!`, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }
}
