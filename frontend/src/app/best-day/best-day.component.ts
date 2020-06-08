import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';
import * as moment from 'moment';

@Component({
  selector: 'app-best-day',
  templateUrl: './best-day.component.html',
  styleUrls: ['./best-day.component.scss']
})
export class BestDayComponent implements OnInit {

  best_day_val = 0;
  best_date='';

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
    this.apiService.getBestDay().subscribe((p)=>{
      this.best_day_val = p.profit_loss.toFixed(2);
      this.best_date = moment(p.date).format('YYYY-MMM-DD')
    })
  }

  get isNegative() {
    return this.best_day_val < 0;
  }

}
