import { Component, OnInit , Input} from '@angular/core';
// import { User } from '../../shared/auth.model';
import { Post } from '../services/post.model';
import { PostServiceService } from '../services/post-service.service';
import { AuthService } from '../auth/shared/auth.service';
import { FriendsService} from '../services/friends.service';
import { Router, Data } from '@angular/router';
import { HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../services/comment.model';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  @Input() users;
  socket: any;
  errors: any[] = [];
  data = [];
  loggedInUsers: any;
  userId: any;
  followArray: any[] = [];
  username: any;
  onlineUsers = [];
  isOnline = false;
  onlineusers = [];
  // imgVersion = [] ;
  // imgId = [];


  constructor(private http: HttpClient , private route: ActivatedRoute , private postService: PostServiceService , private router: Router
    ,         private friendsService: FriendsService , private authService: AuthService
    ) {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit() {
    this.GetUsername();
    this.allusers();
    this.GetUser();
    this.socket.on('refreshPage', data => {
      this.allusers();
      this.GetUser();
      this.GetUsername();
    });

  }

  allusers() {
    this.postService.getUsers().subscribe(
      data => {
        this.data = data ;
        // this.imgVersion = data.picVersion;
        // this.imgId = data.picId;
        // console.log('sdfgbhn',this.imgVersion,this.imgId);
        // console.log('data344',this.data);
        // _.remove(data.result, { username : this.loggedInUsers.username});
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }



  GetUser() { //find user who logged in 
   const xx =  this.authService.getUserId();
   console.log(xx);
  }

  GetUsername() { //find user who logged in 
    const username =  this.authService.getUserName();
    console.log(username);
   }


  addFolow(user) {
    this.userId = user._id;
    this.friendsService.addFollow(this.userId).subscribe(
   data => {
     console.log(data);
          this.followArray = data.following;
        //  console.log(this.followArray);
        this.socket.emit('refresh', {}); // client emit refresh event
        // this.router.navigate(['/streams']);
           },
            (errorResponse: HttpErrorResponse) => {
            this.errors = errorResponse.error.errors;
       });

     }

     checkInArr(arr , id) {
       const result = _.find(arr, ['_id', id]);
       if (result) {
         return true;
       } else {
         return false;
       }
     }

     online(event) {
      this.onlineusers = event;
      // console.log('this.onlineusers', this.onlineusers);
    }

     checkOnline(name) {
        const result = _.indexOf(this.onlineusers, name);
        // console.log('result', result);
        if (result > -1) {
            this.isOnline = true;
         } else {
            this.isOnline = false;
         }
      }

    profile(user) {
      this.username = user.username;
      console.log('client', this.username);
      this.router.navigate([`/profile/${user.username}`]);
      }
    }
