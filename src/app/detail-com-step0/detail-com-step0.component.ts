import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';

@Component({
  selector: 'app-detail-com-step0',
  templateUrl: './detail-com-step0.component.html',
  styleUrls: ['./detail-com-step0.component.css']
})
export class DetailComStep0Component implements OnInit {
  @Input() campaign: Campaign;
  stepList: Array<string> = [];
  step: string;
  currentStepIndex:number;
  confirmationMessage: any;
  constructor(private translateService: TranslateService,
    private campaignService: CampaignService,
    private router: Router) { }

  ngOnInit() {
    this.currentStepIndex =0;
    this.confirmationMessage = this.campaignService.confirmationMessage;
  }

  doAddMedia(){
    this.campaignService.mySharedData = this.campaign;
    this.router.navigate(['/addMedia']);
  }
}
