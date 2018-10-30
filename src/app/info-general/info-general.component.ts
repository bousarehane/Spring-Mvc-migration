import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter,ElementRef, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import {Renderer} from '@angular/core';
import {MenuItem} from 'primeng/api';
import { MediaBean } from '../core/models/MediaBean';
import { CampaignTreeNode } from '../core/models/CampaignTreeNode';
import { CampaignTree } from '../core/models/CampaignTree';

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
  selector: 'app-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.css']
})
export class InfoGeneralComponent implements OnInit {
  
  items:MenuItem[];
  activeItem: MenuItem;
  @ViewChild('menuItems') menu: MenuItem[];
  campaign: Campaign;
  nodes:CampaignTreeNode[];
  mediaBean: MediaBean;
  campReferance: any;
  confirmationMessage: any;
  nodeIcon : any ;
  nextPage : string;
  url : any;
    constructor(private render:Renderer , private router: Router , private translateService: TranslateService ,   private campaignService: CampaignService) { }
  
    ngOnInit() {
     this.campaign= this.campaignService.campaignSharedData;
     this.nodes= this.campaignService.nodes;

      this.items = [
        {label: this.translateService.instant('campaignTabBar.tab_0.label'), icon: 'fa-bar-chart'},
        {label: this.translateService.instant('campaignTabBar.tab_1.label'), icon: 'fa-bar-chart'},
        {label: this.translateService.instant('campaignTabBar.historic.label'), icon: 'fa-calendar'}, 
    ];
    this.activeItem = this.items[1];
    }

    activateMenu(){
      this.activeItem =this.menu['activeItem'];
      if(this.activeItem.label === this.translateService.instant('campaignTabBar.tab_0.label')){
        this.campaignService.campaignSharedData = this.campaign;
        //this.campaignService.forwardToPageMessage = "campaignDetails";
        this.router.navigate(['/detailCampaign']); 
      } else if(this.activeItem.label === this.translateService.instant('campaignTabBar.historic.label')){
        this.router.navigate(['/historiqueCmp']); 
      }else if(this.activeItem.label === this.translateService.instant('campaignTabBar.tab_1.label')){
        this.router.navigate(['/infoGeneralCmp']); 
      }
   }
    doClear() {
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
        nextPage = "campaignDetails";
        this.campaignService.forwardToPageMessage = "campaignDetails";
        this.router.navigate(['/detailCampaign']); 
			}
		} else if (this.constractTypeFromValue(type) === CampaignTreeNodeType.MEDIA) {
			if (this.campaignService.mode === guiVasMode.CREATION.toString()) {
        this.getMediaFromReference(reference,parentReference,"mediaDetailsStep0");
				//nextPage = "mediaDetailsStep0";
			} else {
        this.getMediaFromReference(reference,parentReference,"mediaDetails");
        this.campaignService.forwardToPageMessage = "mediaDetails";
				nextPage = "mediaDetails";
			}
		} else if (this.constractTypeFromValue(type) === CampaignTreeNodeType.TERMINAL) {
			if (this.campaignService.mode === guiVasMode.CREATION.toString()) {
				nextPage = "terminalDetails";
			} else {
				nextPage = "terminalDashboard";
			}
		}
    this.nextPage=nextPage;
   
		return this.nextPage; 
	}
 

  getMediaFromReference(reference : string, cmpreference : string , nextPage : string) {
    this.campaignService.getMediaByRef(reference,cmpreference).subscribe(
      response => {
       this.mediaBean = response;
       this.nextPage = nextPage;
       this.campaignService.mediaSharedData = this.mediaBean;
       this.router.navigate(['/detailCampaign']); 
       return this.nextPage;
      },
      err => {
      })
    }
  }