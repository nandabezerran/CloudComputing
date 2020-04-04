import { Component, OnInit } from '@angular/core';
import userData from "../data/user.json"


export class User {
  public name: string;
  public email: string;
  public userName: string;
  public password: string;
  public profilePhoto: File;
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  model = new User();
  user_id = ""
 

  constructor() { }

  onSubmit(form) {
    console.log(form.value)
  }

  ngOnInit(): void {
    this.model.name = userData.name;
    this.model.email = userData.email;
    this.model.password = userData.password;
    this.model.userName = userData.username;
    this.user_id = sessionStorage.getItem("id")
  }

}
