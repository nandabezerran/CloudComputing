import { Component, OnInit } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { FeedCard } from '../interfaces/feedCard';
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export class Datas {
  public dataInicial: Date;
  public dataFinal: Date;
}


class ImageSnippet {
  constructor(public srcc: string, public file: File) {}
}
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})


export class FeedComponent implements OnInit {

  entries: FeedCard[];
  selectedFile: ImageSnippet;
  photoDatas = {};
  model = new Datas;
  
  

  user_id = ""
  constructor(private feedService: FeedService, private imageService: ImageService, private router:Router, private http : HttpClient) { }

  ngOnInit(): void {

    this.feedService.getFeedPhotos().subscribe(photoCards => {
      this.entries = photoCards;
      console.log(photoCards)
    });
    this.user_id = sessionStorage.getItem("id");
  }

  onSubmit(form) {
    this.feedService.getFeedPhotosDate(this.model.dataInicial, this.model.dataFinal).subscribe(photoCards => {
      this.entries = photoCards;
    });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.feedService.getFeedPhotos().subscribe(photoCards => {
            this.entries = photoCards;
          });
        },
        (err) => {
        
        })
    });

    reader.readAsDataURL(file);
  }

}

  
