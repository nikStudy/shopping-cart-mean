import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  captchaPassed = false;
  resendButton = false;
  loginDisabled = false;

  datasaved: boolean = false;
  message: string = '';
  loginForm: FormGroup;

  csrfToken: any;

  constructor(private userservice: UserService, private formbuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.setFormState();
    this.captchaPassed = false;
    // this.userservice.get().toPromise().then(data => {
    //   this.csrfToken = data.csrfToken;
    //   console.log(this.csrfToken);
    //   this.setFormState();
    // });
  }

  setFormState():void {
    this.loginForm = this.formbuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required],
      recaptchaReactive: [null, Validators.required],
      _csrf: [this.csrfToken, Validators.required],
    });
  }

  submitData() {
    let user = this.loginForm.value;
    // console.log(user);

    this.message = '';
    this.login(user);
  }

  login(user: User){
    this.userservice.loginUser(user).toPromise().then(
      data =>{
        // console.log(data);
        // console.log(data.message);
        // console.log(data.token);
        this.datasaved = true;
        this.message = data.message;
        setTimeout(() => {
          this.datasaved = false;
        }, 3000);
        // this.loginForm.reset();
        if(data.token){
          this.loginForm.reset();
          localStorage.setItem("User", JSON.stringify(data.token));
          if (data.message === 'Auth successful... Redirecting to Checkout') {
            this.router.navigate(['checkout']);
          } else {
            this.router.navigate(['dashboard']);
          }
          setTimeout(() => {
            window.location.reload();  
          }, 1);
        }

        this.resendButton = false;
        if(data.expired) {
          this.loginDisabled = true;
          this.resendButton = true;
          setTimeout(() => {
            this.resendButton = false;
          }, 10000);
        } else {
          this.loginDisabled = false;
        }
    });
  }

  //function to resolve the reCaptcha and retrieve a token
  async resolved(captchaResponse: string) {
    // console.log(`Resolved response token: ${captchaResponse}`);
    await this.sendCaptchaTokenToBackend(captchaResponse); //declaring the token send function with a token parameter
    // await this.sendTokenToBackend(`${captchaResponse}`); //declaring the token send function with a token parameter
  }

  //function to send the token to the node server
  sendCaptchaTokenToBackend(tok){
    //calling the service and passing the token to the service
    this.userservice.sendCaptchaToken(tok).subscribe(
      data => {
        // console.log(data)
        this.captchaPassed = data.success;
        console.log('captcha passed: ' + this.captchaPassed)
      },
      err => {
        console.log(err)
      },
      () => {}
    );
  }

  filldata() {
    this.loginForm.patchValue({
      email: 'nikhil.mittal60@gmail.com',
      password: '123123'
    });
    this.captchaPassed = true;
  }



}
