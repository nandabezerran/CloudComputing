import { Injectable } from '@angular/core';
import { UserInter } from '../interfaces/userInter';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) {}

  getUser() : Observable<UserInter> {
    return this.http.get<UserInter>('/api/users/'+sessionStorage.getItem("id"));
  }

}
