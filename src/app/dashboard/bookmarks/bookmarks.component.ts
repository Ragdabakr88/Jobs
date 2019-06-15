
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import { Router, Data } from '@angular/router';
import { JobService } from '../../services/job.service';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.sass']
})
export class BookmarksComponent implements OnInit {
  socket: any;
  errors: any[] = [];
  data = [];
  userId: any;
  bookmarks: any[] = [];
  username: any;
  jobId: any;


  constructor(private http: HttpClient , private route: ActivatedRoute  , private router: Router
    ,   private authService: AuthService, private jobService: JobService
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
         this.bookmarks = data.bookmarks;
         console.log(this.bookmarks);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  TimeFromNow(time){
    return moment(time).fromNow();
  }

  delete(job) {
    this.jobId = job._id;
    this.jobService.deleteBookmarkJob(this.jobId).subscribe(
      data => {
         this.socket.emit('refresh', {});
         console.log(this.data);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }


}
