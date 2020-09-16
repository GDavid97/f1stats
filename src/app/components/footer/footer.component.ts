import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openGithub(){
    window.open("https://github.com/GDavid97/f1stats");
  }

  openLinkedIn(){
    window.open("https://www.linkedin.com/in/dgobolyos/");
  }

}
