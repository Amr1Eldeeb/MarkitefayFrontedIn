import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-aboutus',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus {

}
