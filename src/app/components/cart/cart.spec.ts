import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../Services/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cartData: any = null;
  loading = true;
  imagePath = 'http://localhost:4000/images/';

  constructor(
    private productService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // 🟢 تحميل السلة أول مرة بس
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

  // 🟢 تغيير الكمية بدون reload
  changeQuantity(productId: number, currentQty: number, change: number) {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    this.productService.updateQuantity(productId, newQty).subscribe({
      next: () => {
        const item = this.cartData.items.find(
          (x: any) => x.productId === productId
        );

        if (item) {
          item.quantity = newQty;
        }

        // تحديث السعر
        this.updateTotals();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Update Quantity Error:", err);
        alert("Failed to update quantity.");
      }
    });
  }

  // 🟢 حذف عنصر بدون reload
  deleteItem(id: number) {
    if (confirm('Remove this item from your bag?')) {
      this.productService.removeItem(id).subscribe({
        next: () => {

          // حذف العنصر من الليست
          this.cartData.items = this.cartData.items.filter(
            (item: any) => item.productId !== id
          );

          // تحديث الحسابات
          this.updateTotals();

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Delete Error:", err);
          alert("Could not remove item.");
        }
      });
    }
  }

  // 🟢 تحديث total count + total price
  updateTotals() {
    this.cartData.totalCount = this.cartData.items.length;

    this.cartData.totalPrice = this.cartData.items.reduce(
      (sum: number, item: any) =>
        sum + (item.unitPrice * item.quantity),
      0
    );
  }
}