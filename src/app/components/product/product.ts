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
  selectedCategoryId: number | null = null;
  currentImageIndex: { [key: number]: number } = {};

  @ViewChild('categoryScroll') categoryScroll!: ElementRef;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
    this.productService.searchQuery$.subscribe(query => {
      if (query && query.trim() !== '') {
        this.loadSearchResults(query);
      } else {
        this.loadAllProducts(); 
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  loadAllProducts() {
    this.selectedCategoryId = null; 
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.resetImageIndexes();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.productService.getProductsByCategoryId(categoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.resetImageIndexes();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching filtered products:', err);
        this.products = [];
        this.cdr.detectChanges();
      }
    });
  }
loadSearchResults(query: string) {
    this.selectedCategoryId = null; 
    this.productService.searchProducts(query).subscribe({
      next: (res) => {
        this.products = res;
        this.resetImageIndexes();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search error:', err);
        this.products = [];
        this.cdr.detectChanges();
      }
    });
  }
  
showAll() {
    this.productService.setSearchQuery(''); // تصفية البحث وعرض الكل
  }

  private resetImageIndexes() {
    this.products.forEach(p => {
      this.currentImageIndex[p.id] = 0;
    });
  }

  
  nextImage(productId: number, images: string[]) {
    this.currentImageIndex[productId] = (this.currentImageIndex[productId] + 1) % images.length;
    this.cdr.detectChanges();
  }

  prevImage(productId: number, images: string[]) {
    this.currentImageIndex[productId] = (this.currentImageIndex[productId] - 1 + images.length) % images.length;
    this.cdr.detectChanges();
  }

  goToDetails(id: number) {
    this.router.navigate(['/details', id]);
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
  getStars(rating: number): number[] {
  const r = rating ? Math.round(rating) : 5; 
  return Array(r).fill(0);
}
}