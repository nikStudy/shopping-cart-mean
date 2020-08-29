import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsService } from './products.service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { LoggedGuard } from './logged.guard';
import { Checkout2Component } from './checkout2/checkout2.component';

@NgModule({
  declarations: [ProductsListComponent, ShoppingCartComponent, CheckoutComponent, Checkout2Component],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_WjoZqJPM8rCYZ8mNzst6ZaTr00r88kew2O'),
    ProductsRoutingModule
  ],
  providers: [ProductsService, LoggedGuard]
})
export class ProductsModule { }
