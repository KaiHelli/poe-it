import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from "./admin-routing.module";
import { ReportsComponent } from './reports/reports.component';

import { MaterialModule } from '../helper/material.module';
import { FormsModule } from "@angular/forms";
import { GeneralComponentsModule } from "../general/general-components.module";

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    GeneralComponentsModule
  ]
})
export class AdminModule { }
