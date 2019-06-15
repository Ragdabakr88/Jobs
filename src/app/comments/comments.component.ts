import { Component, OnInit } from '@angular/core';
import { PostServiceService } from '../services/post-service.service';
import { Comment } from '../services/comment.model';
import { Router } from '@angular/router';
import { Post } from '../services/post.model';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

newComment: Comment;
errors: any[] = [];
socket: any;
toolbar: any;
post: Post;
postId: any;
comments = [];
comment: any;


  constructor( private http: HttpClient, private route: ActivatedRoute, private postService: PostServiceService , private router: Router , ) {
     this.socket = io('http://localhost:3001');
   }

  ngOnInit() {
    
    this.toolbar = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');
    
   
    this.newComment = new Comment();
    this.socket.on('refreshPage', data => {
      this.getPost();
      });
    
    console.log('new', this.newComment);
  }



  ngAfterViewInit() {
    this.toolbar.style.display = 'none';
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

  createComment() {
    this.postService.createComment(this.newComment, this.postId).subscribe(
    comment => {
      console.log(comment);
      this.socket.emit('refresh', {}); // client emit refresh event
      // this.router.navigate(['/streams']);

         },
          (errorResponse: HttpErrorResponse) => {
          this.errors = errorResponse.error.errors;
        });
       }







}
