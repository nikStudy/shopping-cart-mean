import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any>{
    const productUrl = '/api/products/';
    return this.http.get<any>(productUrl);
  }

  addItemToCart(id): Observable<any>{
    const url = '/api/add-to-cart/';
    return this.http.get<any>(url + id);
  }

  reduceByOne(id): Observable<any>{
    const url = '/api/reduce/';
    return this.http.get<any>(url + id);
  }

  removeProduct(id): Observable<any>{
    const url = '/api/remove/';
    return this.http.get<any>(url + id);
  }

  shoppingCart(): Observable<any>{
    const url = '/api/shopping-cart/';
    return this.http.get<any>(url);
  }

  checkout(): Observable<any>{
    const url = '/api/checkout/';
    return this.http.get<any>(url);
  }

  payment(id, address, name): Observable<any>{
    const url = '/api/order/';
    return this.http.post<any>(url, {stripeToken: id, address: address, name: name});
  }
}
