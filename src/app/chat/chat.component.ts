import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
// tslint:disable-next-line: variable-name
 online_users = [];
  constructor() { }

  ngOnInit() {
  }

  online(event){
    console.log(event);
    this.online_users = event;
  }

}
