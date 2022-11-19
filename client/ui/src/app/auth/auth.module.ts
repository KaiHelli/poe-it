import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

import { ValidateEqualModule } from  'ng-validate-equal';

import { MaterialModule } from '../helper/material.module';
import { FormsModule } from '@angular/forms';
import { UnicodePatternDirective } from "../validators/unicode-pattern.directive";
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    UnicodePatternDirective,
    AccountComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    FormsModule,
    ValidateEqualModule
  ]
})
export class AuthModule { }
