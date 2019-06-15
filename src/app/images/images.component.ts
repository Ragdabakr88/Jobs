import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/shared/auth.service';
import {FileUploader} from 'ng2-file-upload';
import io from 'socket.io-client';

const URL = 'http://localhost:3001/api/v1/image/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.sass']
})

export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader ({
    url: URL,
    disableMultipart: true
  });
  selectedFile: any;
  userId: any;
  images = [];
  socket: any;
  imageVersion: any ;
  imageId: any;

  constructor(private router: Router , private route: ActivatedRoute, private authService: AuthService ) {
    this.socket = io('http://localhost:3001');
  }

  ngOnInit() {
    this.GetUser();
    this.getUserById(this.userId);
    this.socket.on('refreshPage', () => {
      this.GetUser();
      this.getUserById(this.userId);
    });
  }

  OnFileSelect(event) {
   const file: File = event[0];
   this.ReadAsBase64(file).then(result => {
     this.selectedFile = result;
   }).catch (err => console.log(err));
  }


  upload() {
  //  console.log(this.selectedFile);
  const filePath = <HTMLInputElement>document.getElementById('filePath');
  filePath.value = '';
  if (this.selectedFile){
    this.authService.AddImage(this.selectedFile).subscribe(
      data => {
        this.socket.emit('refresh', {});
        console.log(data);
        const filePath = <HTMLInputElement>document.getElementById('filePath');
        filePath.value = '';
      },
      err => console.log(err)
    );
   }
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

  GetUser() { //find userId who logged in 
    const result =  this.authService.getUserId();
    this.userId = result;
    console.log('getuser', this.userId);
   }

   getUserById(userId) {
    this.authService.singleUser(this.userId).subscribe(
      data => {
        // console.log(data);
        this.images = data.images;
        console.log('imagesss', this.images);

      });
    }

    setProfileImage(image) {
      this.socket.emit('refresh', {});
      console.log('image', image);
      this.imageVersion = image.imgVersion;
      this.imageId = image.imgId;
      this.authService.setProfileImage(this.imageVersion, this.imageId).subscribe(
        data => {
        this.socket.emit('refresh', {});
      });
    }

}
