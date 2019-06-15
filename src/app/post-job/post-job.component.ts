
import { Component, OnInit,ViewChild } from '@angular/core';
import { JobService } from '../services/job.service';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute} from '@angular/router';
import { Job } from '../services/job.model';
import {HttpErrorResponse} from '@angular/common/http';
import io from 'socket.io-client';


@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.sass']
})
export class PostJobComponent implements OnInit {
  newJob: Job;
  errors: any[] = [];
  notifyMessage:string ="";
  socket: any;
  jobCategories = Job.CATEGORIES;
  @ViewChild('jobForm') myForm;
 

  constructor(private http: HttpClient , private jobService: JobService , private route: ActivatedRoute , private router: Router) { this.socket = io('http://localhost:3001');}

  ngOnInit() {
    this.newJob = new Job();
    this.socket.on('refreshPage', data => {
      this.postJob();
      });
      this.route.params.subscribe((params) => {
        if (params['postJob'] === 'Success'){
          this.notifyMessage ='تم اضافه الوظيفه المطلوبه بنجاح';
        }
      });
  }

  postJob() {
    console.log('job',this.newJob);
    this.jobService.postJob(this.newJob).subscribe(
      () => {
        // this.socket.emit('refresh', {});
        this.router.navigate(['/post-job', {postJob: 'Success'}]); 
        this.myForm.resetForm();
        // window.location.reload();
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
    });
  }


 

}
