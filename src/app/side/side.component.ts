import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.scss']
})
export class SideComponent implements OnInit {
  userId: any;
  name: any;
  type:any;

  constructor(private http: HttpClient ,
    private router: Router , private route: ActivatedRoute
,         private authService: AuthService) { }

  ngOnInit() {
    this.GetUser();
    this.getUserById(this.userId);
  }

  GetUser() { //find user who logged in 
    const result =  this.authService.getUserId();
    this.userId = result;
    console.log('userId', this.userId);
   }

   getUserById(userId) {
    this.authService.singleUser(this.userId).subscribe(
      data => {
        this.type = data.role;
        console.log('role', this.type);
        console.log('data2', data);
        this.name = data.username;
        console.log('name', this.name);
      });
    }
}
