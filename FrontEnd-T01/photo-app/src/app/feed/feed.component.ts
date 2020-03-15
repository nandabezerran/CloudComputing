import { Component, OnInit } from '@angular/core';
import feedMock from '../data/feed.json';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  entries: any[];
  constructor() { }

  ngOnInit(): void {
    this.entries = feedMock.entries;
  }

}
