import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { MaterialModule } from '../helper/material.module';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { GeneralComponentsModule } from "../general/general-components.module";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    GeneralComponentsModule
  ]
})
export class DashboardModule { }
