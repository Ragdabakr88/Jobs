
import { Component, OnInit , Output, EventEmitter, ViewChild} from '@angular/core';
import { HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute} from '@angular/router';
import { FileUploader} from 'ng2-file-upload';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';
import io from 'socket.io-client';

const URL = 'http://localhost:3001/api/v1/image/upload-image';


@Component({
  selector: 'app-stettings-freelancer',
  templateUrl: './stettings-freelancer.component.html',
  styleUrls: ['./stettings-freelancer.component.sass']
})
export class StettingsFreelancerComponent implements OnInit {
  @ViewChild('settingsForm') myForm;
  
  @Output() valueChange;
  uploader: FileUploader = new FileUploader ({
    url: URL,
    disableMultipart: true
  });
  length:any;
  selectedFile: any;
  selectedCv: any;
  newSettings: Setting;
  notifyMessage: string = "";
  socket: any;
  skillList : Array<any> = [];
  skillName: string;
  slider: any;
  form: any;
  errors: any[] = [];
  fileAvalable:boolean = true;

  constructor(private http: HttpClient ,private settingsService : SettingsService ,
     private route: ActivatedRoute , private router: Router) 
     {this.socket = io('http://localhost:3001');}

  ngOnInit() {
    this.slider = 5;
    this.newSettings = new Setting();
    this.socket.on('refreshPage', data => {
      this.postSettings(); 
      });
  }


  postSettings() {
    console.log('job', this.newSettings ,this.selectedFile ,this.selectedCv ,this.slider ,this.skillList);
    const body = {
      image: this.selectedFile,
      settings: this.newSettings,
      cv: this.selectedCv,
      slider: this.slider,
      skillList: this.skillList,
    };
    console.log(body);
    this.settingsService.postSettings(body).subscribe(
      () => {
        this.notifyMessage = 'تم اضافه الاعدادت بنجاح ';
        this.myForm.resetForm();
        // window.location.reload();
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      console.log("errorsss",this.errors);
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
    const sizeImage = file.size;
    console.log('sizeImage', sizeImage);
    if (sizeImage > 169999) {
      this.fileAvalable = false;
         alert("File is too big!");
         const fileImage = '';
         this.ReadAsBase64(fileImage).then(result => {
         this.selectedFile = result;
        }).catch (err => console.log(err));
    } else {
        this.ReadAsBase64(file).then(result => {
          this.selectedFile = result;
          this.fileAvalable = true;
          console.log('file',this.selectedFile);
        }).catch (err => console.log(err));
      }
   }

   OnCvSelect(event) {
    const file: File = event[0];
    const sizeImage = file.size;
    console.log('sizeImage', sizeImage);
    if (sizeImage > 169999) {
      this.fileAvalable = false;
         alert("File is too big!");
         const fileImage = '';
         this.ReadAsBase64(fileImage).then(result => {
         this.selectedCv = result;
        }).catch (err => console.log(err));
    } else {
        this.ReadAsBase64(file).then(result => {
          this.selectedCv = result;
          this.fileAvalable = true;
          console.log('file',this.selectedCv);
        }).catch (err => console.log(err));
      }
   }

 


  addSkill() {
    console.log(this.skillName);
    this.skillList.push({skill:this.skillName});
    this.skillName =' ';
    console.log(this.skillList);
  }

  valueChanged(e) {
    console.log('e', e);
    this.slider = e;
    console.log('slider', this.slider);
}


deletSkill(skill) {
  console.log(skill);
  for(var  i=0; i < this.skillList.length; i++) {
    if(this.skillList[i]["skill"] == skill) {
      this.skillList.splice(i, 1);
    }
  }
}


}
