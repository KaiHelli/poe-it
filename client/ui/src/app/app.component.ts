import {Component, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { MessageService } from "./services/message.service";
import { FormControl } from '@angular/forms';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Poe-it';
  isSignedIn = false;
  displayname = '';

  toggleControl: FormControl;

  constructor(private router: Router,
              private authService: AuthService,
              private messageService: MessageService,
              @Inject(DOCUMENT) private document: Document) {

    // Check for preferred theme (dark mode / light mode) of the system.
    const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set the preferred theme.
    this.toggleControl = new FormControl(prefersDarkMode);
    this.document.body.classList.add(prefersDarkMode ? 'dark' : 'light');
  }

  public ngOnInit(): void {
    // Update the username and login state on every UserAuthChangedEvent.
    this.messageService.UserAuthChangedEvent.subscribe((value: User | null) => {
      console.log(value);
      this.isSignedIn = value !== null;
      this.displayname = value !== null ? value.displayname : '';
    });

    // Update the preferred
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      if (darkMode) {
        this.document.body.classList.replace('light', 'dark');
      } else {
        this.document.body.classList.replace('dark', 'light');
      }
    });
  }

  public ngOnDestroy(): void {
    this.messageService.UserAuthChangedEvent.unsubscribe();
  }

  onSignOut(): void {
    this.authService.signout().subscribe();
    this.router.navigateByUrl('/auth/signin');
  }
}
