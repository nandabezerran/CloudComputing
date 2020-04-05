import { Injectable } from '@angular/core';
import { FeedCard } from '../interfaces/feedCard';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  public uploadImage(image: File): Observable<void> {
    const formData = new FormData();

    formData.append('photoUrl', image);
    formData.append('userId', sessionStorage.getItem("id"));
    console.log(image);
    return this.http.post<void>('/api/photos/', formData);
  }
}
