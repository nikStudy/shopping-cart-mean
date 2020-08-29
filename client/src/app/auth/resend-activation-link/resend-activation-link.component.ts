import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-resend-activation-link',
  templateUrl: './resend-activation-link.component.html',
  styleUrls: ['./resend-activation-link.component.css']
})
export class ResendActivationLinkComponent implements OnInit {

  credentialsCheck = false;
  emailAfterCheck = '';
  submitDisabled = false;

  datasaved: boolean = false;
  message: string = '';
  resendForm: FormGroup;

  constructor(private userservice: UserService, private formbuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.setFormState();
    this.credentialsCheck = false;
  }

  setFormState():void {
    this.resendForm = this.formbuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(/^([a-z\d\.-]{1,20})@([a-z\d-]{1,20})\.([a-z]{2,8})(\.[a-z]{2,8})?$/i)])],
      password: [null, Validators.required]
    });
  }

  submitData() {
    let user = this.resendForm.value;
    console.log(user);
    
    this.credentialsCheck = false;
    this.message = '';
    this.resend(user);

    
  }


  resend(user: User){
      this.userservice.resendActivationLink(user).subscribe(
        data => {
          console.log(data);
          console.log(data.message);
          console.log(data.success);
          // console.log(data.token);
          this.datasaved = true;
          this.message = data.message;
          setTimeout(() => {
            this.datasaved = false;
          }, 3000);
  
          if (data.success) {
            this.credentialsCheck = true;
            this.emailAfterCheck = data.email;
          }    
  
          if (this.credentialsCheck) {
            this.userservice.resendActivationLink2(this.emailAfterCheck).subscribe(
              result => {
                console.log(result);
                
                this.message = result.message;
                this.resendForm.reset();
                this.datasaved = true;
                setTimeout(() => {
                  this.datasaved = true;
                }, 3000);
                setTimeout(() => {
                  this.datasaved = false;
                }, 8000);

                if (result.success) {
                  this.submitDisabled = true;
                } else {
                  this.submitDisabled = false;
                }
              }
            );
          }
      });
    }

  

  // resend(user: User){
  //   this.userservice.resendActivationLink(user).subscribe(
  //     data => {
  //       console.log(data);
  //       console.log(data.message);
  //       console.log(data.success);
  //       // console.log(data.token);
  //       this.datasaved = true;
  //       this.message = data.message;
  //       setTimeout(() => {
  //         this.datasaved = false;
  //       }, 3000);

  //       if (data.success) {
  //         this.credentialsCheck = true;
  //         this.emailAfterCheck = data.email;
  //       }    

  //       if (this.credentialsCheck) {
  //         this.userservice.resendActivationLink2(this.emailAfterCheck).subscribe(
  //           result => {
  //             console.log(result);
  //             this.message = result.message;
  //             this.resendForm.reset();
  //             this.datasaved = true;
  //             setTimeout(() => {
  //               this.datasaved = true;
  //             }, 3000);
  //           }
  //         );
  //       }
  //   });
  // }

  


}
