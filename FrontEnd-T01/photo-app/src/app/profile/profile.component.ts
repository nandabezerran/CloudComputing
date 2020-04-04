import { Component, OnInit } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { FeedCard } from '../interfaces/feedCard';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private feedService: FeedService, private route: ActivatedRoute) { }
  entries: FeedCard[];
  userName: any;
  userAvatar: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.feedService.getUserPhotos(params.term).subscribe(photoCards => {
        console.log(photoCards);
        this.entries = photoCards;
        this.userName = this.entries[0].username;
        this.userAvatar = this.entries[0].userAvatar;
      });    
    });
  }
}
