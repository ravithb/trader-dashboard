import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  portfolio = [];
  constructor(private apiService:ApiService, private uploadService:UploadService) { }

  ngOnInit() {
    this.refresh();

    this.uploadService.getImportObservable().subscribe(r=>{
      this.refresh();
    })
  }

  refresh() {
    this.getPortfolio().subscribe(r=>{
      this.portfolio = r;
    });
  }

  getPortfolio() {
    return this.apiService.getPortfolio();
  }

}
