import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthModule } from './auth/auth.module';
import { StaticPagesModule } from './static-pages/static-pages.module';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { ManagementService } from './admin/management.service';
import { ProductsModule } from './products/products.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    StaticPagesModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [CookieService, ManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
