import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
// import * as $ from "jquery";
declare var $: any;

@Component({
  selector: 'app-check-session',
  templateUrl: './check-session.component.html',
  styleUrls: ['./check-session.component.css']
})
export class CheckSessionComponent implements OnInit {

  modalHeader: any;
  modalBody: any;
  choiceMade: boolean;
  choiceMade2: boolean;
  hideButtons: boolean = false;

  @Input() childlogoutPressed: boolean;
  constructor(private router: Router, private userservice: UserService, private http: HttpClient) { }

  ngOnChanges(): void {
    if (this.childlogoutPressed) {
      this.showModal(2);
    }
  }

  ngOnInit(): void {

    this.userservice.get().toPromise().then(() => {
    });

    const inter = setInterval(() => {
      let token = localStorage.getItem("User");
      if (token === null) {  
        // console.log('test');
        clearInterval(inter);
      } else {
        let jwtToTimestamp = function(token) {
          let base64Url = token.split('.')[1];
          let base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));
        };   
        let expireTime = jwtToTimestamp(token);
        let timeStamp = Math.floor(Date.now() / 1000);
        let timeCheck = expireTime.exp - timeStamp;
        // console.log(expireTime.exp);
        // console.log(timeStamp);
        // console.log('timecheck: ' + timeCheck);
        if(timeCheck <= 25) {
          console.log('Token will expire in 25 seconds');
          this.showModal(1);
          clearInterval(inter);
        } else {
          // console.log('Token not yet expired');
        }
      }
      token = null;
    }, 2000);
    
  }

  showModal(option) {
    this.hideButtons = false;
    this.choiceMade = false;
    this.modalHeader = undefined;
    this.modalBody = undefined;

    if (option === 1) {
      this.hideButtons = true;
      this.modalHeader = 'Timeout Warning';
      this.modalBody = 'Your session will expire in 5 minutes. Would you like to renew your session?';
      $("#myModal").modal({backdrop: "static"});
      setTimeout(() => {
        if (!this.choiceMade && !this.choiceMade2) {
        console.log('LOGGED OUT!!!');
        // this.showModal(2);
        this.endSession();
        this.hideModal();
        }
      }, 10000);
    } else if (option === 2) {
      // logout portion    
      this.modalHeader = 'Logging Out';
      $("#myModal").modal({backdrop: "static"});

      localStorage.removeItem("User");
      this.sessionClear();

      setTimeout(() => {
        this.router.navigate(['login']);
        if (!this.choiceMade) {
          console.log('LOGGED OUT!!!');
          this.hideModal();
        }
      }, 5000);
    }
    
  };

  // userUrl = 'http://localhost:4000/auth/';
  userUrl = '/api/auth/';
  sessionClear(): void{
    this.http.get(this.userUrl + 'logout/').subscribe(() => {
    });
  }

  hideModal() {
    $("#myModal").modal("hide");
  }

  endSession() {
    this.hideModal();
    this.choiceMade2 = true;
    console.log('Session has ended');
    setTimeout(() => {
      this.showModal(2);
    }, 1000);
  }

  renewSession() {
    this.choiceMade2 = true;
    console.log('Session has renewed');
    this.getUser();
  }

  
  getUser(){
    this.userservice.getLoggedUser().subscribe(
      data =>{
        console.log(data);
        console.log(data.success);
        if (data.success === false) {
          localStorage.removeItem("User");
          this.router.navigate(['login']);
        } else {
          console.log(data.user.email);
          this.userservice.renewLoginToken(data.user.email).subscribe(
            result => {
              if(result.success){
                localStorage.setItem("User", JSON.stringify(result.token));
                this.router.navigate(['dashboard']);
                setTimeout(() => {
                  window.location.reload();
                }, 1);
              } else {
                this.modalBody = result.message;
              }
            });
        }
    });
  }


}
