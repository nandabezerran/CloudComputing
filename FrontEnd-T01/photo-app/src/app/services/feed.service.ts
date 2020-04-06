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
    return this.http.get<FeedCard[]>('/api/photos/'+sessionStorage.getItem("id"));
  }
  getUserPhotos(username: string) : Observable<FeedCard[]> {
    return this.http.get<FeedCard[]>('/api/photos/'+username+'/'+sessionStorage.getItem("id"));
  }

  likeDislikePhoto(photoId: string) : Observable<void> {
    return this.http.put<void>('/api/photos/like', {_id: photoId, userId: sessionStorage.getItem("id")});
  }

  getFeedPhotosDate(dataInicial: Date, dataFinal: Date) : Observable<FeedCard[]>{
    return this.http.post<FeedCard[]>('/api/photos/dates/' + sessionStorage.getItem("id"), { dataInicial : dataInicial, dataFinal : dataFinal});
  }
}
