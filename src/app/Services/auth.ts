import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'http://localhost:4000/api/Auth';
  private AdminUrl = 'http://localhost:4000/api/Admin';
  isLoggedIn = signal<boolean>(this.hasToken());
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials)

  }
  
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
  
  confirmEmail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-email`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);

  }
getAllUsers() {
    return this.http.get<any[]>(`${this.AdminUrl}/GetAllUsers`,{ headers: this.getAuthHeaders()});
  }
  getUserByEmail(email: string) {
    return this.http.get<any>(`${this.AdminUrl}/GetUserByEmail?email=${email}`,{ headers: this.getAuthHeaders()});
  }
  deleteUser(email: string) {
    return this.http.delete(`${this.AdminUrl}/DeleteUserByEmail?email=${email}`,{ headers: this.getAuthHeaders()},);
  }
  assignMerchant(data: { userEmail: string }) {
    return this.http.post(`${this.AdminUrl}/assign-merchant`, data, { headers: this.getAuthHeaders()});
  }
}