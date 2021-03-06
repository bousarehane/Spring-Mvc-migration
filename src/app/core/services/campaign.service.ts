/*
 * Wod, Worldline Limit Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { DateUtilService } from './date-util.service';

import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {Headers, RequestOptions} from '@angular/http';
import { environment } from '../../../environments/environment.prod';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Campaign } from '../models/campaign';
import { MediaBean } from '../models/MediaBean';
import { CampaignTreeNode } from '../models/CampaignTreeNode';
import { CampaignTree } from '../models/CampaignTree';

import { CampaignSearch } from '../../core/models/campaignSearch';
import { URLSearchParams } from '@angular/http';
import { Http, Response } from '@angular/http';
import { TerminalBean } from '../models/terminalBean';
import { NGXLogger } from "ngx-logger";
import { ListTerminalBean } from '../models/listTerminalBean';



/**
 * service de gestion des campaigns
 */
@Injectable()
export class CampaignService {

 
  constructor(private http: HttpClient, // injection du service http
    private dateUtilService: DateUtilService, // injection du service dateUtilService
    private log: NGXLogger,
  ) {
  }

  _mediaBean: MediaBean;
  mySharedData: any;
  confirmationMessage: any;
  forwardToPageMessage: any;
  campaignSharedData:Campaign;
  mediaSharedData:MediaBean;
  referenceCampaign:string;
  referenceMedia:string;
  mode:string;
  forwardToDetailMedia:string;
  nodes:CampaignTreeNode[];
  filteredHistoricShared:boolean;
  get mediaBean(): MediaBean {
    return this._mediaBean;
}
  getCampaignsByCreateria(criteria: CampaignSearch):
  Observable<any> {
    const url = `${environment.services.campaigns}/campaign`;
    return this.http.put<any>(url, criteria);
}

  createCampaign(campaign: any):Observable<Campaign> {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post<Campaign>(environment.services.campaigns+ '/createCampaign', campaign);
  }

  createMedia(mediaBean: MediaBean , file: File , campaignBean: Campaign ):Observable<MediaBean> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    const formdata: FormData = new FormData();
    
    formdata.append('mediaBean', new Blob([JSON.stringify(mediaBean)],
            {
                type: "application/json"
            }));
    formdata.append('file', file);

    formdata.append('campaignBean', new Blob([JSON.stringify(campaignBean)],
    {
        type: "application/json"
    }));
    return this.http.post<MediaBean>(environment.services.campaigns+ '/createMedia', formdata);
  }

  upload(file: File ):Observable<MediaBean>{
  
    const formdata: FormData = new FormData();
  
    formdata.append('file', file);

    return this.http.post<MediaBean>(environment.services.campaigns+ '/upload', formdata);
  }

  uploadTerminals(file: File , csvListUnassign , datasourceAssign ,  datasourceUnassign):Observable<ListTerminalBean>{
      let headers = new HttpHeaders();
      headers.append('Accept', 'application/json');

      const formdata: FormData = new FormData();
    
      formdata.append('file', file);
      
      formdata.append('csvListUnassign', new Blob([JSON.stringify(csvListUnassign)],
      {
          type: "application/json"
      }));

      formdata.append('datasourceAssign', new Blob([JSON.stringify(datasourceAssign)],
      {
          type: "application/json"
      }));
  
      formdata.append('datasourceUnassign', new Blob([JSON.stringify(datasourceUnassign)],
      {
          type: "application/json"
      }));
      return this.http.post<ListTerminalBean>(environment.services.campaigns+ '/uploadTerminals', formdata);
    }
  
  createList(campaigns: Array<Campaign>) {
    return this.http.post<any>(environment.services.campaigns + '/createCampaigns/', campaigns); 
  }

  updateCampaign(campaign: Campaign):Observable<Campaign> {
    // return this.http.put<any>(`${environment.services.campaigns}/${campaignId}`, campaign);
    return this.http.post<Campaign>(environment.services.campaigns + '/updateCampaign/', campaign); 
  }

  deleteCampaign(campaignId: string) {
    return this.http.delete<any>(`${environment.services.campaigns}/${campaignId}`);
  }

  getCampaignsByCriteriaPagination(criteria: CampaignSearch, page: number, size: number):
  Observable<any> {
  const url = `${environment.services.campaigns}/campaignByCriteria/?page=${page}&size=${size}`;
  return this.http.put<any>(url, criteria);
}

getCampaignType(): Observable<string[]> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<string[]>(environment.services.campaigns + '/campaignType', {headers});
}

getCampaignLevel(): Observable<any[]> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<any[]>(environment.services.campaigns + '/campaignLevel', {headers});
}

getAdvertisingCategory(): Observable<any[]> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<any[]>(environment.services.campaigns + '/advertisingCategory', {headers});
}

changeTypeEvent(campaign: Campaign):Observable<Campaign>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  //return this.http.put<Campaign>(environment.services.campaigns + '/changeType', campaign); 

  const url = `${environment.services.campaigns}/changeType/?type=${campaign.type}`;
  return this.http.get<Campaign>(url, {headers});
}

changeLevelEvent(campaign: Campaign):Observable<Campaign>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  const url = `${environment.services.campaigns}/changeLevel/?level=${campaign.level}`;
  return this.http.get<Campaign>(url, {headers});
  //return this.http.put<Campaign>(environment.services.campaigns + '/changeLevel', campaign , {headers: headers});
}

goToYesMerchantPopup():Observable<Campaign>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  const url = `${environment.services.campaigns}/merchantExist`;
  return this.http.get<Campaign>(url, {headers});
}

goToNoMerchantPopup():Observable<Campaign>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  
  return this.http.post<Campaign>(environment.services.campaigns + '/merchantNotExist', headers); 
}


getCmpaignByRef(reference: any):Observable<Campaign>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  
  return this.http.get<Campaign>(environment.services.campaigns + '/detailCampaign/'+ reference, {headers}); 

}

getCmpaignByRefMedia(reference: any):Observable<Campaign>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  
  return this.http.get<Campaign>(environment.services.campaigns + '/detailCampaignMedia/'+ reference, {headers}); 

}

getMediaByRef(reference: any , campaignReference: any):Observable<MediaBean>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<MediaBean>(environment.services.campaigns + '/detailMedia/'+reference+'/'+campaignReference,  {headers}); 

}

searchWithReference(reference: any , campaignReference: any) {
  this._mediaBean = null;
  this.getMediaByRef(reference,campaignReference).subscribe( 
    response => {
     this._mediaBean = response;
    },)

   
}


genParams(params: object, httpParams = new HttpParams()): object {
  Object.keys(params)
      .filter(key => {
          let v = params[key];
          return (Array.isArray(v) || typeof v === 'string') ? 
              (v.length > 0) : 
              (v !== null && v !== undefined);
      })
      .forEach(key => {
          httpParams = httpParams.set(key, params[key]);
      });
  return { params: httpParams };
}


getImage(reference: string): Observable<any> {
  return this.http.get(environment.services.campaigns + '/image', { responseType: 'blob' });
}

//List of Terminals 
listTerminals(campaign: Campaign): Observable<any[]> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  const url = `${environment.services.campaigns}/terminalsByReference/?reference=${campaign.reference}`;
  return this.http.get<any[]>(url, {headers});
}

 suspendCampaign(deactivationReason :string , campaignBeanPrime: Campaign):Observable<any>{
  campaignBeanPrime.deactivationReason = deactivationReason;
  return this.http.post<any>(environment.services.campaigns+ '/suspendCampaign', campaignBeanPrime);
}

closeCampaign(deactivationReason :string , campaignBeanPrime: Campaign):Observable<any>{
  campaignBeanPrime.deactivationReason = deactivationReason;
  return this.http.post<any>(environment.services.campaigns+ '/closeCampaign', campaignBeanPrime);
}

activeCampaign(campaignBeanPrime: Campaign):Observable<any>{
  return this.http.post<any>(environment.services.campaigns+ '/activeCampaign', campaignBeanPrime);
}

listHistoric(reference: any, startDate: any, endDate: any): Observable<any> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  const url = `${environment.services.campaigns}/searchHistoric`;
  return this.http.post<any>(url, {reference : reference ,startDate : startDate , endDate : endDate } ,{headers});
}

listHistoricMedia(reference: any, referenceMedia: any, startDate: any, endDate: any): Observable<any> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  const url = `${environment.services.campaigns}/searchHistoricMedia`;
  return this.http.post<any>(url, {reference : reference , referenceMedia : referenceMedia ,startDate : startDate , endDate : endDate } ,{headers});
}

suspendMedia(deactivationReason :string , mediaBeanPrime: MediaBean):Observable<any>{
  mediaBeanPrime.deactivationReason = deactivationReason;
  return this.http.post<any>(environment.services.campaigns+ '/suspendMedia', mediaBeanPrime);
}

closeMedia(deactivationReason :string , mediaBeanPrime: MediaBean):Observable<any>{
  mediaBeanPrime.deactivationReason = deactivationReason;
  return this.http.post<any>(environment.services.campaigns+ '/closeMedia', mediaBeanPrime);
}

activeMedia(mediaBeanPrime: MediaBean):Observable<any>{
  return this.http.post<any>(environment.services.campaigns+ '/activeMedia', mediaBeanPrime);
}


listAssignTerminals(campaign: Campaign): Observable<ListTerminalBean> {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<ListTerminalBean>(environment.services.campaigns + '/assignTerminal/'+campaign.reference,  {headers}); 
  
}


goToYesPopup():Observable<ListTerminalBean>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  const url = `${environment.services.campaigns}/formToYes`;
  return this.http.get<ListTerminalBean>(url, {headers});
}

goToNoPopup():Observable<any>{
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  
  return this.http.get<any>(environment.services.campaigns + '/formToNo', {headers}); 
}

saveAssignTerminals(campaignPrime: Campaign , datasourceAssign: TerminalBean[] , datasourceAvailable: TerminalBean[]): Observable<any> {
  
  campaignPrime.assignedTerminals = datasourceAssign
  campaignPrime.availableTerminals = datasourceAvailable;

  return this.http.post<any>(environment.services.campaigns+ '/assignTerminal/save', campaignPrime);
}
}

