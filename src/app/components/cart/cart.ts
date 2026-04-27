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
  if (confirm('Remove this item from your bag?')) {
    this.productService.removeItem(id).subscribe({
      next: () => {
        this.loadCart(); 
      },
      error: (err) => {
        if (err.status === 204) {
          this.loadCart();
        } else {
          console.error("Delete Error:", err);
          alert("Could not remove item.");
        }
      }
    });
  }
}
addToCart(productId: number, quantity: number = 1) {
    const cartItem = {
      productId: productId,
      quantity: quantity
    };

    this.productService.addToCart(cartItem).subscribe({
      next: (res) => {
        console.log("Item added successfully");
        this.loadCart(); 
      },
      error: (err) => {
        console.error("Add to cart error:", err);
        alert("Failed to add item to cart.");
      }
    });
  }
}