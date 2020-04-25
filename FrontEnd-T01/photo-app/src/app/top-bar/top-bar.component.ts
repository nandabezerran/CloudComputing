import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from '../services/feed.service';
import { UserService } from '../services/user.service';
import { UserInter } from '../interfaces/userInter';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private router:Router,private feedService: FeedService, public userService: UserService, private _snackBar: MatSnackBar) { }
  user: UserInter; 
  ngOnInit(): void {
    this.userService.getUser().subscribe(aux => {
      this.user = aux;
    });
    this.userService.currentUser.subscribe(aux => {
      this.user = aux;
    });
  }
  
  redirectProfile(): void{
    this.router.navigate(['profile', this.user.name]); 
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

  searchUser(name: string): void{
    if(name.length > 0){
      this.userService.getName(name).subscribe(user =>{
        this.router.navigate(['profile', name]);
      },
      (error: HttpErrorResponse) => {
        this._snackBar.open('User not found', 'Undo', {
          duration: 2000,
        });
      }); 
    }
  } 
}
