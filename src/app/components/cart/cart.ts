import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../Services/product';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cartData: any = null; 
  productId : number = 0  
  loading = true;
  imagePath = 'http://localhost:4000/images/'; 

  constructor(
    private productService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.productService.getCart().subscribe({
      next: (res) => {
        this.cartData = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Cart API Error:", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changeQuantity(productId: number, currentQty: number, change: number) {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    this.productService.updateQuantity(productId, newQty).subscribe({
      next: () => {
        this.loadCart(); 
      },
      error: (err) => {
        console.error("Update Quantity Error:", err);
        alert("Failed to update quantity.");
      }
    });
  }

deleteItem(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "This item will be removed from your shopping bag",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#000000', // لون أسود متناسق مع الزراير بتاعتك
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true, // بيخلي زرار الإلغاء على الشمال والمسح على اليمين (أفضل للـ UX)
  }).then((result) => {
    if (result.isConfirmed) {
      this.productService.removeItem(id).subscribe({
        next: () => {
          this.loadCart();
          
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Item removed',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        },
        error: (err) => {
          if (err.status === 204) {
            this.loadCart();
          } else {
            console.error("Delete Error:", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Could not remove the item. Please try again.',
              confirmButtonColor: '#000000'
            });
          }
        }
      });
    }
  });
}
addToCart(productId: number, quantity: number = 1) {
    const cartItem = {
      productId: productId,
      quantity: quantity
    };

    this.productService.addToCart(cartItem).subscribe({
      next: (res) => {
        console.log("Item added successfully");
        Swal.fire({
          icon: 'success',
          title: 'Added to Bag!',
          text: 'The item has been successfully added to your shopping cart.',
          showConfirmButton: false,
          timer: 2000, 
          timerProgressBar: true,
          toast: true, 
          position: 'top-end', 
          background: '#ffffff',
          iconColor: '#0d6efd', 
        });
        this.loadCart(); 
      },
      error: (err) => {
        console.error("Add to cart error:", err);
Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to add item. Please try again.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
      }
    });
  }

getSizeName(sizeId: any): string {
    if (!sizeId) return 'N/A';
    const sizeMap: { [key: number]: string } = {
      1: 'S',
      2: 'M',
      3: 'L',
      4: 'XL'
    };
    return sizeMap[Number(sizeId)] || 'N/A';
  }
}