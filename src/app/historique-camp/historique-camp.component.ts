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


@Component({
  selector: 'app-historique-camp',
  templateUrl: './historique-camp.component.html',
  styleUrls: ['./historique-camp.component.css']
})
export class HistoriqueCampComponent implements OnInit {
  
  items:MenuItem[];
  activeItem: MenuItem;
  @ViewChild('menuItems') menu: MenuItem[];
  historique:string;
   
    constructor(private render:Renderer , private router: Router , 
      private campaignService: CampaignService ,private translateService: TranslateService) { }
  
    ngOnInit() {
      this.historique ="hicham";
      this.items = [
        {label: this.translateService.instant('campaignTabBar.tab_0.label'), icon: 'fa-bar-chart'},
        {label: this.translateService.instant('campaignTabBar.tab_1.label'), icon: 'fa-bar-chart'},
        {label: this.translateService.instant('campaignTabBar.historic.label'), icon: 'fa-calendar'}, 
    ];
    this.activeItem = this.items[2];
    }

    activateMenu(){
      this.campaignService.confirmationMessage =""; 
      this.activeItem =this.menu['activeItem'];
      if(this.activeItem.label === this.translateService.instant('campaignTabBar.tab_0.label')){
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
  
