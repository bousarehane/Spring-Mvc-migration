import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import {Renderer} from '@angular/core';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-detail-comp',
  templateUrl: './detail-comp.component.html',
  styleUrls: ['./detail-comp.component.css']
})
export class DetailCompComponent implements OnInit {

  @Input() campaign: Campaign;
  items:MenuItem[];
  activeItem: MenuItem;
  @ViewChild('menuItems') menu: MenuItem[];
 

  constructor(private render:Renderer , private router: Router, private translateService: TranslateService ,   private campaignService: CampaignService) { }

  ngOnInit() {
    //this.tabList.push(this.translateService.get('campaignTabBar.tab_0.label'));
    //this.tabList.push(this.translateService.instant('campaignTabBar.tab_1.label'));
    //this.tabList.push(this.translateService.instant('campaignTabBar.historic.label'));
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
  doClear() {
}

}
