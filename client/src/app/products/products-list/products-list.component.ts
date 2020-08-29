import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: [];
  datasaved = false;
  message = '';

  constructor(private productservice: ProductsService) { }

  ngOnInit(): void {
    this.datasaved = false;
    this.message = '';
    this.getAllProducts();
  }

  getAllProducts() {
    this.productservice.getProducts().subscribe(data => {
      // console.log(data);
      if (data.success) {
        this.datasaved = true;
        this.message = data.message;
        this.products = data.products;
      }
    });
  }

  addToCart(productId) {
    this.productservice.addItemToCart(productId).subscribe(data => {
      // console.log(data);
    });
  }

}
