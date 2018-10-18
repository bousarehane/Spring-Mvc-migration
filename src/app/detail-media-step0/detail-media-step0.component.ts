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
  selector: 'app-detail-media-step0',
  templateUrl: './detail-media-step0.component.html',
  styleUrls: ['./detail-media-step0.component.css']
})
export class DetailMediaStep0Component implements OnInit {
  
    @Input() mediaBean: MediaBean;
    @Input() campaign: Campaign;
    url: any;
    mediaReferance: any;
    campReferance:any;
    currentStepIndex:number;
    confirmationMessage: any;
    image: Blob;
    constructor( 
      private route: ActivatedRoute,
      private router: Router,
      private campaignService: CampaignService,
      private log: NGXLogger) { }
  
    ngOnInit() {
      this.currentStepIndex =1; 
      this.confirmationMessage = this.campaignService.confirmationMessage;
      this.getImageFromService() ;
    }

    imageToShow: any;
    
    createImageFromBlob(image: Blob) {
       let reader = new FileReader();
       reader.addEventListener("load", () => {
          this.imageToShow = reader.result;
       }, false);
    
       if (image) {
          reader.readAsDataURL(image);
       }
    }

    getImageFromService() {
      this.campaignService.getImage(this.campReferance).subscribe(data => {
        this.createImageFromBlob(data);
      }, error => {
        console.log(error);
      });
}
    doAddMoreMedia(){
      this.campaignService.mySharedData = this.campaign;
      this.router.navigate(['/addMedia']);
    }
  }  