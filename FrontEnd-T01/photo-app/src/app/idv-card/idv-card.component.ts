import { Component, OnInit, Input } from '@angular/core';
import feedMock from '../data/feed.json';

@Component({
  selector: 'app-idv-card',
  templateUrl: './idv-card.component.html',
  styleUrls: ['./idv-card.component.css']
})
export class IdvCardComponent implements OnInit {

  @Input() data: any;
  entries: any[];
  constructor() { }

  ngOnInit(): void { 
    this.entries = feedMock.entries;
  }

  likePhoto(): void{
    this.data.youLiked = !this.data.youLiked;
    if(this.data.youLiked){
      this.data.likes++;
    }
    else{
      this.data.likes--;
    }
  }

}
