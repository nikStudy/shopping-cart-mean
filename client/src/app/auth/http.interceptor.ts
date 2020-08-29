import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ɵparseCookieValue } from '@angular/common';


@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {

  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName = "X-XSRF-TOKEN";
    let token = this.tokenExtractor.getToken() as string;
    // let token = ɵparseCookieValue(document.cookie, "XSRF-TOKEN") as string;
    console.log('token' + token);
    if (token !== null && !req.headers.has(headerName)) {
      console.log('hello');
      req = req.clone({ headers: req.headers.set(headerName, token), withCredentials: true });
    }
    return next.handle(req);
  }
}