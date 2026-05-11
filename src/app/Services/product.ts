import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:4000/api/Product';
  private cartBaseUrl = 'http://localhost:4000/api/Cart';
  private reviewUrl = 'http://localhost:4000/api/Review';
private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  constructor(private http: HttpClient) {
    if (localStorage.getItem('token')) {
      this.updateCartCount();
    }
  }
updateCartCount() {
    this.getCart().subscribe({
      next: (res) => {
        const items = res.data?.items || res.items || [];
        this.cartCountSubject.next(items.length);
      },
      error: () => this.cartCountSubject.next(0)
    });
  }
  getProductReviews(productId: number | string): Observable<any[]> {
  return this.http.get<any[]>(`${this.reviewUrl}/product/${productId}`);
}

addReview(reviewData: any): Observable<any> {
  return this.http.post(this.reviewUrl, reviewData, { 
    headers: this.getAuthHeaders() 
  });
}
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getProductById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addToCart(cartItem: any): Observable<any> {
    return this.http.post(`${this.cartBaseUrl}/Add-To-Cart`, cartItem, { headers: this.getAuthHeaders() })
    .pipe(
        tap(() => this.updateCartCount())
      );
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.cartBaseUrl}/GetCart`, { headers: this.getAuthHeaders() });
  }



  updateQuantity(productId: number, newQuantity: number): Observable<any> {
    const body = { productId: productId, newQuantity: newQuantity };
    return this.http.put(`${this.cartBaseUrl}/update-quantity`, body, { 
      headers: this.getAuthHeaders() 
    });
  }
removeItem(productId: number): Observable<any> {
  const url = `${this.cartBaseUrl}/removeItem/${productId}`;
  return this.http.delete(url, {
    headers: this.getAuthHeaders()
  })  .pipe(
        tap(() => this.updateCartCount())
      );;
}
submitOrder(orderData: any): Observable<any> {
  const url = `http://localhost:4000/api/Order/checkout`;
  return this.http.post(url, orderData, { 
    headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` }) 
  });
}
private categortyUrl = 'http://localhost:4000/api/Category';
getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categortyUrl);
  }

getProductsByCategoryId(id: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/GetProductsByCatID/${id}`);
}
addProduct(productData: FormData) {
    return this.http.post<any>(this.apiUrl, productData , { headers: this.getAuthHeaders() });
  }
  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  updateProduct(id: number, productData: FormData) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData, { headers: this.getAuthHeaders()});
  }

private searchQuerySubject = new BehaviorSubject<string>('');
 searchQuery$ = this.searchQuerySubject.asObservable();

setSearchQuery(query: string) {
  this.searchQuerySubject.next(query);
}

searchProducts(query: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`);
}
}
