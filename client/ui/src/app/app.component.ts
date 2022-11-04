import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { MessageService } from "./services/message.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Poe-it';
  isSignedIn = false;

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {
    this.authService.isSignedIn().subscribe((value: boolean) => {
      this.isSignedIn = value
    })

    this.messageService.UserAuthChangedEvent.subscribe(value => {
      this.isSignedIn = value;
    })
  }

  ngOnInit(): void {
  }

  onSignOut(): void {
    this.authService.signout().subscribe();
    this.router.navigateByUrl('/auth/signin');
  }
}
