import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {
  notifyMessage: string = "";
  constructor( private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['registered'] === 'Success'){
        this.notifyMessage = "تم التسجيل بنجاح الرجاء الذهاب الي ايميلك لتفعيله للدخول للموقع";
      }
      });
  }

}
