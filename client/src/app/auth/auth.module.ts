import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserService } from './user.service';
import { SocialComponent } from './social/social.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { ActivationComponent } from './activation/activation.component';
import { ResendActivationLinkComponent } from './resend-activation-link/resend-activation-link.component';
import { SocialErrorComponent } from './social-error/social-error.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { CheckSessionComponent } from './check-session/check-session.component';
import { LoggedGuard } from './logged.guard';
import { NotLoggedGuard } from './not-logged.guard';
import { AuthInterceptor } from './auth.interceptor';
import { HttpXsrfInterceptor } from './http.interceptor';

@NgModule({
  declarations: [RegistrationComponent, LoginComponent, DashboardComponent, SocialComponent, ActivationComponent, ResendActivationLinkComponent, SocialErrorComponent, ForgotUsernameComponent, ForgotPasswordComponent, NewPasswordComponent, CheckSessionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    RecaptchaModule,
    RecaptchaFormsModule,
    AuthRoutingModule
  ],
  exports: [CheckSessionComponent],
  providers: [UserService, LoggedGuard, NotLoggedGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }]
})
export class AuthModule { }
