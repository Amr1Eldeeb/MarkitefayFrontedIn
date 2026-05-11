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

  // تم توحيد المسميات لتكون camelCase
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    phoneNumber: '' 
  };

  confirmPassword = '';
  errorMessage: string = ''; 
  successMessage: string = '';

  constructor(private auth: Auth, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    // إرسال كائن registerData بعد التأكد من اكتمال البيانات
    this.auth.register(this.registerData).subscribe({
      next: (response: any) => {
        this.successMessage = 'Registration successful! Redirecting...';
        
        // حفظ البريد الإلكتروني إذا كان السيرفر يعيده في الـ Response
        if (response && response.email) {
          localStorage.setItem('Email', response.email);
        }

        setTimeout(() => {
          this.router.navigate(['/confirmemail'], {
            queryParams: { email: this.registerData.email }
          });
        }, 2000);
      },
      error: (err) => {
        // عرض تفاصيل الخطأ القادمة من السيرفر
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        console.error('Registration error details:', err.error);
      }
    });
  }
}