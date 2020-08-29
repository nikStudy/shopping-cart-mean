import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

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
    // console.log(this.userForm.controls['email'].value);

    this.message = '';
    this.sendPassLink(user);
  }

  sendPassLink(user: any){
    this.userservice.sendPasswordLink(user).subscribe(
      data =>{
        console.log(data);
        // console.log(data.message);
        this.datasaved = true;
        this.message = data.message;
        this.submitDisabled = false;

        if(data.success) {
          this.submitDisabled = true;
        } 
    });
  }




}
