import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input()
  isOpacityOnDefault:boolean;

  scrolled: boolean = false;

  isMobileMenuOpened:boolean;

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

  toggleMobileMenu(){
    if(this.isMobileMenuOpened){
      this.closeMobileMenu();
    }
    else{
      this.openMobileMenu();
    }
  }

  openMobileMenu(){
    this.isMobileMenuOpened=true;
  }

  closeMobileMenu(){
    this.isMobileMenuOpened=false;
  }

  removeFocus(){
    (<HTMLElement>document.activeElement).blur();
  }

}
