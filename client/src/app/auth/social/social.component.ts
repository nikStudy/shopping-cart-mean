import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

  name: string;
  datasaved = false;

  constructor(private route: ActivatedRoute, private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.params.token);
    if(this.route.snapshot.params.token){
      localStorage.setItem("User", JSON.stringify(this.route.snapshot.params.token));
    }


    this.datasaved = false;
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
        } 
        if (data.success === true) {
          this.name = data.user.name;
          this.datasaved = true;
        }
        
    });
  }

}
