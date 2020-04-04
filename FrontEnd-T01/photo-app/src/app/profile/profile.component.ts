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
  userName: any;
  userAvatar: any;
  user_id = ""

  ngOnInit(): void {
    this.entries = feedMock.entries;
    this.userName = this.entries[0].user;
    this.userAvatar = this.entries[0].userAvatar;
    this.user_id = sessionStorage.getItem("id")
  }
}
