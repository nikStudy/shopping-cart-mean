import { Component } from '@angular/core';
import { ManagementService } from './admin/management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shopping Cart';

  constructor(private managementservice: ManagementService) {}

  ngOnInit(): void {
    // this.managementservice.get().subscribe(() => {});
  }
}
