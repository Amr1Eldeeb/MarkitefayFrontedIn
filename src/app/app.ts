import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Product } from "./components/product/product";
import { Footer } from "./components/footer/footer";
import { RegisterComponent } from "./components/register/register";
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Product , Footer ,RouterOutlet, FormsModule,Product],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EcommerceStandalone');
}
