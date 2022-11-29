import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PoemService } from "../services/poem.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  public displayname = '';
  public userID = '';
  public publishValidPoem = true;
  public publishPoemErrorMessage = '';
  public poemText = '';

  constructor(
    private authService: AuthService,
    private poemService: PoemService,
    private snackBar: MatSnackBar,
    private http:HttpClient
    ) { }

  ngOnInit(): void {
    this.displayname = this.authService.user!.displayname;
    this.userID = this.authService.user!.userID.toString();
  }

  onPublishPoem(): void {
    this.poemService.publish(this.userID,this.poemText).subscribe({
      next: _ => {
        this.publishValidPoem = true;

        this.snackBar.open('Poem published successfully.', 'Close',{
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        })
      },
      error: err => {
        this.publishPoemErrorMessage = err.message;
        this.publishValidPoem = false;
      }
    })

  }
}
