import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../management.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

  users: [];
  accessDenied = true;
  datasaved = false;
  message = '';
  editAccess = false;
  deleteAccess = false;
  limitEntered: number;
  limit: number;

  constructor(private managementservice: ManagementService) { }
  
  ngOnInit(): void {
    this.datasaved = false;
    this.message = '';
    this.editAccess = false;
    this.deleteAccess = false;
    this.getUsers();
  }

  getUsers() {
    this.managementservice.getAllUsers().subscribe(data => {
      // console.log(data);
      if(data.success) {
        if (data.permission === 'admin' || data.permission === 'moderator') {
          this.users = data.users;
          this.accessDenied = false;
          if (data.permission === 'moderator') {
            this.editAccess = true;
          } else if (data.permission === 'admin') {
            this.editAccess = true;
            this.deleteAccess = true;
          }
        } else {
          this.datasaved = true;
          this.message = data.message;
        }
      } else {
        this.datasaved = true;
        this.message = data.message;
      }
    });
  }

  showLimited() {
    this.datasaved = false;
    this.message = '';
    if (this.limitEntered > 0) {
      this.limit = this.limitEntered;
    } else {
      this.datasaved = true;
      this.message = 'Please enter a valid number';
      this.limitEntered = null;
    }
  }

  showAll() {
    this.limit = undefined;
    this.datasaved = false;
    this.message = '';
  }

  deleteUser(username: string) {
    this.managementservice.deleteUser(username).subscribe(data => {
        console.log(data);
        this.datasaved = true;
        this.message = data.message;
        if (data.success) {
          this.getUsers();
        }
    });
  }

}
