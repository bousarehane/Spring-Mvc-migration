/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { NGXLogger } from 'ngx-logger';

import { CampaignComponent } from '../campaign/campaign.component';
import { CampaignListComponent } from '../campaign-list/campaign-list.component';
import { CampaignSearch } from '../core/models/campaignSearch';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Component, OnInit, Output, Input, EventEmitter , ViewChild,AfterViewChecked} from '@angular/core';
import {
  SelectItem, Column, DataTable, Paginator, LazyLoadEvent, FilterMetadata
} from 'primeng/primeng';
import { CampaignSearchService } from '../core/services/campaign-search.service';



/**
 * affichage de la recherche campagne , critères et résultats
 */
@Component({
  selector: 'app-campaign-search',
  templateUrl: './campaign-search.component.html',
  styleUrls: ['./campaign-search.component.css'],
})
export class CampaignSearchComponent  {

  // to inform parent component by performing update action
  @Output() toUpdate: EventEmitter<Campaign> = new EventEmitter();
  // to inform parent component by performing detail action
  @Output() toDetail: EventEmitter<Campaign> = new EventEmitter();

  // to inform parent component by performing action after Delete action
  // 1) update tab and refresh list
  @Output() haveBeenDeleted: EventEmitter<string> = new EventEmitter();


  @ViewChild(CampaignListComponent)
  private campaignListComponent: CampaignListComponent;
  

  constructor(
    private campaignService: CampaignService,
    private log: NGXLogger,
    private searchService: CampaignSearchService
  ) {
  }    

  get searchModel(): CampaignSearch {
    return this.searchService.searchModel;
  }
  set searchModel(cs: CampaignSearch) {
    this.searchService.searchModel = cs;
  }
  get campaigns(): Campaign[] {
    return this.searchService.campaigns;
  }

  set campaigns(index: Campaign[]) {
    this.searchService._campaigns = index;
  }

  get campaignsToBeSorted(): Campaign[] {
    return this.searchService.campaignsToBeSorted;
  }
  get currentPage(): number {
    console.log(this.searchService.currentPage);
    return this.searchService.currentPage;
  }
  set currentPage(index: number) {
    this.searchService.currentPage = index;
  }
  get totalRecords(): number {
    return this.searchService.totalRecords;
  }
  get pageSize(): number {
    return this.searchService.pageSize;
  }
  set pageSize(index: number) {
    this.searchService.pageSize = index;
  }

  ngOnInit() {
  }

  doLoadTablePagination(event) {
    this.currentPage = event.event;
    this.searchService.searchWithPaginationPrime(event.ui);

  }

  doSelectSize(event) {

    if(Math.trunc(event.start % event.event.value) !=0)
    this.currentPage = Math.trunc(event.start/event.event.value) + 1; 
  else
    this.currentPage = Math.trunc(event.start/event.event.value);
   
    this.pageSize = event.event.value;
    this.searchService.searchWithPaginationPrime(event.ui);
  }


  goUpdate(c: Campaign) {
    this.toUpdate.emit(c);
  }

  goDetail(c: Campaign) {
    this.toDetail.emit(c);
  }

  doHaveBeenDeleted(cId: string) {
    this.haveBeenDeleted.emit(cId);
  }

  doFind(cs: CampaignSearch) {
    this.searchService.launchSearch();
  }

  doClear() {
    this.searchService.clearSearch();
  }

  
}
