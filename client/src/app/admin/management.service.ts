import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(private http: HttpClient) { }

  getPermission(): Observable<any>{
    // const url = 'http://localhost:4000/api/permission/';
    const url = '/api/permission/';
    return this.http.get<any>(url);
  }

  getAllUsers(): Observable<any>{
    // const url = 'http://localhost:4000/api/management/';
    const url = '/api/management/';
    return this.http.get<any>(url);
  }

  deleteUser(username: string): Observable<any>{
    // const url = 'http://localhost:4000/api/management/';
    const url = '/api/management/';
    return this.http.delete<any>(url + username);
  }

  getUser(id): Observable<any>{
    // const url = 'http://localhost:4000/api/edit/';
    const url = '/api/edit/';
    return this.http.get<any>(url + id);
  }

  updateUser(user, id): Observable<any>{
    // const url = 'http://localhost:4000/api/edit/';
    const url = '/api/edit/';
    return this.http.put<any>(url, { user: user, id: id });
  }

  get(): Observable<any>{
    // const url = 'http://localhost:4000/auth/';
    const url = '/api/auth/';
    return this.http.get<any>(url);
  }


}
