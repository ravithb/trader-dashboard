import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-code-pnl',
  templateUrl: './code-pnl.component.html',
  styleUrls: ['./code-pnl.component.scss']
})
export class CodePnlComponent implements OnInit,AfterViewInit {
  chartData = [{
    data:[],
    label:"Profit/Loss",
    backgroundColor: []
  }];
  chartLabels = [];
  chartOpts = {
    scaleShowVerticalLines:false,
    responsive:true
  };
  chartLegend = false;
  chartColors = [];
  data = [];

  constructor(private apiService:ApiService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.populateChartData().subscribe(r=>{
      this.data = r;
      this.chartData[0].data = [];
      this.chartColors = [];
      this.chartData[0].backgroundColor = [];
      for(let i in r) {
        let row = r[i];
        this.chartLabels.push(row.code);
        this.chartData[0].data.push(row.pnl);
        let color = row.pnl>0?'#4ABDA6':'#FFA1B5'
        this.chartColors.push(color);
        this.chartData[0].backgroundColor.push(color);
      }
      console.log(this.chartColors);
    })
  }

  populateChartData() {
    return this.apiService.getPnlsByCode()
  }

}
