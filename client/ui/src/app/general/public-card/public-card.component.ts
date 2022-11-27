import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import * as _ from 'lodash';
/*
class PublicPoem {
  poemID: string = "";
  poemTitle:string = "";
  poemText:string = "";
  poetName:string= "";
}*/

@Component({
  selector: 'app-public-card',
  templateUrl: './public-card.component.html',
  styleUrls: ['./public-card.component.scss']
})

export class PublicCardComponent  {
  public  publicPoem:any = {};
  constructor(private http:HttpClient) { } 
  ngOnInit(){
    this.http.get("http://localhost:8080/v1/poems/public").subscribe((res)=>{
      this.publicPoem = res
      //console.log(this.publicPoem)
      //this.keys = JSON.stringify(Object.keys(this.publicPoem)); 
    });
     
  }


 
}
  
  

