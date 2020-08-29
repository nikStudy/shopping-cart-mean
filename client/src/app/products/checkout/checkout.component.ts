import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
 
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  elements: Elements;
  card: StripeElement;

  products: [];
  totalPrice: Number;
  datasaved = false;
  message = '';
  paymentDisabled = false;

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'auto'
  };
 
  stripeTest: FormGroup;
 
  constructor(
    private router: Router,
    private productservice: ProductsService,
    private fb: FormBuilder,
    private stripeService: StripeService) {}
 
  ngOnInit() {
    this.paymentDisabled = false;
    this.datasaved = false;
    this.message = '';
    this.getShoppingCart();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      cardholdername: ['', [Validators.required]]
    });
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#000000',
                fontWeight: 600,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                  color: '#ffffff',
                  fontWeight: 600,
                },
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }
 
  buy() {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          // console.log(result.token);
          let address = this.stripeTest.get('address').value;
          let name = this.stripeTest.get('name').value;
          this.productservice.payment(result.token.id, address, name).subscribe(data => {
              // console.log(data);
              this.datasaved = true;
              this.message = data.message;
              if (data.error === 'redirect') {
                setTimeout(() => {
                  this.router.navigate(['/']);  
                }, 3000);
              }
              if (data.success) {
                this.paymentDisabled = true;
                this.stripeTest.reset();
                setTimeout(() => {
                  this.router.navigate(['/']);  
                }, 3000);
              }

              setTimeout(() => {
                this.datasaved = false;
              }, 3000);
          });
        } else if (result.error) {
          // Error creating the token
          // console.log(result.error.message);
          this.datasaved = true;
          this.message = result.error.message
          setTimeout(() => {
            this.datasaved = false;
          }, 3000);
        }
      });
  }

  getShoppingCart() {
    this.productservice.shoppingCart().subscribe(data => {
      // console.log(data);
      if (data.success) {
        this.products = data.products;
        this.totalPrice = data.totalPrice;
      } else {
        this.router.navigate(['/']);
      }
    });
  }


}