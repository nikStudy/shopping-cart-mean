import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
 
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';

var stripe: any;
var elements: any;

@Component({
  selector: 'app-checkout2',
  templateUrl: './checkout2.component.html',
  styleUrls: ['./checkout2.component.css']
})
export class Checkout2Component implements OnInit {
  

  @ViewChild('cardInfo') cardInfo: ElementRef;
  // elements: Elements;
  // card: StripeElement;
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string;

  products: [];
  totalPrice: Number;
  datasaved = false;
  message = '';
  paymentDisabled = false;

  // optional parameters
  // elementsOptions: ElementsOptions = {
  //   locale: 'auto'
  // };
 
  stripeTest: FormGroup;
 
  constructor(
    private router: Router,
    private productservice: ProductsService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef) {}

ngOnDestroy() {
  if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
  }
}
ngAfterViewInit() {
      const stripe   = Stripe('pk_test_WjoZqJPM8rCYZ8mNzst6ZaTr00r88kew2O');
      const elements = stripe.elements();
      this.initiateCardElement();
  }
initiateCardElement() {
      // Giving a base style here, but most of the style is in scss file
      const cardStyle = {
          base: {
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                  color: '#aab7c4',
              },
          },
          invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
          },
      };
      this.card = elements.create('card', {cardStyle});
      this.card.mount(this.cardInfo.nativeElement);
this.card.addEventListener('change', this.cardHandler);
  }
onChange({error}) {
      if (error) {
          this.cardError = error.message;
      } else {
          this.cardError = null;
      }
      this.cd.detectChanges();
  }
async createStripeToken() {
      const {token, error} = await stripe.createToken(this.card);
      if (token) {
        this.buy(token);
      } else {
          this.onError(error);
      }
  }

onError(error) {
      if (error.message) {
          this.cardError = error.message;
      }
      this.datasaved = true;
          this.message = error.message
          setTimeout(() => {
            this.datasaved = false;
          }, 3000);
  }

 
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
  }
    
 
  buy(token) {
    
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          // console.log(result.token);
          let address = this.stripeTest.get('address').value;
          let name = this.stripeTest.get('name').value;
          this.productservice.payment(token, address, name).subscribe(data => {
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