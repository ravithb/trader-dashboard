import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-today-pnl',
  templateUrl: './today-pnl.component.html',
  styleUrls: ['./today-pnl.component.scss']
})
export class TodayPnlComponent implements OnInit {

  pnl = 0;

  constructor(private apiService: ApiService, private uploadService:UploadService) { }

  ngOnInit() {
    this.getPnlThisWeek();
    this.uploadService.getImportObservable().subscribe(r=>{
      this.getPnlThisWeek();
    })
  }

  getPnlThisWeek() {
    this.apiService.getPnlToday().subscribe((p)=>{
      if(p){
      this.pnl = p.toFixed(2);
      }else{
        this.pnl = 0;
      }
    })
  }

  get isNegative() {
    return this.pnl < 0;
  }
}
