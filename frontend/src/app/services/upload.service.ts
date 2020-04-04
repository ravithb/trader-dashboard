import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) { }

  public uploadTradingFile(formData) {

    return this.httpClient.post<any>(environment.apiUrl + "uploadTradingFile", formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
