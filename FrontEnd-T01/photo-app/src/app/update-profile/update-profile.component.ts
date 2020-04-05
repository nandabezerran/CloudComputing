import { Component, OnInit } from '@angular/core';
import userData from "../data/user.json"
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';
import { formatDiagnosticsWithColorAndContext } from 'typescript';


export class User {
  public name: string;
  public email: string;
  public userName: string;
  public password: string;
  public profilePhoto: File;
}

class ImageSnippet {
  constructor(public srcc: string, public file: File) {}
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  model = new User();
  user_id = ""
  profilePic: any;
  selectedFile: ImageSnippet;
 

  constructor(private imageService: ImageService, private router: Router) { }
  saveProfilePic(imageInput: any){
    this.profilePic = imageInput.files[0];
  }

  onSubmit(form) {
    const formData = new FormData();
  
    const reader = new FileReader();
    
    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, this.profilePic);
      formData.append("userId", sessionStorage.getItem("id"));
      formData.append("name", form.value.name);
      formData.append("password", form.value.password);
      formData.append("email", form.value.email);
      if(this.selectedFile.file != undefined){
        formData.append("profilePicture", this.selectedFile.file);
        console.log(formData.get("profilePicture"));
      }
      this.imageService.editUser(formData).subscribe(
        (res) => {
          this.router.navigate(['profile']);
        },
        (err) => {
        
        })
    });

    reader.readAsDataURL(this.profilePic);
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
