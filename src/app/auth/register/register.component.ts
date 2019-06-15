import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any;
formData: any = [];
  errors: any[] = [];
  notifyMessage:string ="";
  constructor(private http: HttpClient , private authService: AuthService , private router: Router) { }

  ngOnInit() {
    this.formData = {};
    // this.formData.freelancer = false;
    // this.formData.employee = false;
  }

  register() {
    console.log(this.formData);
    this.authService.register(this.formData).subscribe(
      () => {

        this.router.navigate(['/streams', {registered: 'Success'}]); // will be params route in login
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
    });
  }



}
