import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map } from 'rxjs/operators'
import {AppConfig} from "../config/app.config";
interface privateCard{
  poemID: number;
  poemText: string;
  userID: number;
  timestamp: string;
}


const httpOptions = AppConfig.HTTP_OPTIONS;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../app.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private http:HttpClient) { }

  topList: any = [];

  public key: string = "";

  ngOnInit(){
    this.http.get("http://localhost:8080/v1/poems/private_top", httpOptions).subscribe((res)=>{
      this.topList = res;
      //console.log(this.publicPoem)key
      console.log(res)
      this.key = JSON.stringify(this.topList);
      console.log(this.key)
    });
  }

  onPublishPoem(): void {
  }
}
