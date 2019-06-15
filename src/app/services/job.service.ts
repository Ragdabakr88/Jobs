
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from './job.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService{

  constructor(private http: HttpClient) { }

  public postJob(job: Job): Observable<any> {
    return this.http.post('/api/v1/jobs/createJob' , job);
  }
  public getAllJobs(): Observable<any> {
    return this.http.get('/api/v1/jobs/allJobs');
  }
  public getJobById( jobId: string): Observable<any> {
    return this.http.get(`/api/v1/jobs/singleJob/${jobId}`);
  }
  public getJobsSearch(title: string, address: string, type: string): Observable<any> {
    return this.http.get(`/api/v1/jobs?title=${title}&address=${address}&type=${type}`);
   }
   public bookMark(jobId: any,data:any): Observable<any> {
     return this.http.post(`/api/v1/jobs/bookmarks/${jobId}`, {jobId, data});
   }
   public deleteBookmarkJob(jobId: string): Observable<any> {
    return this.http.post(`api/v1/jobs/delete/${jobId}`, {jobId});
  }

  public jobOwner(userId: string): Observable<any> {
   return this.http.get(`api/v1/jobs/jobOwner/${userId}`);
  }

  public jobOwenerProfile(employeerSettingId: string): Observable<any> {
    return this.http.get(`api/v1/jobs/jobOwenerProfile/${employeerSettingId}`);
  }

  public applayJob(body: any ,jobId:string): Observable<any> {
    return this.http.post(`/api/v1/jobs/applayJob/${jobId}` , body);
  }
  public deleteApplay(applayId: string , jobId: string): Observable<any> {
    return this.http.post(`api/v1/jobs/deleteApplay/${applayId}`, {applayId,jobId});
  }

  public deleteMyJob(myJobId : string , jobId: string): Observable<any> {
    debugger;
    return this.http.post(`api/v1/jobs/deleteMyJob/${myJobId}`, {myJobId ,jobId});
  }

  


}
