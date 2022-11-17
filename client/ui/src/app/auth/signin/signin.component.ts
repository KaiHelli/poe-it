import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

/*type User = {
  username: string;
  roles: string[];
};*/

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
  // TODO: Display errors and maybe verify input (will be done by backend aswell though).
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
    this.loginValid = true;

    this.authService.signin(this.username, this.password).subscribe({
      next: _ => {
        this.loginValid = true;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.errorMessage = err.message ;
        this.loginValid = false;
      }
    });
  }

}
