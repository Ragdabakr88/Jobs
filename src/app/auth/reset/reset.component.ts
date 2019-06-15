import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import io from 'socket.io-client';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  errors: any[] = [];
  resetData: any;
  private token: string;
  notifyMessage:string ='';
  socket: any;
  // token:string = '';
    constructor(private http: HttpClient , private authService: AuthService ,
       private router: Router , private route: ActivatedRoute) { this.socket = io('http://localhost:3001');}


  ngOnInit() {
     this.resetData = {}; 
     this.token = this.route.snapshot.paramMap.get('token');
     this.socket.on('refreshPage', data => {
     this.Submit(this.token);
     });
     this.route.params.subscribe((params) => {
      if (params['resetP'] === 'Success'){
        this.notifyMessage ='تم تحديث كلمه المرور بنجاح';
      }
      
    });
  }

  Submit(token) {
    console.log(token);
    this.authService.resetPass(this.resetData , token).subscribe(
      data => {
    debugger;
       this.socket.emit('refresh', {}); 
       this.resetData =  data;
       console.log(this.resetData);
       console.log(this.token);
       this.router.navigate([`/reset/${this.token}`, {resetP: 'Success'}]).then(()=>  {window.location.reload();});
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;
     });
  }
}
