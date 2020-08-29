import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  show: boolean = false;
  captchaPassed = false;
  registerDisabled = false;

  datasaved: boolean = false;
  message: string = '';
  regForm: FormGroup;

  constructor(private userservice: UserService, private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerDisabled = false;
    this.setFormState();
    this.show = false;
    this.captchaPassed = false;
  }

  setFormState():void {
    this.regForm = this.formbuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\. ]{1,50}$/i)])],
      username: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\d]{5,12}$/i)])],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(/^([a-z\d\.-]{1,30})@([a-z\d-]{1,20})\.([a-z]{2,8})(\.[a-z]{2,8})?$/i)])],
      password: [null, Validators.compose([Validators.required, Validators.pattern(/^(?=.*[-@_])[\w@-]{6,20}$/)])],
      confirmPassword: [null, Validators.required],
      recaptchaReactive: [null, Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : { 'mismatch': true};
  }

  postdata() {
    let user = this.regForm.value;
    // console.log(user);

    this.message = '';
    this.createNewUser(user);
  }

  createNewUser(user: User){
    this.userservice.createUser(user).subscribe(
      data =>{
        console.log(data.message);
        this.datasaved = true;
        this.message = data.message;
        setTimeout(() => {
          this.datasaved = false;
        }, 4000);
        
        if (data.success) {
          this.registerDisabled = true;
          this.regForm.reset();
        } else {
          this.registerDisabled = false;
        }
    });
  }

  revealPass() {
    this.show = !this.show;
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
    this.regForm.patchValue({
      name: 'BoGGDJ WJDLO',
      username: 'tokomoko',
      email: 'abc@abc.co.in',
      password: '123123',
      confirmPassword: '123123',
      recaptchaReactive: true
    });
    this.captchaPassed = true;
  }



}
