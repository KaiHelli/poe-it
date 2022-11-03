import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public loginValid = true;
  public username = '';
  public password = '';
  // TODO: Display errors and maybe verify input (will be done by backend aswell though).
  public errorMessage = '';

  private readonly returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  public ngOnInit(): void {
    this.authService.isSignedIn().subscribe({
      next: data => {
        if (data.message === true) {
          this.loginValid = true;
          this.router.navigateByUrl(this.returnUrl).then(() => {
            window.location.reload();
          });
        }
      }
    });
  }

  public onSubmit(): void {
    this.loginValid = true;

    this.authService.signin(this.username, this.password).subscribe({
      next: _ => {
        this.loginValid = true;
        this.router.navigateByUrl(this.returnUrl).then(() => {
          window.location.reload();
        });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.loginValid = false;
      }
    });
  }

}
