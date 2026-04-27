import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  userData: any;
  isLoading: boolean = true;
  errorMessage: string = '';

  // ضفنا ChangeDetectorRef عشان نجبر الأنجيولار يحدث الواجهة
  constructor(
    private _userService: UserService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.isLoading = true;
    this._userService.getUserProfile().subscribe({
      next: (data) => {
        this.userData = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // "زقة" للأنجيولار عشان يعرض البيانات فوراً
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile data.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}