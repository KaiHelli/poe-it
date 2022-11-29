import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../helper/material.module';

import { PublicCardComponent } from './public-card/public-card.component';
import { PoemCardComponent } from "./poem-card/poem-card.component";
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { FormsModule } from "@angular/forms";
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    PublicCardComponent,
    PoemCardComponent,
    FilterBarComponent,
    ReportDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    PublicCardComponent,
    PoemCardComponent,
    FilterBarComponent
  ]
})
export class GeneralComponentsModule { }
