import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-weekly-pnl',
  templateUrl: './weekly-pnl.component.html',
  styleUrls: ['./weekly-pnl.component.scss']
})
export class WeeklyPnlComponent implements OnInit {

  pnl = 0;

  constructor(private apiService: ApiService, private uploadService: UploadService) { }

  ngOnInit() {
    this.getPnlThisWeek();
    this.uploadService.getImportObservable().subscribe(r=>{
      this.getPnlThisWeek();
    })
  }

  getPnlThisWeek() {
    this.apiService.getPnlThisWeek().subscribe((p)=>{
      this.pnl = p.toFixed(2);
    })
  }

  get isNegative() {
    return this.pnl < 0;
  }
}
