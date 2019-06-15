import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import { Router, Data } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';
import { ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-employeer-profile',
  templateUrl: './employeer-profile.component.html',
  styleUrls: ['./employeer-profile.component.sass']
})
export class EmployeerProfileComponent implements OnInit {
userId: any;
employeerSettingId: string;
data = [];
errors: any[] = [];
setting:Setting;
selectedItem:Setting = new Setting();
settingId:any;
companyId:any;



  constructor(private http: HttpClient , 
              private settingsService: SettingsService ,
              private route: ActivatedRoute,
              private authService: AuthService ,  private router: Router) { }


  ngOnInit() { 
    this.companyId = this.route.snapshot.paramMap.get('employeeId');
    this.GetUser();
    this.getUserById();
    this.getprofileById();
    console.log('companyId', this.companyId);
  }



  GetUser() {
    const result =  this.authService.getUserId();
    this.userId = result;
   }

   getUserById() {
    this.authService.singleUser(this.userId).subscribe(
      data => {
         this.selectedItem = data;
        //  console.log('profile', this.selectedItem);
         this.employeerSettingId = data.employeerSettings;
        //  console.log('profileEmployeerId', this.employeerSettingId);
         this.getprofileById();
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }




  getprofileById() {
    this.settingsService.employeerProfile(this.employeerSettingId).subscribe(
      data => {
         this.selectedItem = data;
         this.settingId = data._id;
         console.log('eployeerdata', this.selectedItem);
         console.log('id', this.settingId );
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
