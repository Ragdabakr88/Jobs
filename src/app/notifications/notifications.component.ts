

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
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  socket: any;
  errors: any[] = [];
  data = [];
  loggedInUsers: any;
  userId: any;
  followArray: any[] = [];
  username: any;
  notify: [];
  read: string;
  notifyId: string;

  constructor(private http: HttpClient , private route: ActivatedRoute , private postService: PostServiceService , private router: Router
    ,         private friendsService: FriendsService , private authService: AuthService
    ) {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit() {
    this.GetUser();
    this.getUserById();
    this.socket.on('refreshPage', data => {
      this.getUserById();
    });

  }

  GetUser() { //find user who logged in 
   const result =  this.authService.getUserId();
   this.userId = result;
  //  console.log(this.userId);
  }

  getUserById() {
    this.authService.singleUser(this.userId).subscribe(
      data => {
         this.data = data;
         this.notify = data.notifications;
        //  console.log(this.notify);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  TimeFromNow(time){
    return moment(time).fromNow();
  }

  reads(n){
    this.notifyId = n._id;
    console.log( this.notifyId);
    this.friendsService.addMark(this.notifyId).subscribe(
      data => {
         this.data = data.notifications;
         this.socket.emit('refresh', {});
         console.log(this.data);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });

  }

  delete(n) {
    this.notifyId = n._id;
    console.log( this.notifyId);
    this.friendsService.deleteNotification(this.notifyId).subscribe(
      data => {
         this.socket.emit('refresh', {});
         console.log(this.data);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }


}
