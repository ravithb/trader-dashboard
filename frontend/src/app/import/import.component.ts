import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  uploadedFile = {data:null,inProgress:false,progress: ""};
  constructor(private uploadService: UploadService) { }

  ngOnInit() {
  }

  uploadFile() {
    if(!this.uploadedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('tfile', this.uploadedFile.data);
    this.uploadedFile.inProgress = true;
    this.uploadService.uploadTradingFile(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadedFile.progress = (Math.round(event.loaded * 100 / event.total) + "%");
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.uploadedFile.inProgress = false;
        return of(`${this.uploadedFile.data.name} upload failed.`);
      })).subscribe((resp: any) => {
        if(!resp) {
          return;
        }
        let body = resp.body;
        if(body && body.data) {
          this.uploadedFile.progress = body.data;
        }else {
          this.uploadedFile.progress = body.error;
        }
      });
  }

  onClickImport() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      if (fileUpload.files.length > 0) {
        const file = fileUpload.files[0];
        this.uploadedFile.data = file;
        this.uploadFile();
      }

    };
    fileUpload.click();
  }

}
