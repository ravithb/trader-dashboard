import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-weekly-pnl',
  templateUrl: './weekly-pnl.component.html',
  styleUrls: ['./weekly-pnl.component.scss']
})
export class WeeklyPnlComponent implements OnInit {

  pnl = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getPnlThisWeek();
  }

  getPnlThisWeek() {
    this.apiService.getPnlThisWeek().subscribe((p)=>{
      this.pnl = p;
    })
  }

  get isNegative() {
    return this.pnl < 0;
  }
}
