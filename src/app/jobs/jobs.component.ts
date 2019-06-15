
import { Component, OnInit } from '@angular/core';
import { Job } from '../services/job.model';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';
// import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.sass']
})
export class JobsComponent implements OnInit {
errors: any[] = [];
data: Job[] = [];
  date: string;
  socket: any;
  jobId: string;
  job: Job;
  p:string;
  jobs:Job[];
  objectA:any;
  objectB:any;
  userId:any;
  userData:any;
  employeerSettingId:any;
  employeeData:any;



  constructor(private http: HttpClient ,private route: ActivatedRoute ,private jobService: JobService , private router: Router) {
    this.socket = io('http://localhost:3001');
  }


  ngOnInit() {
  this.allJobs();
  this.getJob(this.job);
  this.socket.on('refreshPage', data => {
    this.allJobs();
    });
  }


  allJobs() {
    this.jobService.getAllJobs().subscribe(
      data => {
        this.data = data ;
        console.log('alljobs',this.data);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  order = "title";
  reverse = false;
  // addLikes(d) {
  //   this.postService.addLikes(d).subscribe(
  //     data => {
  //       console.log(data);
  //       this.socket.emit('refresh', {});
  //     },
  //     (errorResponse: HttpErrorResponse) => {
  //     this.errors = errorResponse.error.errors;
  //     });
  // }

       getJob(job) {
         this.jobId = job._id;
        this.jobService.getJobById(this.jobId).subscribe(
          (job: Job) => {
            this.job = job;
            this.userId = job.user;
            this.router.navigate([`/job-detail/${this.jobId}`]); 
            console.log('myJob', this.job);
            this.getUserById();
          });
        }

          getUserById() {
            this.jobService.jobOwner(this.userId).subscribe(
              data => {
                 this.userData = data;
                 this.employeerSettingId = data.employeerSettings;
                //  console.log('employeerSettingsId', this.employeerSettingId);
                //  console.log('UserData', this.userData);
                 this.getprofileById();
              },
              (errorResponse: HttpErrorResponse) => {
              this.errors = errorResponse.error.errors;
              });
          }

          getprofileById() {
            this.jobService.jobOwenerProfile(this.employeerSettingId).subscribe(
              data => {

                 this.employeeData = data;
                 console.log('UserData', this.employeeData);
              },
              (errorResponse: HttpErrorResponse) => {
              this.errors = errorResponse.error.errors;
              });
          }


        TimeFromNow(time){
          return moment(time).fromNow();
        }

        search(title: string, address: string, type: string){
// tslint:disable-next-line: no-debugger
          debugger;
          this.router.navigate([`/jobs/${title}/${address}/${type}/homes`]);
            }

            bookmark(jobId ,job){
               console.log(jobId,job);
               this.jobService.bookMark(jobId,job).subscribe(
                data => {
                 console.log(data);
                });
            }

}
