import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SocialComponent } from './social/social.component';
import { ActivationComponent } from './activation/activation.component';
import { ResendActivationLinkComponent } from './resend-activation-link/resend-activation-link.component';
import { SocialErrorComponent } from './social-error/social-error.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { LoggedGuard } from './logged.guard';
import { NotLoggedGuard } from './not-logged.guard';


const routes: Routes = [
  {path: 'registration', component: RegistrationComponent, canActivate: [NotLoggedGuard]},
  {path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [LoggedGuard]},
  {path: 'social/:token', component: SocialComponent, canActivate: [LoggedGuard]},
  {path: 'activate/:token', component: ActivationComponent, canActivate: [NotLoggedGuard]},
  {path: 'resend', component: ResendActivationLinkComponent, canActivate: [NotLoggedGuard]},
  {path: 'social-error', component: SocialErrorComponent, canActivate: [NotLoggedGuard]},
  {path: 'forgotusername', component: ForgotUsernameComponent, canActivate: [NotLoggedGuard]},
  {path: 'forgotpassword', component: ForgotPasswordComponent, canActivate: [NotLoggedGuard]},
  {path: 'reset/:token', component: NewPasswordComponent, canActivate: [NotLoggedGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
