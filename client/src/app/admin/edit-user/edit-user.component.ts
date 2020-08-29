import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagementService } from '../management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  datasaved: boolean = false;
  message: string = '';
  editForm: FormGroup;
  currPermission = '';
  managementPermission: string;

  constructor(private formbuilder: FormBuilder, private managementservice: ManagementService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.datasaved = false;
    this.message = '';
    // console.log(this.route.snapshot.params.id);
    this.getUser(this.route.snapshot.params.id);
    this.getManagerPermission();
    this.setFormState();
  }

  getManagerPermission() {
    this.managementservice.getPermission().subscribe(data => {
      this.managementPermission = data.permission;
    });
  }

  setFormState():void {
    this.editForm = this.formbuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\. ]{1,50}$/i)])],
      username: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\d]{5,12}$/i)])],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.pattern(/^([a-z\d\.-]{1,20})@([a-z\d-]{1,20})\.([a-z]{2,8})(\.[a-z]{2,8})?$/i)])],
      permission: [this.currPermission, Validators.compose([Validators.required, Validators.pattern(/^(user)|(moderator)|(admin)$/)])]
    });
  }

  getUser(id) {
    this.managementservice.getUser(id).subscribe(data => {
      // console.log(data);
      if(data.success) {
        this.currPermission = data.user.permission;
        this.editForm.patchValue({
          name: data.user.name,
          username: data.user.username,
          email: data.user.email,
          permission: data.user.permission
        });
      } else {
        this.datasaved = true;
        this.message = data.message;
      }
    });
  }

  updatePermission(newPermission) {
    // this.currPermission = newPermission;
    this.editForm.patchValue({
      permission: newPermission
    });
  }

  updatedata() {
    let user = this.editForm.value;
    // console.log(user);

    this.datasaved = false;
    this.message = '';
    this.updateUser(user, this.route.snapshot.params.id);
  }

  updateUser(user, id) {
    this.managementservice.updateUser(user, id).subscribe(data => {
      // console.log(data);
      this.datasaved = true;
      this.message = data.message;
      setTimeout(() => {
        this.datasaved = false;
        this.message = '';
      }, 3000);
      if(data.success) {
        window.location.reload();  
      }
    });
  }

}
