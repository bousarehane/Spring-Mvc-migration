import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { CampaignService } from '../core/services/campaign.service';
import { Campaign } from '../core/models/campaign';
import { MediaBean } from '../core/models/MediaBean';
import { CampaignTreeNode } from '../core/models/CampaignTreeNode';
import { CampaignTree } from '../core/models/CampaignTree';
import { CampaignSearch } from '../core/models/campaignSearch';
import { NGXLogger } from 'ngx-logger';
import { SelectItem } from 'primeng/primeng';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms/forms';
import { DateUtilService } from '../core/services/date-util.service';

import { StringUtilService } from '../core/services/string-util.service';
import { Parameter, ParameterType } from '../core/models/targeting/parameter';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DetailCompComponent } from '../detail-comp/detail-comp.component';
import { DetailMediaComponent } from '../detail-media/detail-media.component';
import { environment } from '../../environments/environment.prod';
import { DetailMediaStep0Component } from '../detail-media-step0/detail-media-step0.component';
import { TerminalBean } from '../core/models/terminalBean';

enum CampaignTreeNodeType { 
  CAMPAIGN,
  MEDIA,
  PADDING,
  TERMINAL
}
enum guiVasMode { 
  CREATION,
  CREATION_MEDIA,
  DASHBOARD,
  DEFAULT,
  INFO
  }


@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit , AfterViewInit{
  campaign: Campaign;
  mediaBean: MediaBean;
  terminals: SelectItem[];
  terminalsListElements: Array<any>;

  campReferance: any;
  confirmationMessage: any;
  nodeIcon : any ;
  nextPage : string;
  url : any;

  nodes: CampaignTreeNode[];

  itemCampaign: CampaignTreeNode;
  filteredHistoric:boolean= false;
  constructor(
    private campaignService: CampaignService,
    private log: NGXLogger,
    private translate: TranslateService,
    private modalService: NgbModal,
    private dateUtilService: DateUtilService,private route: ActivatedRoute, private router: Router,
  ) {
    this.campaign = <Campaign>{};
  }

  ngOnInit() {
    this.terminalsListElements;
    this.nextPage =this.campaignService.forwardToPageMessage;
    this.url = `${environment.services.campaigns}`;
    this.campaign = this.campaignService.mySharedData;
    if(this.campaign){
      this.campReferance = this.campaign.reference;
    }
    if(this.campaignService.referenceCampaign && !this.campReferance){
      this.campReferance = this.campaignService.referenceCampaign;
    }
   // this.campReferance = this.route.snapshot.params['reference'];
    if(this.campaignService.campaignSharedData && this.campaignService.mediaSharedData && this.campaignService.mode != "1"){
      this.mediaBean = this.campaignService.mediaSharedData;
      this.campReferance = this.campaignService.campaignSharedData.reference;
      this.campaign = this.campaignService.campaignSharedData;
      this.nodes = this.campaignService.nodes;
    }else if((this.campaignService.campaignSharedData || this.campaignService.mediaSharedData ) && this.campaignService.mode === "1"){
      this.campReferance = this.campaignService.campaignSharedData.reference;
      this.mediaBean = this.campaignService.mediaSharedData;
      this.campaign = this.campaignService.campaignSharedData;
      this.nodes = this.campaignService.nodes;
      if(!this.nextPage){
       this.nextPage = "campaignDetails";
      }
      
      
    }else {
     this.campaignService.getCmpaignByRef(this.campReferance).subscribe(
        response => {
         this.campaign = response;
         this.nodes= this.campaign.campaignTree.nodes;
         if(this.campaignService.referenceCampaign){
         this.campaignService.campaignSharedData = this.campaign;
         this.campaignService.nodes = this.nodes;
         if(!this.nextPage){
         this.nextPage = "campaignDetails";
         }
         }
        },
        err => {
          this.log.error(err);
        })
    
      }
  }

  ngAfterViewInit() {
    
  }
  constractTypeFromValue(type : string){
    if("CAMPAIGN" === type){
      return 0;
    }else if("MEDIA" === type){
      return 1;
    }else if("PADDING" === type){
      return 2;
    }else if("TERMINAL" === type){
      return 3;
    }

  }
  getActionFromNodeLink(type : string, parentReference : string, reference : string) {
    var nextPage = "";
		if (this.constractTypeFromValue(type) === CampaignTreeNodeType.PADDING) {
			nextPage = "SearchCampaign";
		} else if (this.constractTypeFromValue(type) === CampaignTreeNodeType.CAMPAIGN) {
			if (this.campaignService.mode === guiVasMode.CREATION.toString()) {
				nextPage = "campaignDetailsStep0";
			} else {
        this.filteredHistoric= false;
        nextPage = "campaignDetails";
			}
		} else if (this.constractTypeFromValue(type) === CampaignTreeNodeType.MEDIA) {
			if (this.campaignService.mode === guiVasMode.CREATION.toString()) {
        this.getMediaFromReference(reference,this.campReferance,"mediaDetailsStep0");
				//nextPage = "mediaDetailsStep0";
			} else {
        this.filteredHistoric= true;
        this.getMediaFromReference(reference,this.campReferance,"mediaDetails"); 
				//nextPage = "mediaDetails"; 
			}
		} else if (this.constractTypeFromValue(type) === CampaignTreeNodeType.TERMINAL) { 
			if (this.campaignService.mode === guiVasMode.CREATION.toString()) {
				nextPage = "terminalDetails";
			} else {
        this._getTerminals("terminalDashboard");
        //nextPage = "terminalDashboard";
			}
		}
    this.campaignService.filteredHistoricShared =   this.filteredHistoric;
    this.nextPage=nextPage;
		return this.nextPage; 
	}

  changeMargin(): any {
    return { 'margin-left': (4 + this.itemCampaign.level * 15) };
}

getMediaFromReference(reference : string, cmpreference : string , nextPage : string) {
  this.campaignService.getMediaByRef(reference,cmpreference).subscribe(
    response => {
     this.mediaBean = response;
     this.nextPage = nextPage;
     return this.nextPage;
    },
    err => {
      this.log.error(err);
    })
  }


_getTerminals(nextPage: string) {   
  this.campaignService.listTerminals(this.campaign).subscribe( 
    response => {
      this.terminalsListElements = response;
      this.nextPage = nextPage;
      return this.nextPage;
    }, 
    err => {
      this.log.error(err);
    })
}
      
}


