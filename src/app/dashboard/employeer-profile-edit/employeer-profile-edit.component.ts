import { Component, OnInit , Output , Input, EventEmitter } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Setting } from '../../services/setting.model';
import { NgForm} from '@angular/forms';
import { AuthService } from '../../auth/shared/auth.service';
import { Router, Data } from '@angular/router';
import { HttpErrorResponse} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FileUploader} from 'ng2-file-upload';
import io from 'socket.io-client';
import { ActivatedRoute} from '@angular/router';


const URL = 'http://localhost:3001/api/v1/image/upload-image';

@Component({
  selector: 'app-employeer-profile-edit',
  templateUrl: './employeer-profile-edit.component.html',
  styleUrls: ['./employeer-profile-edit.component.sass']
})
export class EmployeerProfileEditComponent implements OnInit {
  uploader: FileUploader = new FileUploader ({
    url: URL,
    disableMultipart: true,
  
  });

  selectedFile: any;
  @Output() valueChange;
  size = 0;
  unit = "";
  employeerSettingId: any;
  data = [];
  userId: any;
  errors: any[] = [];
  notifyMessage: string = '';
  selectedItem: Setting;
  settingId: any;
  socket: any;
  imageError = " ";
  length:any;
  errorMessage:string = " ";
  file:any;
  fileAvalable:boolean = true;
  error:any;

  @Input() selectedItems: Setting = new Setting(); //from parent to child
  @Output() sendSettingListEvent = new EventEmitter<NgForm>(); //from child to parent

  constructor(private http: HttpClient , private settingsService: SettingsService, 
              private authService: AuthService , private route:ActivatedRoute , private router: Router) { this.socket = io('http://localhost:3001'); }

  ngOnInit() {
    this.GetUser();
    this.getUserById();
    this.selectedItem = new Setting();
  }



  GetUser() {
    const result =  this.authService.getUserId();
    this.userId = result;
    console.log('foundUser', this.userId);
   }

  getUserById() {
    this.authService.singleUser(this.userId).subscribe(
      data => {
         this.data = data;
         this.employeerSettingId = data.employeerSettings;
         console.log('profileEmployeerId', this.employeerSettingId);
         this.getprofileById();
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
      });
  }

  getprofileById() {
    this.settingsService.employeerProfile(this.employeerSettingId).subscribe(
      data => {
         this.data = data;
         this.settingId = data._id;
      },
      (errorResponse: HttpErrorResponse) => {
      this.errors = errorResponse.error.errors;
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

  editSettings(settingForm) {
    this.settingUpdate(this.settingId , this.selectedItem , this.selectedFile );
  }

  settingUpdate(settingId , selectedItem ,selectedFile ) {
    this.settingsService.updateSetting(this.settingId, this.selectedItem , this.selectedFile ).subscribe(
         (updateSetting: Setting) => {
           this.selectedItem = updateSetting;
           this.sendSettingListEvent.emit(selectedItem.value);
           this.socket.emit('refresh', {}); 
           this.router.navigate(['/dashboard/profile-employeer']); 
           window.location.reload();
        },
          (errorResponse: HttpErrorResponse) => {
          this.errors = errorResponse.error.errors;
          console.log('errors', this.errors);
        });
    }



}
