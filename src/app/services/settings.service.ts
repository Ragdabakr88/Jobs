
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from './job.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }
   public postSettings(body: any): Observable<any> {
    return this.http.post('/api/v1/settings/createSetting' , body);
  }

  public postEmployeeSettings(body: any): Observable<any> {
    return this.http.post('/api/v1/settings/createEmployeerSetting' , body);
  }

  public employeerProfile(employeerSettingId: string): Observable<any> {
    return this.http.get(`api/v1/settings/${employeerSettingId}`);
  } 


  public updateSetting(settingId: string, setting: any , selectedFile:any  ): Observable<any> {
  return this.http.patch(`/api/v1/settings/${settingId}`, { setting , selectedFile} );
  }

  public freelancerProfile(freelancerSettingId: string): Observable<any> {
    return this.http.get(`api/v1/settings/${freelancerSettingId}`);
  }

  public updateSettingFreelancer(settingId: string, setting: any , selectedFile:any ,skillList:any ,slider:any , selectedCv:any ): Observable<any> {
    return this.http.patch(`/api/v1/settings/freelanserEdit/${settingId}`, { setting , selectedFile , skillList , slider, selectedCv} );
    }
}