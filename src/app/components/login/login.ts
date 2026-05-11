import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../Services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

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

  // ضفنا ChangeDetectorRef هنا
  constructor(
    private authService: Auth, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  onLogin() {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
    this.isLoading = true;

    console.log('1. Login Request Started...'); // تتبع في الكونسول

    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        console.log('2. Next Block Reached:', response);
        this.isLoading = false;
        
        // لو الباك إند رجع الخطأ في حالة نجاح (Status 200)
        if (response && response.description && !response.token) {
           this.generalError = response.description;
           this.cdr.detectChanges(); // إجبار الواجهة على التحديث
           return;
        }

        if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('firstName', response.firstName);
            localStorage.setItem('lastName', response.lastName);
            localStorage.setItem('email', response.email);
            
            this.authService.isLoggedIn.set(true);
            
            try {
              const decodedToken: any = jwtDecode(response.token);
              const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
              
              if (userRole === 'SuperAdmin') {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/home']);
              }
            } catch (error) {
              console.error('Error decoding token', error);
              this.router.navigate(['/home']); 
            }
        } else {
            this.generalError = "Unexpected error occurred.";
        }
        
        this.cdr.detectChanges(); // إجبار الواجهة على التحديث
      },

      error: (err: any) => {
        console.log('3. Error Block Reached:', err);
        this.isLoading = false;

        let message = 'Login failed. Please try again.';

        // استخراج الخطأ بشكل آمن جداً
        if (err?.error?.description) {
          message = err.error.description;
        } else if (err?.error?.message) {
          message = err.error.message;
        } else if (typeof err?.error === 'string') {
          message = err.error;
        } else if (err?.message) {
          message = err.message;
        }

        this.generalError = message;
        this.cdr.detectChanges(); // إجبار الأنجولار على إظهار الخطأ
      },
      
      // الـ complete تتنفذ دائماً في النهاية لتضمن إيقاف التحميل مهما حصل
      complete: () => {
         console.log('4. Request Completed');
         this.isLoading = false;
         this.cdr.detectChanges();
      }
    });
  }
}