import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ManagementService } from './management.service';


@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  
  constructor(private router: Router, private managementservice: ManagementService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if(localStorage.getItem("User")){

      return this.managementservice.getPermission().toPromise().then(data => {
        if(data.permission === 'admin' || data.permission === 'moderator') {
          return true;
        } else {
          alert('You do not have the permission to view this page, redirecting to Home');
          this.router.navigate(['/']);
          return false;
        }
      });
    } else {
        alert('You do not have the permission to view this page, redirecting to Home');
        this.router.navigate(['/']);
        return false;
    }
  }
  
}
