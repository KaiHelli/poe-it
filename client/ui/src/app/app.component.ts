import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Poe-it';
  isSignedIn = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.isSignedIn().subscribe({
      next: data => {
        if (data.message === true) {
          this.isSignedIn = true;
        }
      }
    });
  }

  onSignOut(): void {
    this.authService.signout().subscribe({
      next: _ => {
        window.location.reload();
      }
    });
  }
}
