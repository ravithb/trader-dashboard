import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.scss']
})
export class PnlComponent implements OnInit {

  pnl = 0;

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
    this.apiService.getPnl().subscribe((p)=>{
      this.pnl = p.toFixed(2);
    })
  }

  get isNegative() {
    return this.pnl < 0;
  }

}
