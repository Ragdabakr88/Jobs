
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import { Router, Data } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';

@Component({
  selector: 'app-freelancer-profile',
  templateUrl: './freelancer-profile.component.html',
  styleUrls: ['./freelancer-profile.component.sass']
})
export class FreelancerProfileComponent implements OnInit {
userId: any;
freelancerSettingId: string;
data = [];
errors: any[] = [];
setting:Setting;
selectedItem:Setting = new Setting();
// selectedItem = [];
settingId:any;
cvVersion:any;
cvId:any;
cv:any;



  constructor(private http: HttpClient , private settingsService: SettingsService , private authService: AuthService ,  private router: Router) { }

  ngOnInit() { 
    this.GetUser();
    this.getUserById();

  }

  GetUser() { 
    const result =  this.authService.getUserId();
    this.userId = result;
    console.log('id', this.userId);
   }

   getUserById() {
    this.authService.singleUser(this.userId).subscribe(
      data => {
         this.selectedItem = data;
         console.log('profile', this.selectedItem);
         this.freelancerSettingId = data.freelancerSettings;
         console.log('freelancerSettingId', this.freelancerSettingId);
         this.getprofileById();
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }


  getprofileById() {

    this.settingsService.freelancerProfile(this.freelancerSettingId).subscribe(
      data => {
         this.selectedItem = data;
       const cvVersion =  this.cvVersion = data.cvVersion;
       const cvId=  this.cvId = data.cvId;
         this.cv = `http://res.cloudinary.com/dnf8ntdmr/image/upload/v${cvVersion}/${cvId}.pdf`;
         console.log('cvId',this.cv);


         console.log('freelancerdata', this.selectedItem);
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  editSetting(setting: Setting) {
    this.selectedItem = setting;
    console.log('editFom', this.selectedItem);
  }

  sendSettingListEventHandler(event) {
    console.log('editValllllresult', event);
    this.selectedItem = event;
  }


}
