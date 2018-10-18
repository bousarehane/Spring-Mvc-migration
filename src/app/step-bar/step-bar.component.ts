import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';



@Component({
  selector: 'app-step-bar',
  templateUrl: './step-bar.component.html',
  styleUrls: ['./step-bar.component.css']
})
export class StepBarComponent implements OnInit {
  stepList: Array<string> = [];
  step: string;
  @Input() currentStepIndex:number;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.stepList.push(this.translateService.instant('campaignStepBar.step_' + 0));
    this.stepList.push(this.translateService.instant('campaignStepBar.step_' + 1));
    this.stepList.push(this.translateService.instant('campaignStepBar.step_' + 2));
  }

}
