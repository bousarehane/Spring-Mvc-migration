import { DateUtilService } from './date-util.service';

import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {Headers, RequestOptions} from '@angular/http';
import { environment } from '../../../environments/environment.prod';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Campaign } from '../models/campaign';
import { MediaBean } from '../models/MediaBean';

import { CampaignTree } from '../models/CampaignTree';

import { CampaignSearch } from '../../core/models/campaignSearch';
import { URLSearchParams } from '@angular/http';
import { Http, Response } from '@angular/http';
@Injectable()
export class LogService {

  constructor(private http: Http) {
  }

  public logError(error: any): void {
    //if (environment.log.apiUrl != null) {
     // this.sendToServer(error);
    //}
  }


  // send the error to the server-side error tracking end-point.
  private sendToServer(error: any): void {
    /*this.http.post(
      environment.log.apiUrl + '/error', {
        type: error.name,
        message: error.message,
        stack: error.stack,
        location: window.location.href
      }).subscribe();*/
  }


  uploadAppelOffre(input : FormData):  Observable<number>{
    
      const headers = new Headers();
      const cpHeaders = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: cpHeaders });
      return this.http.post(environment.services.campaigns+ '/createMedia', input)
      .map(this.extractData)
      .catch(error => Observable.throw(error))
    }

    protected extractData(res: Response) {
      let body = res.json();
      return body.data || { };
    }

}
