import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

/*type User = {
  username: string;
  roles: string[];
};*/

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../../app.component.scss']
})
export class SignupComponent implements OnInit {
  public signupValid = true;
  public username = '';
  public password = '';
  public passwordConfirm = '';

  public errorMessage = '';

  private readonly returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
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
    this.signupValid = true;

    this.authService.signup(this.username, this.password).subscribe({
      next: _ => {
        this.signupValid = true;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.errorMessage = err.message;
        this.signupValid = false;
      }
    });
  }

}
