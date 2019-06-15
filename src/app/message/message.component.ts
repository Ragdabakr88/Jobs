import { Component, OnInit, AfterViewInit , Input, SimpleChanges, OnChanges} from '@angular/core';
import { MessageService } from '../services/message.service';
import { AuthService } from '../auth/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import io from 'socket.io-client';
import * as _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit , OnChanges {
  @Input() users;
  errors: any[] = [];
  formData: any = [];
  recieverId: any;
  senderName: string;
  senderId: any;
  form: any;
  reciver: any;
  reciverId: any;
  reciverName: string;
  socket: any;
  convId: any;
  msgArray = [];
  sender: any;
  typingMessage;
  typing = false;
  usersArray = [];
  isOnline = false;
  picVersion: any;
  picId: any;
  picVersionSender: any;
  picIdSender: any;

  title = 'ngx-emoji-mart';
  toggled: boolean;
  message: string ;


constructor(private http: HttpClient , private messageService: MessageService , 
            private router: Router , private route: ActivatedRoute
  ,         private authService: AuthService ) {
    this.socket = io('http://localhost:3001');
    this.toggled = false;

    }


  ngOnInit() {

    this.recieverId = this.route.snapshot.paramMap.get('id');
    this.GetUser();
    this.getUserById(this.recieverId);
    this.getUserName();
    this.getUserSenderById(this.senderId);
    this.socket.on('refreshPage', () => {
      this.getUserById(this.recieverId);
      this.getUserSenderById(this.senderId);
      this.recieverId = this.route.snapshot.paramMap.get('id');
    });

    this.socket.on('is_typing', data => {
           if (data.sender === this.reciver){
             console.log(data);
             this.typing = true;
           }
      });

    // this.usersArray = this.users;
    // console.log('usersArray', this.usersArray);
  }

  ngAfterViewInit() {
    const params = {
   room1 : this.senderName,
   room2 : this.reciverName,
  };
    this.socket.emit('join', params);
}


ngOnChanges(changes: SimpleChanges) {
  console.log('changes', changes);
  if (changes.users.currentValue.length > 0) {
    // console.log(changes.users.currentValue);
    const result = _.indexOf(changes.users.currentValue, this.reciverName);
    if (result > -1) {
        this.isOnline = true;
     } else {
        this.isOnline = false;
     }
  }
}

  GetUser() { //find userId who logged in 
    const result =  this.authService.getUserId();
    this.senderId = result;
    console.log('getuser', this.senderId);
   }


  getUserName() {
    this.authService.singleUser(this.senderId).subscribe(
      data => {
        // console.log(data);
        this.senderName = data.username;
        console.log('getusername1', this.senderName);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  getUserSenderById(senderId) {
    this.authService.singleUser(this.senderId).subscribe(
      data => {
        this.picVersionSender = data.picVersion;
        this.picIdSender = data.picId;
        console.log('senderData', this.picVersionSender ,this.picIdSender );
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

   getUserById(recieverId) {
    this.authService.singleUser(this.recieverId).subscribe(
      data => {
        console.log('recieverData',data);
        this.reciverId = data._id;
        this.reciverName = data.username;
        this.picVersion = data.picVersion;
        this.picId = data.picId;
        console.log('recieverDataxxxx', this.picVersion , this.picId);
        console.log('getusername2', this.reciverName);
        this.getMessages(this.senderId, this.recieverId);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }



  sendMessage(senderId, recieverId, recieverName , message) {
    if (this.message) {
    this.messageService.SendMessage(this.senderId, this.recieverId, this.reciverName, this.message ).subscribe(
     data => {
      this.socket.emit('refresh', {});
      this.message = '' ;
      });
    }
  }

getMessages(senderId, recieverId) {
  this.messageService.getMessages(this.senderId, this.recieverId).subscribe(
    data => {
      console.log('messages', data);
      this.msgArray = data.messages;
    },
    (errorResponse) => {
      this.errors = errorResponse.error.errors;
   });
}

 IsTyping() {
    console.log('isTyping');
    this.socket.emit('start_typing', {
      sender : this.senderName,
       reciver: this.reciverName,
    });
   }

   handleSelection(event) { 
    // this.message = this.message + '' + event.char ;
    // console.log(this.message);
    this.message += event.char;
   }


}
