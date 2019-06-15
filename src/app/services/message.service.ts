import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  public SendMessage(senderId, recieverId, recieverName , message): Observable<any> {
    return this.http.post(`/api/v1/message/chat/${senderId}/${recieverId}`, {
       recieverId, recieverName , message, senderId
      });
    }

    public getMessages(senderId, recieverId): Observable<any> {
      return this.http.get(`/api/v1/message/chatMsg/${senderId}/${recieverId}`,);
      }

      public deleteNotification(notifyId: string): Observable<any> {
        return this.http.post(`api/v1/message/delete/${notifyId}`,{notifyId});
      }

      public messages(senderId, recieverId, recieverName , message): Observable<any> {
        return this.http.post(`/api/v1/message/chat/${senderId}/${recieverId}`, {
           recieverId, recieverName , message, senderId
          });
        }
}
