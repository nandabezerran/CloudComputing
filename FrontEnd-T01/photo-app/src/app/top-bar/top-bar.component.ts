import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from '../services/feed.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private router:Router,private feedService: FeedService) { }

  ngOnInit(): void {
  }

  redirectProfile(): void{
    // TODO user from session
    this.router.navigate(['profile', 'nandabezerran']);
  }

  redirectUpdate(): void{
    this.router.navigate(['updateUser']);
  }
  redirectLogin(): void{
    this.router.navigate(['login']);
  }

  redirectFeed(): void{
    this.router.navigate(['']);
  }

  searchUser(username: string): void{
    this.router.navigate(['profile', username]);
  }
}
