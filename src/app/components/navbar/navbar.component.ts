import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  scrolled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {  
    if (window.scrollY > 0) {
      this.scrolled = true;
    }
    else {
      this.scrolled = false;
    }
  }

}
