import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  @Input() data: any;
  constructor() { }

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
  }

}
