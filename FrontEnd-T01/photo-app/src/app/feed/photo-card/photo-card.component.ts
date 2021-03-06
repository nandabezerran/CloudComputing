import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { FeedCard } from 'src/app/interfaces/feedCard';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css']
})
export class PhotoCardComponent implements OnInit {
  @Input() data: FeedCard;
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
