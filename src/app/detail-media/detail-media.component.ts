import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { MediaBean } from '../core/models/MediaBean';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
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
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private log: NGXLogger) { }

  ngOnInit() {
    this.mediaBean;
  }

 
}
