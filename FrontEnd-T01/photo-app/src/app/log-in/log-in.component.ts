import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export class User {
  public name: string;
  public email: string;
  public userName: string;
  public password: string;
  public profilePhoto: File;
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  

  model = new User();

  constructor(private router:Router) { }

  onSubmit(form) {
    console.log(form.value)
  }

  ngOnInit(): void {
  }

  redirectRegister(): void{
    this.router.navigate(['register']);
  }
  redirectFeed():void{
    this.router.navigate(['']);
  }

}
