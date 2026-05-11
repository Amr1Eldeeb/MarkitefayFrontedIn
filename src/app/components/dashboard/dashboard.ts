import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsService } from '../../Services/product';
import { Auth } from '../../Services/auth'; // تأكد من المسار الصحيح للسيرفس بتاعتك
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private productservices = inject(ProductsService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // التحكم في التبويبات
  activeTab: 'products' | 'users' = 'products';

  products: any[] = [];
  users: any[] = [];

  ngOnInit(): void {
    this.loadproducts();
    this.loadAllUsers();
  }

  // --- إدارة المنتجات ---
  loadproducts() {
    this.productservices.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err)
    });
  }

  addProduct() {
    this.router.navigate(['/dashboard/add-product']);
  }

  editProduct(id: number) {
    this.router.navigate(['/dashboard/edit-product', id]);
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productservices.deleteProduct(id).subscribe({
          next: () => {
            this.products = this.products.filter((p: any) => p.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          }
        });
      }
    });
  }

  // --- إدارة المستخدمين ---
  loadAllUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err)
    });
  }

  onDeleteUser(email: string) {
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${email}?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(email).subscribe(() => {
          this.users = this.users.filter(u => u.email !== email);
          this.cdr.detectChanges();
          Swal.fire('Deleted!', 'User removed successfully.', 'success');
        });
      }
    });
  }

  assignMerchant(email: string) {
    this.authService.assignMerchant({ userEmail: email }).subscribe(() => {
      Swal.fire('Success', 'User is now a Merchant', 'success');
      this.loadAllUsers();
    });
  }

  onLogout() {
    this.authService.logout();
  }
  searchEmail: string = '';
searchResult: any = null;

onSearchUser() {
  if (!this.searchEmail.trim()) {
    this.searchResult = null;
    this.loadAllUsers(); 
    return;
  }

  this.authService.getUserByEmail(this.searchEmail).subscribe({
    next: (data) => {
      this.searchResult = data;
      this.users = [data]; 
      this.cdr.detectChanges();
    },
    error: (err) => {
      Swal.fire('Error', 'User not found or invalid email', 'error');
      this.searchResult = null;
    }
  });
}

clearSearch() {
  this.searchEmail = '';
  this.searchResult = null;
  this.loadAllUsers();
}
}