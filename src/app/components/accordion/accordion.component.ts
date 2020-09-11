import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

  @Input()
  isOpened:boolean=true;

  @Input()
  title:string;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(){
    this.isOpened=!this.isOpened;
  }

}
