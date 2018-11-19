import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { MediaBean } from '../core/models/MediaBean';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule, MenuItem } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';


@Component({
  selector: 'app-detail-media',
  templateUrl: './detail-media.component.html',
  styleUrls: ['./detail-media.component.css']
})
export class DetailMediaComponent implements OnInit {

  @Input() mediaBean: MediaBean;
  mediaReferance: any;
  campReferance:any;
  items:MenuItem[];
  activeItem: MenuItem;
  @ViewChild('menuItems') menu: MenuItem[];
  @Input() campaign: Campaign;
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private log: NGXLogger
    , private translateService: TranslateService) { }

  ngOnInit() {
    this.mediaBean;
    this.items = [
      {label: this.translateService.instant('campaignTabBar.tab_0.label'), icon: 'fa-bar-chart'},
      {label: this.translateService.instant('campaignTabBar.tab_1.label'), icon: 'fa-bar-chart'},
      {label: this.translateService.instant('campaignTabBar.historic.label'), icon: 'fa-calendar'}, 
  ];
  this.activeItem = this.items[0];
  }

  activateMenu(){
    this.activeItem =this.menu['activeItem'];
    if(this.activeItem.label === this.translateService.instant('campaignTabBar.tab_0.label')){
      this.campaignService.campaignSharedData = this.campaign;
      this.campaignService.mode ="2";
      this.router.navigate(['/detailCampaign']); 
    } else if(this.activeItem.label === this.translateService.instant('campaignTabBar.historic.label')){
      this.router.navigate(['/historiqueCmp']); 
    }else if(this.activeItem.label === this.translateService.instant('campaignTabBar.tab_1.label')){
      this.router.navigate(['/infoGeneralCmp']); 
    }
    
 }
}
