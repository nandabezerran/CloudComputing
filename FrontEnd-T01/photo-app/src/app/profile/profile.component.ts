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
      this.feedService.getUserPhotos(params.term).subscribe(photoCards => {
        this.entries = photoCards;
        if(this.entries.length == 0 ){
          this.userService.getUser().subscribe(user => {
            this.userName = user.username;
            this.userAvatar = user.profilePicture;
            this.name = user.name;
          })
        }
        else{
          this.userName = this.entries[0].username;
          this.userAvatar = this.entries[0].userAvatar;
          this.userService.getUserName(this.userName).subscribe(user => {
            this.name = user.name;
          });
        }
        
      });    
    });
  }
}
