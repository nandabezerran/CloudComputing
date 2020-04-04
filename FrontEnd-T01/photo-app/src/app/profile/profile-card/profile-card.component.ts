import { Component, OnInit, Input} from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  @Input() data: any;
  constructor(private feedService: FeedService) { }

  ngOnInit(): void {
  }

  likePhoto(): void{
    this.data.youLiked = !this.data.youLiked;
    if(this.data.youLiked){
      this.data.likes++;
    }
    else{
      this.data.likes--;
    }
    this.feedService.likeDislikePhoto(this.data._id).subscribe();
  }

}
