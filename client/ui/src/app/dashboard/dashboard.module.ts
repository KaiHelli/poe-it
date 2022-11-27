import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { MaterialModule } from '../helper/material.module';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { PoemCardComponent } from "../general/poem-card/poem-card.component";
import { FilterBarComponent } from '../general/filter-bar/filter-bar.component';
import { PublicCardComponent } from '../general/public-card/public-card.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PoemCardComponent,
    FilterBarComponent,
    PublicCardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
  ]
})
export class DashboardModule { }
