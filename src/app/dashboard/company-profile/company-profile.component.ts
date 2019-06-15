
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import { Router, Data } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';
import { ActivatedRoute} from '@angular/router';
import { JobService } from '../../services/job.service';



@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.sass']
})

export class CompanyProfileComponent implements OnInit {
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
              private authService: AuthService ,
              private jobService: JobService,
                private router: Router) { }


  ngOnInit() { 
    this.companyId = this.route.snapshot.paramMap.get('employeeId');
    // this.getUserById();
    this.getprofileById();
    console.log('companyId', this.companyId);
  }

  getprofileById() {
    this.jobService.jobOwenerProfile(this.companyId).subscribe(
      data => {
         this.selectedItem = data;
         console.log('selectedItem', this.selectedItem );
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }


}
