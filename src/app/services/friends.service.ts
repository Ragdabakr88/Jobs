import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) { }

  public addFollow(userId: any): Observable<any> {
  return this.http.post('/api/v1/friends/follow', {userId});
  }

    public addMark(notifyId: string): Observable<any> {
      return this.http.post(`api/v1/friends/mark/${notifyId}`,{notifyId});
    }

    public deleteNotification(notifyId: string): Observable<any> {
      return this.http.post(`api/v1/friends/delete/${notifyId}`,{notifyId});
    }

    public markAll(): Observable<any> {
      return this.http.post('api/v1/friends/markAll', {all: true});
    }
}
