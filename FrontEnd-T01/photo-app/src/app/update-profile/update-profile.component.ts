import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import { UserService } from '../services/user.service';


export class User {
  public name: string;
  public email: string;
  public userName: string;
  public password: string;
  public profilePhoto: any;
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
 

  constructor(private imageService: ImageService, private router: Router, private userService: UserService) { }
  saveProfilePic(imageInput: any){
    this.profilePic = imageInput.files[0];    
  }

  onSubmit(form) {
    const formData = new FormData();
    const reader = new FileReader();
    console.log('antes');
    reader.addEventListener('load', (event: any) => {
      console.log('entrou');
      this.selectedFile = new ImageSnippet(event.target.result, this.profilePic);
      formData.append("userId", sessionStorage.getItem("id"));
      formData.append("name", form.value.name);
      formData.append("password", form.value.password);
      formData.append("email", form.value.email);
      formData.append("profilePicture", this.selectedFile.file);

      this.userService.editUser(formData).subscribe(
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
    this.userService.getUser().subscribe(aux => {
      this.model.name = aux.name;
      this.model.email = aux.email;
      this.model.password = aux.password;
      this.model.userName = aux.username;
      this.user_id = sessionStorage.getItem("id")
    });
    
  }

}
