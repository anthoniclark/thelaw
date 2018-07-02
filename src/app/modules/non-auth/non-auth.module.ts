import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from 'app/modules/non-auth/login/login.component';
import { LoginService } from 'app/modules/non-auth/login/login.service';
import { NonAuthService } from 'app/modules/non-auth/non-auth.service';
import { NonAuthRouting } from 'app/modules/non-auth/non-auth.routing';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    NonAuthRouting,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent
  ],
  providers: [
    LoginService,
    NonAuthService
  ]
})
export class NonAuthModule { }
