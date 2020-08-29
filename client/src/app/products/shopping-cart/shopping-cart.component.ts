import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  products: [];
  totalPrice: Number;
  cartsaved = false;

  constructor(private productservice: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.cartsaved = false;
    this.getShoppingCart();
  }

  getShoppingCart() {
    this.productservice.shoppingCart().subscribe(data => {
      // console.log(data);
      if (data.success) {
        this.products = data.products;
        this.totalPrice = data.totalPrice;
        this.cartsaved = true;
        if (this.totalPrice === 0) {
          this.cartsaved = false;
        }
      }
    });
  }

  checkout() {
    this.productservice.checkout().subscribe(data => {
      if (data.success) {
        this.router.navigate(['/checkout']);
      }
    });
  }

  reduce(id) {
    this.productservice.reduceByOne(id).subscribe(data => {
      if (data.success) {
        this.getShoppingCart();
      }
    });
  }

  remove(id) {
    this.productservice.removeProduct(id).subscribe(data => {
      if (data.success) {
        this.getShoppingCart();
      }
    });
  }

}
