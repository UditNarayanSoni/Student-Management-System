import { Component } from '@angular/core';
import { Router } from '@angular/router';
        
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  firstName: string = '';
  lastName: string = '';
  gender: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.firstName && this.lastName && this.gender) {
      // Navigate to the dashboard after login
      this.router.navigate(['/dashboard'], { queryParams: { teacher: `${this.firstName} ${this.lastName}` } });
    }
  }
}
