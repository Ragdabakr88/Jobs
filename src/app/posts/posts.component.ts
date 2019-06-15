import { Component, OnInit } from '@angular/core';
import { Post } from '../services/post.model';
import { PostServiceService } from '../services/post-service.service';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../services/comment.model';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';
// import _ from 'lodash';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
errors: any[] = [];
data: Post [] = [];
  date: string;
  socket: any;
  postId: string;
  post: Post;

  newComment: Comment;
  comments = [];
  comment: any;
  commentIndex: number;

  constructor(private http: HttpClient ,private route: ActivatedRoute ,private postService: PostServiceService , private router: Router) {
    this.socket = io('http://localhost:3001');
  }


  ngOnInit() {
  this.allPosts();
  this.socket.on('refreshPage', data => {
    this.allPosts();
    });
  this.newComment = new Comment();

  }


  allPosts() {
    this.postService.getAllPosts().subscribe(
      data => {
        this.data = data ;
        console.log(this.data);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }


  addLikes(d) {
    this.postService.addLikes(d).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {});
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  fullPost(d) {
  this.router.navigate(['/comment', d._id]);
  }

  addComment(d) {
    console.log(d);
    this.postId = d._id;
    console.log(this.postId);
    this.comments = d.comments;
    console.log('myComments', this.comments);
  }

  createComment() {
    this.postService.createComment(this.newComment, this.postId).subscribe(

    comment => {
      console.log(comment);
      this.socket.emit('refresh', {}); // client emit refresh event
      // this.router.navigate(['/streams']);
      this.commentIndex = undefined;
         },
          (errorResponse: HttpErrorResponse) => {
          this.errors = errorResponse.error.errors;
        });
       }

       getPost() {
        this.postService.getPostById(this.postId).subscribe(
          (post: Post) => {
            this.post = post;
            console.log('myPost', this.post);
            this.comments = post.comments;
            console.log('myComments', this.comments);
          });
        }

}
