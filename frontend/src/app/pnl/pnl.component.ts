import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.scss']
})
export class PnlComponent implements OnInit {

  pnl = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getPnl();
  }

  getPnl() {
    this.apiService.getPnl().subscribe((p)=>{
      this.pnl = p;
    })
  }

  get isNegative() {
    return this.pnl < 0;
  }

}
