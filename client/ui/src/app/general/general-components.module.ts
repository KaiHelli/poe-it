import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../helper/material.module';

import { PublicCardComponent } from './public-card/public-card.component';
import { PoemCardComponent } from "./poem-card/poem-card.component";
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    PublicCardComponent,
    PoemCardComponent,
    FilterBarComponent
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
