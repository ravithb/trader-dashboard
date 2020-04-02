import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PnlComponent } from './pnl/pnl.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WeeklyPnlComponent } from './weekly-pnl/weekly-pnl.component';
import { CodePnlComponent } from './code-pnl/code-pnl.component';
import { ApiService } from './services/api.service';
import { ChartsModule } from 'ng2-charts';
import { TodayPnlComponent } from './today-pnl/today-pnl.component';
import { WeekPnlDetailComponent } from './week-pnl-detail/week-pnl-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PnlComponent,
    PortfolioComponent,
    WeeklyPnlComponent,
    CodePnlComponent,
    TodayPnlComponent,
    WeekPnlDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
