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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm,NgModel } from '@angular/forms';
import * as VasConstants from '../core/globals/VasConstants';
import { NotifMessageService } from '../../app/core/services/notifmessage.service';



@Component({
  selector: 'app-detail-comp',
  templateUrl: './detail-comp.component.html',
  styleUrls: ['./detail-comp.component.css']
})
export class DetailCompComponent implements OnInit {

  @Input() campaign: Campaign;
  @Output() nodesToDisplay: EventEmitter<any> = new EventEmitter();
  items:MenuItem[];
  activeItem: MenuItem;
  @ViewChild('menuItems') menu: MenuItem[];
  display: boolean = false;
  deactivationReason: string;
  clickAction: string;
  displayCancelPopup: boolean = false;
  displayActivePopup: boolean = false;
  campaignToAction: Campaign;
 
  constructor(private render:Renderer , private router: Router, private translateService: TranslateService ,
       private campaignService: CampaignService ,
       private log: NGXLogger,
       private notifService: NotifMessageService) { 

    this.campaignToAction = <Campaign>{};
  }

  ngOnInit() {
    this.items = [
      {label: this.translateService.instant('campaignTabBar.tab_0.label'), icon: 'fa-bar-chart'},
      {label: this.translateService.instant('campaignTabBar.tab_1.label'), icon: 'fa-bar-chart'},
      {label: this.translateService.instant('campaignTabBar.historic.label'), icon: 'fa-calendar'}, 
  ];
  this.activeItem = this.items[0];

  if(this.campaign === null || this.campaign  === undefined){
    this.campaign = this.campaignService.campaignSharedData;
  }
  }
  activateMenu(){
    this.campaignService.confirmationMessage ="";
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
    this.displayCancelPopup = true;
  }

  onActionFromLeaveDashboredButton(){
    this.router.navigate(['/searchCampaign']); 
    this.displayCancelPopup = false;
  } 

onActionFromSuspendButton(event){
 this.display = true;
 this.clickAction="suspend";
}

onActionFromCloseButton(event){
  this.display = true;
  this.clickAction="close";
}

onActionFromActiveButton(event){
  this.displayActivePopup = true;
  this.clickAction="active";
}

actionButtonEnregistrer(form: NgForm){
  this.campaignToAction.reference = this.campaign.reference;
  if(this.clickAction === "suspend"){
  this.campaignService.suspendCampaign(this.deactivationReason,this.campaignToAction).subscribe(
    (camp: Campaign) => {
      this.campaign = camp;
      this.display = false;
      this.nodesToDisplay.emit(camp.campaignTree.nodes);
    },
    err => {
      this.handleCampaignsErrors(form, err);
    })
  }else if(this.clickAction === "close"){
    this.campaignService.closeCampaign(this.deactivationReason,this.campaignToAction).subscribe(
      (camp: Campaign) => {
        this.campaign = camp;
        this.display = false;
        this.nodesToDisplay.emit(camp.campaignTree.nodes);
      },
      err => {
        this.handleCampaignsErrors(form, err);
      })

  }else{
    this.campaignToAction.activationDate =this.campaign.activationDate;
    this.campaignService.activeCampaign(this.campaignToAction).subscribe(
      (camp: Campaign) => {
        this.campaign = camp;
        this.displayActivePopup = false;
        this.nodesToDisplay.emit(camp.campaignTree.nodes);
      },
      err => {
        this.handleCampaignsErrors(form, err);
      })

  }
}

handleCampaignsErrors(form, errors) {
  for (const entry of errors.error) {
    this.notifService.notifyErrorWithDetailFromApi(entry.message, errors); 
  }
 
}

isActivateButtonDisplayed() {
  return VasConstants.CAMPAIGN_STATUS_SUSPENDED === this.campaign.status;
}

isSuspendButtonDisplayed() {
  return VasConstants.CAMPAIGN_STATUS_AWAITING_ACTIVATION === this.campaign.status || VasConstants.CAMPAIGN_STATUS_ACTIVE === this.campaign.status;
}

isCloseButtonDisplayed() {
  return !(VasConstants.CAMPAIGN_STATUS_CLOSED === this.campaign.status);

}

}
