import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  show: boolean = false;
  showForm: boolean = false;
  resetDisabled = false;

  datasaved: boolean = false;
  message: string = '';
  resetForm: FormGroup;

  constructor(private userservice: UserService, private formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.datasaved = false;
    this.showForm = false;
    console.log(this.route.snapshot.params.token);
    this.getResetPasswordProfile(this.route.snapshot.params.token);

    this.setFormState();
    this.show = false;
  }

  setFormState():void {
    this.resetForm = this.formbuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.pattern(/^(?=.*[-@_])[\w@-]{6,20}$/)])],
      confirmPassword: [null, Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : { 'mismatch': true};
  }

  getResetPasswordProfile(token) {
    this.userservice.getResetPassProfile(token).subscribe(
      data =>{
      console.log(data);
      this.datasaved = true;
      this.message = data.message;
      if (data.success) {
        this.showForm = true;
        this.message = 'Please enter a new password';
        this.resetForm.patchValue({
          email: data.user.email
        });
      } 
    });
  }

  postdata() {
    let user = this.resetForm.value;
    console.log(user);

    this.message = '';
    this.resetPass(user);
  }

  resetPass(user: any){
    this.userservice.resetPassword(user).subscribe(
      data =>{
        console.log(data.message);
        this.datasaved = true;
        this.message = data.message;
        // setTimeout(() => {
        //   this.datasaved = false;
        // }, 5000);
        
        if (data.success) {
          this.resetDisabled = true;
          this.resetForm.reset();
          this.message = data.message + '......Redirecting to Login Page';
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 10000);
        } else {
          this.resetDisabled = false;
        }
    });
  }

  revealPass() {
    this.show = !this.show;
  }

  


}
