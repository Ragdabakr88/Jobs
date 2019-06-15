
import { Component, OnInit , AfterViewInit, Output , EventEmitter } from '@angular/core';
import { PostServiceService } from '../../services/post-service.service';
import { AuthService } from '../../auth/shared/auth.service';
import { FriendsService} from '../../services/friends.service';
import { Router, Data } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';
import { MessageService } from '../../services/message.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
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
  count = [];
  chatList: [];
  chatNumber = 0;
  countChat = [];
  Userusername: any;
  imgVersion: any;
  imgId: any;
  type:any;
  employeerSettingId:any;
  freelancerSettingId:any;
  isEmployee:boolean;
  isFreelancer:boolean;
  employeerSettings:boolean;
  jobOwner:boolean;
  notifiyJobs:any[]= [];
  role:any;

  constructor(private http: HttpClient , private route: ActivatedRoute , private postService: PostServiceService , private router: Router
    ,         private friendsService: FriendsService , private authService: AuthService , private messageService: MessageService ,
    private  settingsService: SettingsService
    ) {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit() {
    this.GetUser();
    this.getUserById(this.userId);
    // this.socket.on('refreshPage', data => {
    //   this.getUserById(this.userId);
    // });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      console.log('usersOnline', data);
      this.onlineUsers.emit(data);
    });
}

  GetUser() { //find user who logged in 
   const result =  this.authService.getUserId();
   this.userId = result;
  //  console.log(this.userId);
  }




  getUserById(userId) {
    this.authService.singleUser(this.userId).subscribe(
      data => {
        this.data = data;
        this.role = data.role;
        this.notifiyJobs = data.notifiyJobs;
        console.log('userData', this.data);
        console.log('notifiyJobs', this.notifiyJobs);
        this.imgVersion = data.picVersion;
        this.imgId = data.picId;
        this.employeerSettingId = data.employeerSettings;
        // console.log('employeerSettingId', this.employeerSettingId);
        this.freelancerSettingId = data.freelancerSettings;
        // console.log('imageData', this.imgVersion , this.imgId);
        this.Userusername = data.username;
        // console.log('navdata', this.data);


        //  console.log('name', this.Userusername);+
        this.notify = data.notifications.reverse();
        //  console.log('notify', this.notify);
        const value = _.filter(this.notify, ['read', false]);
        this.count = value;
        //  console.log('count', this.count);
        this.chatList =  data.chatList.reverse();
        //  console.log('message', this.chatList);
        const value2 = _.filter(this.chatList, ['read', false]);
        this.countChat = value2;
        //  console.log('countChat', this.countChat);
        this.getprofileById();
        this.getprofileFreelancerById();

        this.socket.emit('online', {room:'global', user : this.Userusername});
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
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


  markAll() {
    this.friendsService.markAll().subscribe(
      data => {
        console.log(data);
         this.socket.emit('refresh', {});
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

 logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}


TimeFromNow(time) {
  return moment(time).fromNow();
}

MessageDate(data) {
  return moment(data).calendar(null,{
    sameDay: '[Today]',
    lastDay: '[Yesteroday]',
    lastWeek: 'DD/MM/YYYY',
    sameElse: 'DD/MM/YYYY'
     });
   }


  deleteChatListMsg(chat) {
      this.notifyId = chat._id;
      console.log('chatId', 'this.notifyId');
      this.messageService.deleteNotification(this.notifyId).subscribe(
        data => {
           this.socket.emit('refresh', {});
           console.log(this.data);
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        });
    }


    
  getprofileById() {
    this.settingsService.employeerProfile(this.employeerSettingId).subscribe(
      data => {
         this.data = data;
         this.isEmployee = data.isEmployee;
         this.jobOwner = true;
         console.log('this.isEmployee', this.isEmployee);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  getprofileFreelancerById() {
    this.settingsService.freelancerProfile(this.freelancerSettingId).subscribe(
      data => {
         this.data = data;
         this.isFreelancer = true;
         console.log('this.isfreelancer', this.isFreelancer);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

}
