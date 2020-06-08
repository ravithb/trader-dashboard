import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-week-pnl-detail',
  templateUrl: './week-pnl-detail.component.html',
  styleUrls: ['./week-pnl-detail.component.scss']
})
export class WeekPnlDetailComponent implements OnInit {

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

  constructor(private apiService:ApiService, private uploadService:UploadService) { }

  ngOnInit() {
    this.uploadService.getImportObservable().subscribe(r=>{
      this.refresh();
    })
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.populateChartData().subscribe(r=>{
      this.data = r;
      this.chartData[0].data = [];
      this.chartColors = [];
      this.chartLabels = [];
      this.chartData[0].backgroundColor = [];
      for(let i in r) {
        let row = r[i];
        this.chartLabels.push(moment(row.date).format("YYYY-MM-DD"));
        this.chartData[0].data.push(row.pnl);
        let color = row.pnl>0?'#4ABDA6':'#FFA1B5'
        this.chartColors.push(color);
        this.chartData[0].backgroundColor.push(color);
      }
    })
  }

  populateChartData() {
    let start = moment().startOf('week');
    let end = moment().endOf('week');
    return this.apiService.getDailyPnls(start,end);
  }

  formatDate(d) {
    return moment(d).format("YYYY-MM-DD")
  }

}
