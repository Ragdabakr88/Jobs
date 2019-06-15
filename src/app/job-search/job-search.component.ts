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
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.sass']
})
export class JobSearchComponent implements OnInit {
errors: any[] = [];
data: Job[] = [];
  date: string;
  socket: any;
  jobId: string;
  job: Job;
  title: string;
  address: string;
  type: string;
  jobs= [];




  constructor(private http: HttpClient ,private route: ActivatedRoute ,private jobService: JobService , private router: Router) {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit() {
    this.route.params.subscribe(
  		(params) =>{
  			this.title = params['title'];
        this.address = params['address'];
        this.type = params['type'];
  			this.getSearchJobs();

  	})
  }


  getSearchJobs() {
    this.jobService.getJobsSearch(this.title , this.address , this.type).subscribe(
      (jobs: Job[]) => {
        this.jobs = jobs;
        console.log('searchData', this.jobs);
      },
      (errorResponse: any) => {
        this.errors = errorResponse.error.errors;
      })
  }


  TimeFromNow(time){
    return moment(time).fromNow();
  }


  search(title: string, address: string, type: string){
    // tslint:disable-next-line: no-debugger
              debugger;
              this.router.navigate([`/jobs/${title}/${address}/${type}/homes`]);
                }

}

