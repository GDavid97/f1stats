import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WebService } from './services/web/web.service';
import { SearchBoxItem } from './models/SearchboxItem.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'f1';
  currentURL: string;
  searchboxData: SearchBoxItem[] = [];

  constructor(private router: Router, private webService:WebService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = event.url;
      }
    });
    this.getSearchboxData();
  }

  selectItem(item:SearchBoxItem){   
    if(item?.id){
      this.router.navigate(['driverdetail'], { queryParams: { id: item.id } });
    }
  }

  private getSearchboxData(){
    this.searchboxData=[];
    this.webService.getDriversForSearchbox().subscribe(res=>{
      this.searchboxData=[...this.searchboxData,...res];
    });    
  }





}
