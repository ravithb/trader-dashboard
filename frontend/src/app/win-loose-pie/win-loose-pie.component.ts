import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-win-loose-pie',
  templateUrl: './win-loose-pie.component.html',
  styleUrls: ['./win-loose-pie.component.scss']
})
export class WinLoosePieComponent implements OnInit {

  chartData = [];
  chartLabels = [];
  chartOpts = {
    scaleShowVerticalLines:false,
    responsive:true
  };
  chartLegend = false;
  chartColors = [{
    backgroundColor: [ 'rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)', 'rgba(0,0,255,0.3)'],
  }];
  data = [];

  constructor(private apiService:ApiService,private uploadService:UploadService) { }

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
      this.chartData = [r.winners,r.losers,r.break_evens];
      this.chartLabels = [["Winners",((r.winners/r.all_trades)*100).toFixed(2)+"%"],["Losers",((r.losers/r.all_trades)*100).toFixed(2)+"%"],["Break Even",((r.break_evens/r.all_trades)*100).toFixed(2)+"%"]];
    })
  }

  populateChartData() {
    return this.apiService.getWinLooseCounts()
  }

}
