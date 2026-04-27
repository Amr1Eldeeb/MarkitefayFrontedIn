import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../Services/product';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class Product implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  currentImageIndex: { [key: number]: number } = {};

  @ViewChild('categoryScroll') categoryScroll!: ElementRef;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef, // محرك التحديث
  ) {}

  ngOnInit(): void {
    console.log('Component Loaded');
    this.loadCategories();
    this.loadAllProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges(); // تحديث الشاشة فور وصول الفئات
      },
      error: (err) => console.error(err)
    });
  }

  loadAllProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.products.forEach(p => {
          this.currentImageIndex[p.id] = 0;
        });
        this.cdr.detectChanges(); // تحديث الشاشة فور وصول المنتجات
      },
      error: (err) => console.error(err)
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/details', id]);
    // ملاحظة: الـ detectChanges هنا مش كفاية لوحدها، لازم تكون جوه الـ subscribe
  }

  // باقي الميثودز (scroll و images) كما هي...
  nextImage(productId: number, images: string[]) {
    this.currentImageIndex[productId] = (this.currentImageIndex[productId] + 1) % images.length;
    this.cdr.detectChanges(); // عشان الـ Carousel يستجيب فوراً
  }

  prevImage(productId: number, images: string[]) {
    this.currentImageIndex[productId] = (this.currentImageIndex[productId] - 1 + images.length) % images.length;
    this.cdr.detectChanges();
  }

  scrollLeft() {
    this.categoryScroll.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    this.categoryScroll.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  getCategoryIcon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('mobile')) return 'bi-phone';
    if (lower.includes('laptop') || lower.includes('electronics')) return 'bi-laptop';
    if (lower.includes('clothing') || lower.includes('fashion')) return 'bi-universal-access';
    if (lower.includes('home') || lower.includes('furniture')) return 'bi-house-heart';
    if (lower.includes('beauty')) return 'bi-magic';
    if (lower.includes('sport')) return 'bi-trophy';
    if (lower.includes('food')) return 'bi-basket';
    if (lower.includes('camera')) return 'bi-camera';
    if (lower.includes('gaming')) return 'bi-controller';
    return 'bi-tag';
  }
}