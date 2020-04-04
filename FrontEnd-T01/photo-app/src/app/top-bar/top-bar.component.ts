import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from '../services/feed.service';
import { UserService } from '../services/user.service';
import { UserInter } from '../interfaces/userInter';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private router:Router,private feedService: FeedService, private userService: UserService) { }
  user: UserInter; 
  ngOnInit(): void {
    this.userService.getUser().subscribe(aux => {
      this.user = aux;
      console.log(this.user.profilePicture)
    });
  }
  
  redirectProfile(): void{
    this.router.navigate(['profile', this.user.username]); 
  }

  redirectUpdate(): void{
    this.router.navigate(['updateUser']);
  }
  redirectLogin(): void{
    this.router.navigate(['login']);
    sessionStorage.removeItem('id');
  }

  redirectFeed(): void{
    this.router.navigate(['feed']);
  }

  searchUser(username: string): void{
    this.router.navigate(['profile', username]);
  }
}
