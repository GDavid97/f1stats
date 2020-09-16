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

  constructor(private router: Router, private webService: WebService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = event.url;
      }
    });
    this.getSearchboxData();
  }

  selectItem(item: SearchBoxItem) {
    if (item?.id) {
      if( item.type==='driver'){
        this.router.navigate(['driverdetail'], { queryParams: { id: item.id } });
      }
      else if(item.type==='season'){
        console.log()
        this.router.navigate(['seasons'], { queryParams: { season: item.id } });
      }

    }
  }

  private getSearchboxData() {
    this.searchboxData = [];
    for (let i = 1950; i <= new Date().getFullYear(); i++) {
      this.searchboxData.push({
        id: i.toString(),
        name: `Season: ${i}`,
        type: 'season'
      });
    }
    this.webService.getDriversForSearchbox().subscribe(res => {
      this.searchboxData = [...this.searchboxData, ...res];
    });
  }





}
