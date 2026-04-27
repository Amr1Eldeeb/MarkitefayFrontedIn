import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../Services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: ''
  };

  confirmPassword = '';
  errorMessage: string = ''; 
  successMessage: string = '';

  constructor(private auth: Auth, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.register(this.registerData).subscribe({
      next: (response: any) => {
        this.successMessage = 'Registration successful! Redirecting...';
        localStorage.setItem('Email', response.Email);
        setTimeout(() => {
          // console.log(localStorage.getItem('email'));
          this.router.navigate(['/confirmemail'], {queryParams: { email: this.registerData.email }});
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}