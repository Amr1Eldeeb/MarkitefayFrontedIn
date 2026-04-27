import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'http://localhost:4000/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
  
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
  
  confirmEmail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-email`, data);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
    logout() {
    localStorage.removeItem('token');
  }
}

