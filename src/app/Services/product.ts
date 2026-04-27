import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:4000/api/Product';
  private cartBaseUrl = 'http://localhost:4000/api/Cart';

  constructor(private http: HttpClient) {}

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
    return this.http.post(`${this.cartBaseUrl}/Add-To-Cart`, cartItem, { headers: this.getAuthHeaders() });
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
  });
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
  getProductsByCatID(catId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/GetProductsByCatID?categoryid=${catId}`);
}
}
