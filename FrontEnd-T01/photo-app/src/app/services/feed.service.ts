import { Injectable } from '@angular/core';
import { FeedCard } from '../interfaces/feedCard';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http:HttpClient) {}

  getFeedPhotos() : Observable<FeedCard[]>{
    return this.http.get<FeedCard[]>('/api/photos');
  }
  getUserPhotos(username: string) : Observable<FeedCard[]> {
    return this.http.get<FeedCard[]>('/api/photos/'+username);
  }

  likeDislikePhoto(photoId: string, userId: string) : Observable<void> {
    return this.http.put<void>('/api/photos/like', {_id: photoId, userId});
  }
}
