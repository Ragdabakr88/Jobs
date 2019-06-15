
import { Component, OnInit, Output, EventEmitter , ViewChild } from '@angular/core';
import { Job } from '../services/job.model';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/shared/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import { SettingsService } from '../services/settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FileUploader} from 'ng2-file-upload';
import { ApplayJob } from '../services/applayJob.model';
import io from 'socket.io-client';
import * as _ from 'lodash';

const URL = 'http://localhost:3001/api/v1/image/upload-image';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.sass']
})
export class JobDetailComponent implements OnInit {
  @ViewChild('settingsForm') myForm;
  uploader: FileUploader = new FileUploader ({
    url: URL,
    disableMultipart: true
  });
  closeResult: string;

  selectedFile: any;
  @Output() valueChange;
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
  modalRef:any;
  length:any;
  selectedCv: any;
  notifyMessage: string = "";
  socket: any;
  form: any;
  data:Job;
  fileAvalable:boolean = true;
  isBookmarked:boolean = false;
  display="none";
  isApplay:any;
  jobDetail:any;


  constructor(private http: HttpClient 
    ,        private modalService: NgbModal
    ,         private settingsService: SettingsService
    ,  private authService : AuthService ,  private route: ActivatedRoute ,
     private jobService: JobService , private router: Router)
     { this.socket = io('http://localhost:3001');}

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.getJob(this.jobId);
    this.newSettings = new ApplayJob();
    this.socket.on('refreshPage', data => {
      this.applayJob(); 
      });

  }

  // open(content) {
  //   this.modalService.open(content).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }


  getJob(jobId) {
    this.jobService.getJobById(this.jobId).subscribe(
     data => {
        this.data = data;
        this.jobDetail = data;
        this.isApplay = data.jobApplicants;
        console.log('myJob', this.data);
        console.log('applay for jobs', this.isApplay);
        this.userId = data.user;
        this.getUserById();
        this.bookmark();
      });
    }

    
    checkInArr(arr , id) {
      const result = _.find(arr, ['_id', id]);
      if (result) {
        return true;
      } else {
        return false;
      }
    }

    getUserById() {
      console.log('userId33', this.userId);
      this.jobService.jobOwner(this.userId).subscribe(
        data => {
           this.userData = data;
           this.employeerSettingId = data.employeerSettings;
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
           this.employeeId = data._id;
          //  console.log('employeeId', this.employeeId );
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        });
    }

    getPofile() {
      console.log('employeeId', this.employeeId );
      console.log('done');
      this.router.navigate([`/dashboard/profile-employeer/${this.employeeId }`]);
     }

    TimeFromNow(time){
      return moment(time).fromNow();
    }


    applayJob() {
      console.log('job', this.newSettings ,this.selectedCv );
      const body = {
        settings: this.newSettings,
        cv: this.selectedCv,
      };
      console.log(body);
      this.jobService.applayJob(body, this.jobId).subscribe(
        () => {
          this.isApplay = true;
          this.notifyMessage = 'تم التقديم علي هذه الوظيفة بنجاح';
          this.myForm.resetForm();

          // window.location.reload();
        },
        (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        console.log("errorsss",this.errors);
      });
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

    //  private getDismissReason(reason: any): string {
    //   if (reason === ModalDismissReasons.ESC) {
    //     return 'by pressing ESC';
    //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //     return 'by clicking on a backdrop';
    //   } else {
    //     return  `with: ${reason}`;
    //   }
    // }


    openModelDialog(){
      this.display='block';
    }

    closeModelDialog(){
      this.display='none';
    }
    LoginToApplay(){
      this.router.navigate(['/login']);
    }


    bookmark(){
      this.jobService.bookMark(this.jobId,this.jobDetail ).subscribe(
       data => {
         this.isBookmarked = true;
        console.log(data);
       });
   }

}



