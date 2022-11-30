import {Component, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { MessageService } from "./services/message.service";
import { FormControl } from '@angular/forms';
import { DOCUMENT } from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {AppConfig} from "./config/app.config";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  onDestroy: Subject<boolean> = new Subject<boolean>();

  title = 'Poe-it';
  isSignedIn = false;
  isAdmin = false;
  displayname = '';

  toggleControl: FormControl;

  constructor(private router: Router,
              private authService: AuthService,
              private messageService: MessageService,
              private pageTitle: Title,
              @Inject(DOCUMENT) private document: Document) {

    // Change page title
    pageTitle.setTitle(this.title)

    // Check for preferred theme (dark mode / light mode) of the system.
    const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set the preferred theme.
    this.toggleControl = new FormControl(prefersDarkMode);

    if (prefersDarkMode) {
      this.document.body.classList.add('dark');
    }
  }

  public ngOnInit(): void {
    // Update the username and login state on every UserAuthChangedEvent.
    this.messageService.UserAuthChangedEvent.pipe(takeUntil(this.onDestroy)).subscribe((value: User | null) => {
      this.isSignedIn = value !== null;
      this.isAdmin = value !== null && value.role.roleID === AppConfig.ADMIN_ROLE_ID;
      this.displayname = value !== null ? value.displayname : '';
    });

    // Update the preferred
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      if (darkMode) {
        this.document.body.classList.add('dark');
      } else {
        this.document.body.classList.remove('dark');
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next(true);
    this.onDestroy.unsubscribe();
  }

  onSignOut(): void {
    this.authService.signout().subscribe();
    this.router.navigateByUrl('/auth/signin');
  }
}
