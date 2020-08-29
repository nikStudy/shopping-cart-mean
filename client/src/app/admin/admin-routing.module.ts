import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { PermissionGuard } from './permission.guard';
import { EditUserComponent } from './edit-user/edit-user.component';


const routes: Routes = [
  {path: 'management', component: ManagementComponent, canActivate: [PermissionGuard]},
  {path: 'edit/:id', component: EditUserComponent, canActivate: [PermissionGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
