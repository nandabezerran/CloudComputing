import { Component, OnInit } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { FeedCard } from '../interfaces/feedCard';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private feedService: FeedService, private route: ActivatedRoute, private userService: UserService) { }
  entries: FeedCard[];
  userName: any;
  name:any;
  userAvatar: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userService.getName(params.term.toString()).subscribe(user =>{
        this.userName = user.username;
        this.userAvatar = user.profilePicture;
        this.name = user.name;
        this.feedService.getUserPhotos(user.username).subscribe(photoCards => {
          this.entries = photoCards; 
        }); 
      });     
    });
  }
}
