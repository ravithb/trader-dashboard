import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private importSubject: Subject<any> = new Subject<any>();
  private importObservable: Observable<any> = this.importSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  public uploadTradingFile(formData) {

    return this.httpClient.post<any>(environment.apiUrl + "/uploadTradingFile", formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public notifyUpload() {
    this.importSubject.next(true);
  }

  public getImportObservable() {
    return this.importObservable;
  }
}
