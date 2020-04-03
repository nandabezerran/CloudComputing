import { Component, OnInit } from '@angular/core';

export class User {
  public name: string;
  public email: string;
  public userName: string;
  public password: string;
  public profilePhoto: File;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model = new User();

  constructor() { }

  onSubmit(form) {
    console.log(form.value)
  }

  ngOnInit(): void {
  }

}
