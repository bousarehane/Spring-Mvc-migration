/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';

import {
   SelectItem, Column, DataTable
} from 'primeng/primeng';
import { NotifMessageService } from '../core/services/notifmessage.service';


@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css'],
})
export class CampaignListComponent implements OnInit, AfterViewInit, AfterViewChecked {


  // campains list to show
  @Input() campaigns: Campaign[];

  @Output() campaignsTemp: Campaign[];
  @Input() campaignsToBeSorted: Campaign[];
  // selected campaign
  selectedCampaign: Campaign;
  // object used to recieve campaign to delete or to update
  campaign: Campaign;
  // error message in case of error
  errorMessage: string;

  // to inform parent component by performing update action
  @Output() toUpdate: EventEmitter<Campaign> = new EventEmitter();

  // to inform parent component by performing Detail action
  @Output() toDetail: EventEmitter<Campaign> = new EventEmitter();

  // to inform parent component by performing  action after Deleting Campaign
  @Output() haveBeenDeleted: EventEmitter<string> = new EventEmitter();

  // to inform parent component by performing  action after pagination butons
  @Output() loadTable: EventEmitter<any> = new EventEmitter();

  @Output() startPage: EventEmitter<any> = new EventEmitter();

  @Output() endPage: EventEmitter<any> = new EventEmitter();

  // result records count
  @Input() totalRecords: number;
  // dataTable selected page of
  @Input() currentPage: number;
  // dataTable page size
  @Input() pageSize: number;

  @Input()  start: number;
  @Input()  end:number;


  @ViewChild(('campaignDataTable')) campaignDataTable: DataTable;

  msgs:Message[] = [];
  numberRecords:SelectItem[];

  @Output() selectedCountSubmit: EventEmitter<any> = new EventEmitter();

  selectedCount: any;


  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private translateService: TranslateService,
    private notifService: NotifMessageService,
    private log: NGXLogger) {
    this.campaigns = []
    this.campaignsToBeSorted = []

  }
  private datePattern: string;
  private datePatternFull: string;
  btnUpdateCmp: boolean = false;

  sortedColumn: any;
  sortAsc: boolean = false;

  sortValue: boolean = false;

  ngOnInit() {
    this.translateService.get('DATE_FILTER_FORMAT').subscribe(
      pattern => this.datePattern = pattern
    );
    this.translateService.get('DATE_FILTER_FORMAT_FULL').subscribe(
      pattern => this.datePatternFull = pattern
    );

    this.numberRecords = []; 
    this.numberRecords.push({ label: '10', value: '10' });
    this.numberRecords.push({ label: '20', value: '20' });
    this.numberRecords.push({ label: '50', value: '50' }); 

    this.selectedCount = this.numberRecords[0].value;
    this.doSelectNumberPages();
  }
 
  ngAfterViewInit(): void {
   
  }

  public ngAfterViewChecked(): void {
    
    /*if(this.sortValue){
      var elements= document.getElementsByClassName("fa-sort");
      for(var i = 0, length = elements.length; i < length; i++) {
       
           if(elements[i].classList.contains("fa-sort-asc")){
              elements[i].className += " kkkkkkkkkkkk";
              //break;
           }
           
           if(elements[i].classList.contains("fa-sort-desc")){
            elements[i].classList.remove("fa-sort-desc");
            elements[i].className += " fa-sort-desc";
            break;
           }
         }
      }
      this.sortValue = false;*/
}   
  
  getStatusLabel(c: Campaign) {
    if (!(c && c.status)) {
      return '';
    } else {
      return this.translateService.instant("CAMPAIGN_STATUS_" + c.status);
    }
  }

  doLoadTablePagination(event) {
    this.doSelectNumberPages();
    this.sortValue = true;
    this.campaignsTemp = this.sortByFiealds(event , this.start , this.end);
    this.currentPage = event;
    this.loadTable.emit({ event:event, ui:this.campaignsTemp });
    
  }

  doSelectSize(event){
    
    if(Math.trunc(this.start % this.selectedCount) !=0)
      this.currentPage = Math.trunc(this.start/this.selectedCount) + 1; 
    else
      this.currentPage = Math.trunc(this.start/this.selectedCount);
    
    
    this.doSelectNumberPages();
    this.campaignsTemp = this.sortByFiealds(event , this.start , this.end);
    this.selectedCountSubmit.emit({ event:event, ui:this.campaignsTemp , start:this.start });
    
  }

  onSelect(campaing: Campaign) {
    this.selectedCampaign = campaing;
  }

  doSelectNumberPages(){
    this.start = (this.currentPage - 1) * this.selectedCount + 1;
    if (this.start == 0) this.start= 1;

    this.end = (this.start) + (this.selectedCount - 1);
    
    if (this.end < this.selectedCount)   // happens when records less than per page  
    this.end = this.selectedCount;  
    else if (this.end > this.totalRecords)  // happens when result end is greater than total records  
      this.end = this.totalRecords;
  }

  isDeleteAllowed(campaignStatus): boolean {
    return campaignStatus === 'IN_PREPARATION' || campaignStatus == null;
  }
  goDeleteCampaign(campaign: Campaign) {
    const id = campaign.id;
    this.campaignService.deleteCampaign(id).subscribe(
      success => {
        this.notifService.notifySuccess('CAMPAIGN_DELETE_SUCCESS');
        // informer le composant parent de cette suppression
        this.haveBeenDeleted.emit(id);
      },
      error => {
        this.notifService.notifyErrorWithDetailFromApi('ERROR_DELETING_CAMPAIGN', error);
        this.log.error(error); 
      }
    )
  }

  goUpdateCampaign(campaign: Campaign) {
    this.initCampaign();

    Object.assign(this.campaign, campaign); // copie de la campaign passée en paramètre
    this.toUpdate.emit(this.campaign);

  }

  goDetailCampaign(campaign: Campaign) {
    this.initCampaign();
    Object.assign(this.campaign, campaign); // copie de la campaign passée en paramètre
    // this.router.navigate(['/campaignDetail']);
    this.toDetail.emit(this.campaign);

  }

  private initCampaign() {
    this.campaign = <Campaign>{};
  }
 
  onRowSelect(event) {
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Selected', 
    detail:event.data.name + ' - ' + event.data.language});

    this.campaignService.referenceCampaign = event.data.campaignRef;
    this.campaignService.mode="1";
    this.router.navigate(['/detailCampaign']);
    
}

sortByFiealds(event , startFromPagination , endFromPagination ) {
  var start;
  var end;
  var field=event.field;
  if(startFromPagination == undefined || startFromPagination == null){
     start = 0;
     // for last page with pagination 
     if(this.campaigns.length<this.selectedCount){
       end =this.selectedCount;
       this.end=this.selectedCount;
       this.start=1;
     }else{
      end = this.campaigns.length;
     }
     this.getFields(event , field);
     this.sortValue = false;
  }else{
    start =startFromPagination -1;
    end =endFromPagination;
  }

 this.campaigns = this.campaignsToBeSorted.slice(start, end);
 
 return  this.campaigns ;
}

getFields(event , field){
  this.currentPage=1;
  let comparer = function (a, b): number {
    let aName;
    let bName ;
    if(field == "name"){
       aName = a.name.toLowerCase();
       bName = b.name.toLowerCase();
    }else if(field == "reference"){
      aName = a.reference;
      bName = b.reference;
    }
    let result: number = -1;
    

    if (aName > bName) result = 1;
    return result * event.order;
  };
  
  this.campaignsToBeSorted.sort(comparer);
}
}
