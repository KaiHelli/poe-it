import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-public-card',
  templateUrl: './public-card.component.html',
  styleUrls: ['./public-card.component.scss', '../../app.component.scss']
})

export class PublicCardComponent  {
  public publicPoem: any = {};
  constructor(private http:HttpClient) { }

  ngOnInit(){
    this.http.get("http://localhost:8080/v1/poems/public").subscribe((res)=>{
      this.publicPoem = res
      //console.log(this.publicPoem)
      //this.keys = JSON.stringify(Object.keys(this.publicPoem));
    });
  }
}



