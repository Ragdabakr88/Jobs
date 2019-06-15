import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {

  constructor(private http: HttpClient) { }

  public createPost(post: Post): Observable<any> {
    return this.http.post('/api/v1/posts/createPost' , post);
  }
  public getAllPosts(): Observable<any> {
    return this.http.get('/api/v1/posts/allPosts');
  }
  public addLikes(body): Observable<any> {
    return this.http.post('/api/v1/posts/add-like', body);
  }
  public createComment(comment: any , postId: any): Observable<any> {
    return this.http.post('/api/v1/posts/add-comment', {comment, postId} );
  }
  public getPostById( postId: string): Observable<any> {
    return this.http.get('/api/v1/posts/' + postId);
  }
      // Get all users
 public getUsers(): Observable<any>{
        return this.http.get('api/v1/users');
 }

}
