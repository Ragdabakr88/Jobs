

import { Component, OnInit, Output, EventEmitter , ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute} from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';
import { Job } from '../../services/job.model';
import {HttpErrorResponse} from '@angular/common/http';
import { FileUploader} from 'ng2-file-upload';
import io from 'socket.io-client';


const URL = 'http://localhost:3001/api/v1/image/upload-image';
@Component({
  selector: 'app-stettings-employeer',
  templateUrl: './settings-employeer.component.html',
  styleUrls: ['./settings-employeer.component.sass']
})
export class SettingsEmployeerComponent implements OnInit {
  uploader: FileUploader = new FileUploader ({
    url: URL,
    disableMultipart: true
  });
  selectedFile: any;
  @Output() valueChange;
  newSettings: Setting;
  errors: any[] = [];
  notifyMessage: string = '';
  socket: any;

  @ViewChild('settingsForm') myForm;

  constructor(private http: HttpClient , private settingsService: SettingsService ,
     private route: ActivatedRoute , private router: Router) { this.socket = io('http://localhost:3001');}

  ngOnInit() {
    this.newSettings = new Setting();
  }


  

  postSetting() {
    console.log('setting', this.newSettings ,this.selectedFile);
    const body = {
      image: this.selectedFile,
      settings: this.newSettings,
    };
    this.settingsService.postEmployeeSettings(body).subscribe(
      () => {
        this.router.navigate(['/dashboard/settings-employeer']);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
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

  OnFileSelect(event) {
    const file: File = event[0];
    this.ReadAsBase64(file).then(result => {
      this.selectedFile = result;
    }).catch (err => console.log(err));
   }

}
