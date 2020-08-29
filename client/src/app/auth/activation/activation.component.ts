import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  message: String = '';
  datasaved = false;

  constructor(private route: ActivatedRoute, private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    this.datasaved = false;
    console.log(this.route.snapshot.params.token);
    this.userservice.activateAccount(this.route.snapshot.params.token).subscribe(
      data =>{
      // console.log(data);
      this.message = data.message;
      if (data.success) {
        this.datasaved = true;
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 5000); 
      } 

    });
    
  }



}
