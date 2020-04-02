import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  portfolio = [];
  constructor(private apiService:ApiService) { }

  ngOnInit() {
    this.getPortfolio().subscribe(r=>{
      this.portfolio = r;
    });
  }

  getPortfolio() {
    return this.apiService.getPortfolio();
  }

}
