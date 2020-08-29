import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.css']
})
export class ForgotUsernameComponent implements OnInit {

  submitDisabled = false;

  datasaved: boolean = false;
  message: string = '';
  userForm: FormGroup;

  constructor(private userservice: UserService, private formbuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.setFormState();
  }

  setFormState():void {
    this.userForm = this.formbuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  submitData() {
    let user = this.userForm.value;
    console.log(user);
    console.log(this.userForm.controls['email'].value);

    this.message = '';
    this.reset(this.userForm.controls['email'].value);
  }

  reset(user: any){
    this.userservice.resetUsername(user).subscribe(
      data =>{
        console.log(data);
        // console.log(data.message);
        this.datasaved = true;
        this.message = data.message;
        this.submitDisabled = false;

        setTimeout(() => {
          this.datasaved = false;
        }, 3000);
        
        if(data.success) {
          this.submitDisabled = true;
        } 
    });
  }




}
