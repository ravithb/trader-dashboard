import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';
import * as moment from 'moment';

@Component({
  selector: 'app-worst-day',
  templateUrl: './worst-day.component.html',
  styleUrls: ['./worst-day.component.scss']
})
export class WorstDayComponent implements OnInit {

  worst_day_val = 0;
  worst_date='';

  constructor(private apiService: ApiService,private uploadService:UploadService) { }

  ngOnInit() {
    this.getPnl();
  }

  getPnl() {
    this.refresh();
    this.uploadService.getImportObservable().subscribe(r=>{
      this.refresh();
    })
  }

  refresh() {
    this.apiService.getWorstDay().subscribe((p)=>{
      this.worst_day_val = p.profit_loss.toFixed(2);
      this.worst_date = moment(p.date).format('YYYY-MMM-DD')
    })
  }

  get isNegative() {
    return this.worst_day_val < 0;
  }

}
