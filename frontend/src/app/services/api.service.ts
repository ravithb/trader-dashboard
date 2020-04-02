import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getPnl() {
    return ajax.getJSON(environment.apiUrl + "/getOverallPnl")
      .pipe(
        map((resp: any) => resp.data),
        catchError(e => {
          console.log(e);
          return of(e);
        }));
  }

  getPnlThisWeek() {
    return ajax.getJSON(environment.apiUrl + "/getPnlThisWeek")
      .pipe(
        map((resp: any) => resp.data),
        catchError(e => {
          console.log(e);
          return of(e);
        }));
  }

  getPnlToday() {
    let dateStr = moment().format("YYYYMMDD");
    return ajax.getJSON(environment.apiUrl + "/getPnlByDate/"+dateStr)
      .pipe(
        map((resp: any) => resp.data),
        catchError(e => {
          console.log(e);
          return of(e);
        }));
  }

  getPortfolio() {
    return ajax.getJSON(environment.apiUrl + "/getPortfolio")
      .pipe(
        map((resp: any) => resp.data),
        catchError(e => {
          console.log(e);
          return of(e);
        }));
  }

  getPnlsByCode() {
    return ajax.getJSON(environment.apiUrl + "/getPnlsByCode")
      .pipe(
        map((resp: any) => resp.data),
        catchError(e => {
          console.log(e);
          return of(e);
        }));
  }

  getDailyPnls(start,end) {
    let startStdStr = moment(start).format("YYYYMMDD");
    let endStdStr = moment(end).format("YYYYMMDD");
    return ajax.getJSON(environment.apiUrl + "/getDailyPnls/"+startStdStr+"/"+endStdStr)
      .pipe(
        map((resp: any) => resp.data),
        catchError(e => {
          console.log(e);
          return of(e);
        }));
  }
}
