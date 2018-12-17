import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { MediaBean } from '../core/models/MediaBean';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule, MenuItem } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm,NgModel } from '@angular/forms';
import * as VasConstants from '../core/globals/VasConstants';
import { NotifMessageService } from '../../app/core/services/notifmessage.service';


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
  display: boolean = false;
  deactivationReason: string;
  clickAction: string;
  displayCancelPopup: boolean = false;
  displayActivePopup: boolean = false;
  mediaToAction: MediaBean;
  @Output() nodesToDisplay: EventEmitter<any> = new EventEmitter();
 
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private log: NGXLogger, 
    private translateService: TranslateService,
    private notifService: NotifMessageService) { }

  ngOnInit() {
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
      if(this.campaign){
       this.campaignService.campaignSharedData = this.campaign;
      }
      this.campaignService.mode ="2";
      this.router.navigate(['/detailCampaign']); 
    } else if(this.activeItem.label === this.translateService.instant('campaignTabBar.historic.label')){
      this.router.navigate(['/historiqueCmp']); 
    }else if(this.activeItem.label === this.translateService.instant('campaignTabBar.tab_1.label')){
      this.campaignService.mediaSharedData= this.mediaBean;
      this.campaignService.forwardToPageMessage = "mediaDetails";
      this.router.navigate(['/infoGeneralMedia']); 
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
this.mediaToAction.reference = this.mediaBean.reference;
if(this.clickAction === "suspend"){
this.campaignService.suspendMedia(this.deactivationReason,this.mediaToAction).subscribe(
  (media: MediaBean) => {
    this.getMediaFromReference(media.reference , this.campaign.reference);
    this.display = false;
    this.nodesToDisplay.emit(this.campaign.campaignTree.nodes);
  },
  err => {
    this.handleCampaignsErrors(form, err);
  })
}else if(this.clickAction === "close"){
  this.campaignService.closeMedia(this.deactivationReason,this.mediaToAction).subscribe(
    (media: MediaBean) => {
      this.getMediaFromReference(media.reference , this.campaign.reference);
      this.display = false;
      this.nodesToDisplay.emit(this.campaign.campaignTree.nodes);
    },
    err => {
      this.handleCampaignsErrors(form, err);
    })

}else{
  this.campaignService.activeMedia(this.mediaToAction).subscribe(
    (media: MediaBean) => {
      this.getMediaFromReference(media.reference , this.campaign.reference);
      this.displayActivePopup = false;
      this.nodesToDisplay.emit(this.campaign.campaignTree.nodes);
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
  if(this.campaign && this.mediaBean)
  return ((VasConstants.MEDIA_STATUS_SUSPENDED === this.mediaBean.status ) && (VasConstants.CAMPAIGN_STATUS_ACTIVE === this.campaign.status || VasConstants.CAMPAIGN_STATUS_AWAITING_ACTIVATION === this.campaign.status));
}

isSuspendButtonDisplayed() {
  if(this.campaign && this.mediaBean)
  return ((VasConstants.MEDIA_STATUS_ACTIVE === this.mediaBean.status) &&(VasConstants.CAMPAIGN_STATUS_ACTIVE === this.campaign.status || VasConstants.CAMPAIGN_STATUS_AWAITING_ACTIVATION === this.campaign.status));
}
 
isCloseButtonDisplayed() {
  if(this.campaign && this.mediaBean)
  return ((VasConstants.MEDIA_STATUS_ACTIVE === this.mediaBean.status || VasConstants.MEDIA_STATUS_SUSPENDED === this.mediaBean.status) &&  (VasConstants.CAMPAIGN_STATUS_ACTIVE === this.campaign.status || VasConstants.CAMPAIGN_STATUS_AWAITING_ACTIVATION === this.campaign.status));
}


getMediaFromReference(reference : string, cmpreference : string) {
  this.campaignService.getMediaByRef(reference,cmpreference).subscribe(
    response => {
     this.mediaBean = response;
    },
    err => {
      this.log.error(err);
    })
  }

}
