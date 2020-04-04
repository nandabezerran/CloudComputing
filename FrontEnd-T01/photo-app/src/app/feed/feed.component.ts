import { Component, OnInit } from '@angular/core';
import feedMock from '../data/feed.json';
import { FeedService } from '../services/feed.service';
import { FeedCard } from '../interfaces/feedCard';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  entries: FeedCard[];
  

  user_id = ""
  constructor(private feedService: FeedService) { }

  ngOnInit(): void {
    this.feedService.getFeedPhotos().subscribe(photoCards => {
      this.entries = photoCards;
    });
    this.user_id = sessionStorage.getItem("id")
  }

}
