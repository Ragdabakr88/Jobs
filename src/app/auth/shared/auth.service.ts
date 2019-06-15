

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { User } from './auth.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

// data will found when we decode token
class DecodedToken {
  exp = 0;
  username = '';
}

@Injectable()
export class AuthService {
  private decodedToken;

  constructor(private http: HttpClient) {
    this.decodedToken =
      JSON.parse(localStorage.getItem('app_meta')) || new DecodedToken();
  }

  private decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  // save decoded token to localstorge to can use user in our app
  private saveToken(token: string): string {
    this.decodedToken = this.decodeToken(token);
    localStorage.setItem('app_auth', token);
    localStorage.setItem('app_meta', JSON.stringify(this.decodedToken));

    return token;
  }
  // if time now < token time is auth
  private getExpiration() {
    return moment.unix(this.decodedToken.exp);
  }

  public register(formData: any): Observable<any> {
    return this.http.post('api/v1/users/register', formData);
  }

  public login(formData: any): Observable<any> {
// tslint:disable-next-line: no-debugger
    debugger;
    return this.http
      .post('api/v1/users/auth', formData)
      .pipe(map((token: string) => this.saveToken(token)));
  }

  public logout() {
    localStorage.removeItem('app_auth'); // Remove localStorge
    localStorage.removeItem('app_meta');

    this.decodedToken = new DecodedToken(); // Reset to decodedtoken
  }
  // check if user is auth
  public isAuthenticated(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  // Get user username
  public getUserName(): string {
    return this.decodedToken.username;
  }

  // Get user userId
  public getUserId(): string {
    return this.decodedToken.userId;
  }

  // Get auth token to header http
  public getAuthToken(): string {
    return localStorage.getItem('app_auth');
  }

 // GoogleAuth
  public googleAuth(): Observable<any> {
    return this.http.get('api/v1/auth/google');
  }


  // Forgot password route
  public forgotPass(data: any): Observable<any> {
      return this.http.post('api/v1/users/forgot', data);
  }

// reset  password route
  public resetPass(data: any , token: any): Observable<any> {
        return this.http.post(`api/v1/users/reset/${token}`, data);
    }

    // user
  public singleUser(userId: string): Observable<any> {
  return this.http.get(`api/v1/users/${userId}`);
} 

    // Add image
  public AddImage(image): Observable<any> {
      return this.http.post('api/v1/image/upload-image', {
        image
      });
    }

  public setProfileImage(imageId, imageVersion): Observable<any> {
      return this.http.get(`api/v1/image/setProfile/${imageId}/${imageVersion}`);
  }

}