import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { AuthService } from '../auth/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import io from 'socket.io-client';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.sass']
})
export class UserViewComponent implements OnInit {
  errors: any[] = [];
  socket: any;
  userId: any;
  posts = [];
  followers = [];
  following = [];

  constructor(private http: HttpClient , private messageService: MessageService , 
    private router: Router , private route: ActivatedRoute
,         private authService: AuthService ) {
this.socket = io('http://localhost:3001');


}


  ngOnInit() {
    this.GetUser();
    this.getUserProfile();
  }

  GetUser() { //find userId who logged in 
    const result =  this.authService.getUserId();
    this.userId = result;
    console.log('user44', this.userId);
   }


  getUserProfile() {
    this.authService.singleUser(this.userId).subscribe(
      data => {
        console.log(data);
        this.posts = data.posts;
        console.log('postsghj',this.posts);
        this.followers = data.followers ;
        this.following = data.following ;
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }


}
