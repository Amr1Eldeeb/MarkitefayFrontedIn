import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../Services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
  
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginData = { Email: '', Password: '' };

  emailError: string = '';
  passwordError: string = '';
  generalError: string = '';

  isLoading: boolean = false;

  constructor(private authService: Auth, private router: Router) {}

  onLogin() {

    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({

      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('lastName', response.lastName);
        localStorage.setItem('email', response.email);


        this.router.navigate(['/home']);
      },

      error: (err: any) => {

        this.isLoading = false;

        console.log('FULL ERROR:', err);

        let message = '';

        if (err?.error) {

          if (typeof err.error === 'string') {
            message = err.error;
          }
          else if (err.error?.message) {
            message = err.error.message;
          }
          else if (err.error?.title) {
            message = err.error.title;
          }
          else {
            message = JSON.stringify(err.error);
          }
        }

        if (!message) {
          message = err.message || 'Login failed';
        }

        const lower = message.toLowerCase();

        if (lower.includes('email')) {
          this.emailError = message;
        }
        else if (lower.includes('pass')) {
          this.passwordError = message;
        }
        else {
          this.generalError = message;
        }
      }
    });
  }
}