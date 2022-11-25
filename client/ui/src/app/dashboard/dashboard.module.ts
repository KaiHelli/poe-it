import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { MaterialModule } from '../helper/material.module';
import { FormsModule } from "@angular/forms";
import { PoemCardComponent } from "../general/poem-card/poem-card.component";
import { FilterBarComponent } from '../general/filter-bar/filter-bar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PoemCardComponent,
    FilterBarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
  ]
})
export class DashboardModule { }
