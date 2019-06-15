import { Component, OnInit ,Input} from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import io from 'socket.io-client';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  errors: any[] = [];
  emailInput: any = [];
  socket: any;
  notifyMessage:string ='';
  email:any;
 
  constructor(private http: HttpClient , private authService: AuthService ,
     private router: Router , private route: ActivatedRoute) { this.socket = io('http://localhost:3001');}

  ngOnInit() {
      this.emailInput = {};
      this.socket.on('refreshPage', data => {
      this.Submit();
      });
      this.route.params.subscribe((params) => {
        if (params['forgot'] === 'Success'){
          this.notifyMessage ='تم ارسال لنك تحديث كلمه المرور الي ايميلك بنجاح';
        }
        
      });
  }

    Submit() {
      console.log(this.emailInput);
      this.authService.forgotPass(this.emailInput).subscribe(
        data => {
          this.socket.emit('refresh', {});
          this.emailInput =  data;
          console.log(this.emailInput);
          this.router.navigate(['/forgot-password', {forgot: 'Success'}]).then(()=>  {window.location.reload();});
    });
        

    }


  }
