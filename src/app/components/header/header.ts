import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Auth } from '../../Services/auth';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../Services/product';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  cartCount: number = 0;
constructor(public authService: Auth ,  private cdr: ChangeDetectorRef,private productService: ProductsService,private router: Router)
{
  
}
  ngOnInit(): void {
this.productService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
  onSearch(query: string) {
    this.productService.setSearchQuery(query);
    this.router.navigate(['/home']); 
  }
  

}



