import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  onPublishPoem(): void {
  }
}
