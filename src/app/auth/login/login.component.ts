import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
errors: any[] = [];
formData: any = [];


  constructor(private http: HttpClient , private authService: AuthService , 
    private router: Router , private route: ActivatedRoute) { }

  ngOnInit() {
    this.formData = {};
     
  }


 login() {
    console.log(this.formData);
    this.authService.login(this.formData).subscribe(
      (token) => {

// tslint:disable-next-line: no-debugger
        debugger;
        console.log(token);

        this.router.navigate(['/streams', {logined: 'success'}]);
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;
     });
  }

  forgotPass() {
    this.router.navigate(['/forgot-password' ]);
  }



}
