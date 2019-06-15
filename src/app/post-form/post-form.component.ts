import { Component, OnInit } from '@angular/core';
import { Post } from '../services/post.model';
import { PostServiceService } from '../services/post-service.service';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

newPost: Post;
errors: any[] = [];
socket: any;
post: any;


  constructor(private http: HttpClient , private postService: PostServiceService , private router: Router) {
     this.socket = io('http://localhost:3001');
   }

  ngOnInit() {
   
    this.newPost = new Post();
    console.log('new', this.newPost);
    
  }

  createPost() {

    this.postService.createPost(this.newPost).subscribe(

         (post: Post) => {
           this.socket.emit('refresh', {}); // client emit refresh event
          // console.log('post', post);
          // this.router.navigate(['/stream']);
          this.router.navigate(['/post-job', {job: 'Success'}]).then(()=>  {window.location.reload();});
         },
          (errorResponse: HttpErrorResponse) => {
          this.errors = errorResponse.error.errors;
        });
       }

}
