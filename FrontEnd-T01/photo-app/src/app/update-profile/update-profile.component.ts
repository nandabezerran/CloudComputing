import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  onSubmit(form) {
    console.log(form.value)
  }

  ngOnInit(): void {
  }

}
