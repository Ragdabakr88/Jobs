import { Component, OnInit } from '@angular/core';
// import { User } from '../../shared/auth.model';
import { Post } from '../services/post.model';
import { PostServiceService } from '../services/post-service.service';
import { AuthService } from '../auth/shared/auth.service';
import { FriendsService} from '../services/friends.service';
import { Router, Data } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../services/comment.model';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  socket: any;
  errors: any[] = [];
  data = [];
  Farray = [];
  loggedInUsers: any;
  userId: any;
  followArray: any[] =[];

  constructor(private http: HttpClient , private route: ActivatedRoute , private postService: PostServiceService , private router: Router
    ,         private friendsService: FriendsService , private authService: AuthService
    ) {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit() {
    this.GetUser();
    this.getUserById();
    this.socket.on('refreshPage', data => {
      this.GetUser();
    });

  }

  GetUser() { //find user who logged in 
   const result =  this.authService.getUserId();
   this.userId = result;
   console.log(this.userId);
  }

  getUserById() {
    this.authService.singleUser(this.userId).subscribe(
      data => {
         this.data = data;
        this.Farray = data.following ;

      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }




}
