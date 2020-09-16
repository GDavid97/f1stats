import { Component, OnInit, HostListener, Input, EventEmitter, Output } from '@angular/core';
import { SearchBoxItem } from 'src/app/models/SearchboxItem.model';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input()
  isOpacityOnDefault:boolean;

  @Input()
  searchboxData:SearchBoxItem[];

  @Output()
  onSearch:EventEmitter<SearchBoxItem>=new EventEmitter<SearchBoxItem>();

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

  stopPropagation(e:Event){
    e.stopPropagation();
  }

  removeFocus(){
    (<HTMLElement>document.activeElement).blur();
  }

}
