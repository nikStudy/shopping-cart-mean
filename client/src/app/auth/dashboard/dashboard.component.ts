import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name: string;
  orders: [];
  constructor(private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.userservice.getLoggedUser().subscribe(
      data =>{
        console.log(data);
        // console.log(data.success);
        if (data.success === false) {
          localStorage.removeItem("User");
          this.router.navigate(['login']);
        } else {
          this.name = data.user.name;
          this.orders = data.orders;
        }
    });
  }

  toArray(items: object) {
    return Object.keys(items).map(key => items[key])
  }

}
