import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef,  OnChanges, SimpleChanges } from '@angular/core';
import { SearchBoxItem } from 'src/app/models/SearchboxItem.model';


@Component({
  selector: 'searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent implements OnInit, OnChanges {

  @Input()
  data: SearchBoxItem[];

  @Input()
  selectedId: string;

  @Output()
  onSelect: EventEmitter<SearchBoxItem> = new EventEmitter<SearchBoxItem>();

  searchedText = '';
  selectedItem: SearchBoxItem;
  visibleData: SearchBoxItem[] = [];
  activeSearch = false;

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.data && changes.data.currentValue && this.selectedId)
    ||
    (changes.selectedId && changes.selectedId.currentValue && this.data && this.data.length > 0)
    ) {
      this.select(this.data.filter(e => e.id === this.selectedId)[0]);
    }

    if (changes.selectedId && !changes.selectedId.currentValue) {
      this.select({id: '', name: '', type: ''});
    }
  }

  onTyping(text: string) {
    this.searchedText = text;
    this.visibleData = this.data.filter(e => e.name.toUpperCase().includes(text.toUpperCase()));

    if (this.visibleData.length > 1 || (this.visibleData.length === 1 && this.visibleData[0].name !== text) ) {
      this.activeSearch = true;
      this.onSelect.emit(null);
    } else if (this.visibleData.length === 1 && this.visibleData[0].name === text) {
      this.activeSearch = false;
      this.onSelect.emit(this.visibleData[0]);
    } else {
      this.activeSearch = false;
      this.onSelect.emit(null);
    }

  }

  select(item: SearchBoxItem) {
    setTimeout(() => {
      this.selectedItem = item;
      this.searchedText = item.name;
      this.visibleData = this.data.filter(e => e.id == item.id);
      this.activeSearch = false;
      this.onSelect.emit(item);
    });


  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.activeSearch = false;
    }
  }

}
