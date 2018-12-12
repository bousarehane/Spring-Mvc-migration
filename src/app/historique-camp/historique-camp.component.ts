import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, ElementRef, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule, SelectItem } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import { Renderer } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CampaignTreeNode } from '../core/models/campaignTreeNode';
import { NgForm } from '@angular/forms';
import { MediaBean } from '../core/models/MediaBean';


enum CampaignTreeNodeType { 
  CAMPAIGN,
  MEDIA,
  PADDING,
  TERMINAL
}

@Component({
  selector: 'app-historique-camp',
  templateUrl: './historique-camp.component.html',
  styleUrls: ['./historique-camp.component.css']
})
export class HistoriqueCampComponent implements OnInit {

  // @Input() filtre: string;

  cities: number[];
   campaign: Campaign;
  mediaBean: MediaBean;
  // @ViewChild('startDate2') startDate: ElementRef;
  // @ViewChild('endDate2') endDate: ElementRef;
  @ViewChild('reference') reference: ElementRef;
  @ViewChild('referenceMedia') referenceMedia: ElementRef;
  startDate : Date;
  endDate: Date;


  items: MenuItem[];
  activeItem: MenuItem;
  nodes:CampaignTreeNode[];
  @ViewChild('menuItems') menu: MenuItem[];
  listHistoric: Array<any>;
  listHistoricMedia: Array<any>;
  nextPage : string;
   filteredHistoric: boolean=false; 
  _filteredHistoric: boolean=false;
  referenceHistoricMedia: string; 
  constructor(private router: Router, 
              private translateService: TranslateService, 
              private campaignService: CampaignService,
              private log: NGXLogger,

  ) { 
    this.campaign = <Campaign>{};
  }

  private datePattern: string;
  private datePatternFull: string;
  
  ngOnInit() {
    this.campaign= this.campaignService.campaignSharedData;
    this.nodes= this.campaignService.nodes;
    this.filteredHistoric= this.campaignService.filteredHistoricShared;
    this.referenceHistoricMedia= this.campaignService.referenceMedia;
    
    this.items = [
      { label: this.translateService.instant('campaignTabBar.tab_0.label'), icon: 'fa-bar-chart' },
      { label: this.translateService.instant('campaignTabBar.tab_1.label'), icon: 'fa-bar-chart' },
      { label: this.translateService.instant('campaignTabBar.historic.label'), icon: 'fa-calendar' },
    ];
    this.activeItem = this.items[2];

    this.translateService.get('DATE_FILTER_FORMAT').subscribe(
      pattern => this.datePattern = pattern
    );
    this.translateService.get('DATE_FILTER_FORMAT_FULL').subscribe(
      pattern => this.datePatternFull = pattern
    );
  }

  activateMenu() {
    this.activeItem = this.menu['activeItem'];
    if (this.activeItem.label === this.translateService.instant('campaignTabBar.tab_0.label')) {
      this.campaignService.campaignSharedData = this.campaign;
      this.router.navigate(['/detailCampaign']);
    } else if (this.activeItem.label === this.translateService.instant('campaignTabBar.historic.label')) {
      this.campaignService.campaignSharedData = this.campaign;
      this.router.navigate(['/historiqueCmp']);
    } else if (this.activeItem.label === this.translateService.instant('campaignTabBar.tab_1.label')) {
      this.router.navigate(['/infoGeneralCmp']);
    }
  }
  
  doClear() { 
  }

  onSubmit(){ 
 
  }
  
  searchHistoric(filteredHistoric:boolean, parentReference : string, referenceHistoricMedia : string) { 
    this.reference.nativeElement.value = this.campaign.reference;
    this.referenceMedia.nativeElement.value = referenceHistoricMedia;
    if(!this.filteredHistoric) {
    this.campaignService.listHistoric(this.reference.nativeElement.value, this.startDate, this.endDate).subscribe(
      response => {
        this.listHistoric = response; 
        console.log(this.listHistoric);
        // return this.filteredHistoric;
      }, 
      err => {
        this.log.error(err);
      }
    );
    }else {
      this.campaignService.listHistoricMedia(this.reference.nativeElement.value, this.referenceMedia.nativeElement.value ,this.startDate, this.endDate).subscribe(
        response => {
          this.listHistoricMedia = response; 
          console.log(this.listHistoricMedia);
          // return this.filteredHistoric;
        }, 
        err => {
          this.log.error(err);
        }
      );
    }
  }

  constractTypeFromValue(type : string){
    if("CAMPAIGN" === type){
      return 0;
    }else if("MEDIA" === type){
      return 1;
    }

  }
  
  getActionFromNodeLink(type: string, parentReference : string, referenceHistoricMedia : string) {

    if (this.constractTypeFromValue(type) === CampaignTreeNodeType.CAMPAIGN) {
      this.filteredHistoric= false;
      this.referenceMedia.nativeElement.value = referenceHistoricMedia;

    
    } else if (this.constractTypeFromValue(type) === CampaignTreeNodeType.MEDIA) {
      this.filteredHistoric= true;
      this.referenceMedia.nativeElement.value = referenceHistoricMedia;
		}  
    this.campaignService.filteredHistoricShared =   this.filteredHistoric;
    this.campaignService.referenceMedia= referenceHistoricMedia;

    return this.filteredHistoric; 
	}

}

