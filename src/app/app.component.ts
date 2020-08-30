import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent   {
  title = 'f1';
  currentURL:string;
    constructor(router:Router){
      router.events.subscribe((event) => {
        if(event instanceof NavigationEnd) {
          this.currentURL=event.url;
      }
        
      });

      
    }
  


 
}
