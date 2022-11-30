import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MessageService } from "../../services/message.service";
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss', '../../app.component.scss']
})
export class AccountComponent implements OnInit {
  private onDestroy: Subject<boolean> = new Subject<boolean>();

  public changeUsernameValid = true;
  public changePasswordValid = true;
  public newUsername = '';
  public curPassword = '';
  public newPassword = '';
  public newPasswordConfirm = '';
  public changeUsernameErrorMessage = '';
  public changePasswordErrorMessage = '';

  public displayname = '';
  public userID = '';

  public userStatistics: UserStatistics = {totalScore: 0, numPoems: 0};

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.displayname = this.authService.user!.displayname;
    this.userID = this.authService.user!.userID.toString();

    this.userService.getUserStatistics().subscribe({
      next: res => {
        this.userStatistics = res;
      },
      error: err => {
        this.snackBar.open(`Failed to retrieve user statistics! ${err.message}`, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });
      }
    })

    this.messageService.UserAuthChangedEvent.pipe(takeUntil(this.onDestroy)).subscribe((value: User | null) => {
      this.displayname = value !== null ? value.displayname : '';
      this.userID = value !== null ? value.userID.toString() : '';
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.unsubscribe();
  }

  public onChangeUsernameSubmit(): void {
    this.changeUsernameValid = true;

    this.authService.changeUsername(this.newUsername).subscribe({
      next: _ => {
        this.changeUsernameValid = true;

        this.snackBar.open('Username changed successfully.', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });
      },
      error: err => {
        this.changeUsernameErrorMessage = err.message;
        this.changeUsernameValid = false;
      }
    });
  }

  public onChangePasswordSubmit() : void {
    this.changePasswordValid = true;

    this.authService.changePassword(this.curPassword, this.newPassword).subscribe({
      next: _ => {
        this.changePasswordValid = true;

        this.snackBar.open('Password changed successfully.', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });
      },
      error: err => {
        this.changePasswordErrorMessage = err.message;
        this.changePasswordValid = false;
      }
    });
  }
}
