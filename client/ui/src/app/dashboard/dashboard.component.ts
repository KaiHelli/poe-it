import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  onPublishPoem(): void {
  }
}
