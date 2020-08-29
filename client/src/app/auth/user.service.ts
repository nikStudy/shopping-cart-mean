import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // userUrl = 'http://localhost:4000/auth/';
  userUrl = '/api/auth/';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<User>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.post<User>(this.userUrl + 'register/', user, options);
  }

  loginUser(user: User): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.post<any>(this.userUrl + 'login/', user, options);
  }

  resendActivationLink(user: User): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.post<any>(this.userUrl + 'resend/', user, options);
  }

  resendActivationLink2(email): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.put<any>(this.userUrl + 'resend/', {email: email}, options);
  }

  // getUserUrl = 'http://localhost:4000/profile/';
  getUserUrl = '/api/profile/';

  getLoggedUser(): Observable<any>{
    // let httpheaders = new HttpHeaders({'Content-Type': 'Application/Json', "authorization": localStorage.getItem("User")});
    // let httpheaders = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("User"));
    // let options = {
    //   headers: httpheaders,
    // }
    return this.http.get<any>(this.getUserUrl);
  }

  // backendUrl = 'http://localhost:4000/';
  backendUrl = '/api/';
  sendCaptchaToken(token) {
    return this.http.post<any>(this.backendUrl + "token_validate/", {recaptcha: token})
  }

  activateAccount(token) {
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.put<any>(this.userUrl + 'activate/' + token, options);
  }

  resetUsername(email: string): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.get<any>(this.userUrl + 'resetusername/' + email, options);
  }

  sendPasswordLink(user: any): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.put<any>(this.userUrl + 'resetpassword/', user, options);
  }

  getResetPassProfile(token: any): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.get<any>(this.userUrl + 'resetpassword/' + token, options);
  }

  resetPassword(user: any): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.put<any>(this.userUrl + 'savenewpassword/', user, options);
  }

  renewLoginToken(email: any): Observable<any>{
    let httpheader= new HttpHeaders().set('Content-Type', 'Application/Json');
    let options = {
      headers: httpheader
    }
    return this.http.get<any>(this.userUrl + 'renewToken/' + email, options);
  }

  get(): Observable<any>{
    // const url = 'http://localhost:4000/auth/';
    const url = '/api/auth/';
    return this.http.get<any>(url);
  }

  
}
