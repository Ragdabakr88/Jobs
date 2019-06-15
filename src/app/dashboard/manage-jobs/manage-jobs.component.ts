
import { Component, OnInit, Output, EventEmitter , ViewChild } from '@angular/core';
import { Job } from '../../services/job.model';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/shared/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import { SettingsService } from '../../services/settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FileUploader} from 'ng2-file-upload';
import { ApplayJob } from '../../services/applayJob.model';
import io from 'socket.io-client';
import * as _ from 'lodash';

const URL = 'http://localhost:3001/api/v1/image/upload-image';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.sass']
})
export class ManageJobsComponent implements OnInit {

  jobId: any;
  errors: any[] = [];
  job: any;
  userId: any;
  userData: any;
  length: any;
  socket: any;
  data: Job;
  jobs = [];
  applayforJobs = [];
  myJobId: any;


  constructor(private http: HttpClient 
    ,        private modalService: NgbModal
    ,         private settingsService: SettingsService
    ,  private authService : AuthService ,  private route: ActivatedRoute ,
     private jobService: JobService , private router: Router)
     { this.socket = io('http://localhost:3001');}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getUserById();
    this.socket.on('refreshPage', data => {
      this.getUserById();
    });
  }


    getUserById() {
      this.jobService.jobOwner(this.userId).subscribe(
        data => {
           this.userData = data;
           this.jobs = data.jobs;
           this.applayforJobs = data.applayforJobs;
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        });
    }


    TimeFromNow(time){
      return moment(time).fromNow();
    }

    delete(job) {
      this.myJobId = job._id;
// tslint:disable-next-line: no-debugger
      debugger;
      this.jobService.deleteMyJob(this.myJobId ,this.jobId).subscribe(
        data => {
           this.socket.emit('refresh', {});
           console.log(this.data);
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        });
    }



}



