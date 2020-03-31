import { Component, OnInit } from '@angular/core';
import feedMock from '../data/feed.json';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  entries: any[];


  ngOnInit(): void {
    this.entries = feedMock.entries;
  }
}
