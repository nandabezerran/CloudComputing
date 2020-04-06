import { Injectable } from '@angular/core';
import { UserInter } from '../interfaces/userInter';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: Subject<UserInter> = new Subject<UserInter>();
  constructor(private http:HttpClient) {}

  getUser() : Observable<UserInter> {
    return this.http.get<UserInter>('/api/users/'+sessionStorage.getItem("id")).pipe(map(user => {
      this.currentUser.next(user);
      return user;
    }));
  }

  public editUser(formData: FormData): Observable<UserInter>{
    return this.http.put<UserInter>('api/users', formData).pipe(switchMap(() => this.getUser()
    ));
  }
}
