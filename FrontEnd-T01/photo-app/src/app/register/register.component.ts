import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { UserInter } from '../interfaces/userInter';
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';

class ImageSnippet {
  constructor(public srcc: string, public file: File) {}
}
export class User {
  public username: string;
  public name: string;
  public password: string;
  public email: string;
  public profilePicture: any;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient, private userService: UserService, private imageService: ImageService, private router: Router) { }
  selectedFile: ImageSnippet;
  model = new User();
  profilePic: File;
  ngOnInit(): void {
  }
  saveProfilePic(imageInput: any){
    this.profilePic = imageInput.files[0];
  }
  onSubmit(form) {
    const formData = new FormData();
  
    const reader = new FileReader();
  
    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, this.profilePic);
      formData.append("username", form.value.username);
      formData.append("name", form.value.name);
      formData.append("password", form.value.password);
      formData.append("email", form.value.email);
      formData.append("profilePicture", this.selectedFile.file);
      this.imageService.uploadUser(formData).subscribe(
        (res) => {
          sessionStorage.setItem("id", res.toString());
          this.router.navigate(['feed']);
        },
        (err) => {
        
        })
    });

    reader.readAsDataURL(this.profilePic);
  }
}
