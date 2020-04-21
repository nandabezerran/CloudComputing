import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';



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
  userLogin = {};
  id = ""

  constructor(private router:Router, private http : HttpClient) { }

  onSubmit(form) {

    this.userLogin = { username : form.value.userName, password : form.value.password };
    this.http.post('/api/users/login', this.userLogin)
      .subscribe(Response=> {
        sessionStorage.setItem("id", Response['id']);
        this.router.navigate(['feed']);
      
      },
      (error: any) => {
          console.log(error);
      });
      
    }

  ngOnInit(): void {
  }

  redirectRegister(): void{
    this.router.navigate(['register']);
  }

}
