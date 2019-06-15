

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
import { MessageService } from '../../services/message.service';

const URL = 'http://localhost:3001/api/v1/image/upload-image';

@Component({
  selector: 'app-manage-candidates',
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.sass']
})

export class ManageCandidatesComponent implements OnInit {
  uploader: FileUploader = new FileUploader ({
    url: URL,
    disableMultipart: true
  });
  closeResult: string;
  selectedFile: any;
  newSettings: ApplayJob;
  jobId: any;
  errors: any[] = [];
  date: string;
  job: any;
  userId: any;
  userData: any;
  employeerSettingId: any;
  employeeData: any;
  profileId:any;
  employeeId:any;
  Id:any;
  length:any;
  selectedCv: any;
  notifyMessage: string = "";
  socket: any;
  form: any;
  data:Job;
  fileAvalable:boolean = true;
  isApplay = [];
  jobDetail:any;
  jobs = [];
  applayforJobs=[];
  display="none";
  appalyId:any;
  recieverName:any;
  message:string;
  recieverId:any;



  constructor(private http: HttpClient 
    ,        private modalService: NgbModal
    ,         private settingsService: SettingsService
    ,  private authService : AuthService ,
    private messageService :MessageService,
    private route: ActivatedRoute ,
     private jobService: JobService , private router: Router)
     { this.socket = io('http://localhost:3001')}

  ngOnInit() {
    this.jobId= this.route.snapshot.paramMap.get('jobId');
    this.getJob(this.jobId);
    this.getUserById();
    this.socket.on('refreshPage', data => {
      this.getJob(this.jobId);
    });
  }


  getJob(jobId) {
    this.jobService.getJobById(this.jobId).subscribe(
     data => {
        this.data = data;
        this.jobDetail = data;
        this.isApplay = data.jobApplicants;
        console.log('myJob', this.data);
        console.log('jobApplicants', this.isApplay);
        this.userId = data.user;
        this.getUserById();
      });
    }


    getUserById() {
      this.jobService.jobOwner(this.userId).subscribe(
        data => {
           this.userData = data;
           this.jobs = data.jobs;
           
           this.applayforJobs = data.applayforJobs;
           console.log('this.applayforJobs',  this.applayforJobs);
           console.log('this.userData',  this.userData);
           this.employeerSettingId = data.employeerSettings;
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        });
    }


    TimeFromNow(time){
      return moment(time).fromNow();
    }


    ReadAsBase64(file): Promise <any> {
      const reader = new FileReader();
      const fileValue = new Promise((resolve, reject) => {
        reader.addEventListener('load', () => {
          resolve(reader.result);
        });
        reader.addEventListener('error', (event) => {
          reject(event);
        });
        reader.readAsDataURL(file)
      });
      return fileValue;
    }

  OnCvSelect(event) {
      const file: File = event[0];
      const sizeImage = file.size;
      console.log('sizeImage', sizeImage);
      if (sizeImage > 169999) {
        this.fileAvalable = false;
        alert("File is too big!");
           const fileImage = '';
           this.ReadAsBase64(fileImage).then(result => {
           this.selectedCv = result;
          }).catch (err => console.log(err));
      } else {
          this.ReadAsBase64(file).then(result => {
            this.selectedCv = result;
            this.fileAvalable = true;
            console.log('file',this.selectedCv);
          }).catch (err => console.log(err));
        }
     }

     messages(message ,applay) {
       this.message = message;
       this.recieverName = applay.name;
       this.recieverId = applay._id;
      if (this.message) {
      this.messageService.messages(this.userId, this.recieverId, this.recieverName, this.message ).subscribe(
       data => {
        this.socket.emit('refresh', {});
        this.message = '' ;
        });
      }
    }

  
     delete(applay) {
      this.appalyId = applay._id;
      this.jobService.deleteApplay(this.appalyId ,this.jobId).subscribe(
        data => {
           this.socket.emit('refresh', {});
           console.log(this.data);
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        });
    }
   
 

    openModelDialog(){
      this.display='block';
    }

    closeModelDialog(){
      this.display='none';
    }

}



