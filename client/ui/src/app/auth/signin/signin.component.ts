import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../app.component.scss']
})
export class SigninComponent implements OnInit {

  public loginValid = true;
  //public user: User = {username: '', roles: []};
  public username = '';
  public password = '';
  public errorMessage = '';

  private readonly returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.returnUrl = '/dashboard';
  }

  public ngOnInit(): void {
    this.authService.isSignedIn().subscribe(value => {
      if (value) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  public onSubmit(): void {
    this.loginValid = true;

    this.authService.signin(this.username, this.password).subscribe({
      next: _ => {
        this.loginValid = true;
        this.router.navigateByUrl(this.returnUrl);

        this.snackBar.open('Signed in successfully!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        });
      },
      error: err => {
        this.errorMessage = err.message ;
        this.loginValid = false;
      }
    });
  }

}
