import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  redirectProfile(): void{
    this.router.navigate(['profile']);
  }

  redirectFeed(): void{
    this.router.navigate(['']);
  }
}
