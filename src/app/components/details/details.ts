import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../Services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../Services/auth';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './details.html'
})
export class Details implements OnInit {
  product: any = null;
  loading = true;
  
  selectedSize: string = '';
  quantity: number = 1;
  isAdding = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private cdr: ChangeDetectorRef,
    public authService :Auth
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.loading = false;
    }
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product = res.data ? res.data : res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("API Error:", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

addToCart() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first to add items to your bag!');
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    return;
  }

  if (this.product.sizes?.length > 0 && !this.selectedSize) {
    alert('Please select a size first!');
    return;
  }

  this.isAdding = true;
  const cartPayload = {
    productId: this.product.id,
    quantity: this.quantity,
    selectedSize: this.selectedSize
  };

  this.productService.addToCart(cartPayload).subscribe({
    next: (res) => {
      alert('Product added to cart!');
      this.isAdding = false;
    },
    error: (err) => {
      console.error("Add to Cart Error:", err);
      this.isAdding = false;
    }
  });
}
}