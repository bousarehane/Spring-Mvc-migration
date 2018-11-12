import { NotifMessageService } from '../../app/core/services/notifmessage.service';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Campaign, CampaignStatus } from '../../app/core/models/campaign';
import { MediaBean } from '../../app/core/models/mediaBean';
import { CampaignTreeNode } from '../../app/core/models/CampaignTreeNode';

import { ParamValue } from '../../app/core/models/param-value';
import { CampaignService} from '../../app/core/services/campaign.service';
import { LogService} from '../../app/core/services/log.service';

import { DateUtilService } from '../../app/core/services/date-util.service';
import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild,
  ChangeDetectorRef, TemplateRef, forwardRef, ViewChildren, QueryList , AfterViewChecked, ElementRef
} from '@angular/core';
import { Message, ConfirmationService, ConfirmDialogModule, SelectItem, SharedModule } from 'primeng/primeng';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { NgbModal, ModalDismissReasons , NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm,NgModel } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { ValueLabel } from '../../app/core/models/value-label';
import { environment } from '../../environments/environment.prod';
import { ValidationService } from '../../app/core/services/validation.service';
import { InputValidationComponent } from '../input-validation/input-validation.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MessagesModule} from 'primeng/primeng';


@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.css']
})
export class AddMediaComponent implements OnInit {

  url = '';
  urlTemp = '';
  campaign : Campaign;
  mediaBean:MediaBean;
  currentStepIndex:number;
  currentFileUpload: File;
  @ViewChild('addMediaForm') addMediaForm: NgForm;
  nodes: CampaignTreeNode[];
  
  constructor(private campaignService: CampaignService , private logService: LogService , 
    private notifService: NotifMessageService,
    private validationService: ValidationService,
    private router: Router,
    private log: NGXLogger) { 

  }

  ngOnInit() {
    this.currentStepIndex =1;
    this.campaign = this.campaignService.mySharedData;

    this.mediaBean = <MediaBean>{}; 
    this.mediaBean.displayTime = 15;
  }

 
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.currentFileUpload = event.target.files[0];

      reader.onload = (event:any) => { // called once readAsDataURL is completed
        this.urlTemp = event.target.result;
      }

    }else{
      this.currentFileUpload = null;
      this.urlTemp = '';
      this.url ='';
    }
  }

  uploadMediaFile(form: NgForm , event){
      this.campaignService.upload(this.currentFileUpload).subscribe(
        (media: MediaBean) => {
          this.mediaBean.type = media.type;
          this.mediaBean.dimension = media.dimension;
          this.mediaBean.displaySize = media.displaySize;
          this.mediaBean.size = media.size;
          this.mediaBean.colourDepth = media.colourDepth;
          this.mediaBean.height = media.height;
          this.mediaBean.width = media.width;
          this.mediaBean.sourceFile = media.sourceFile;
          this.url =  this.urlTemp;
        },
        err => {
          this.handleMediaSaveErrors(form, err);
          this.log.error(err); 
        })
  }

  private control(): boolean {
    if(this.addMediaForm.invalid){
      return false;
    }
    return true;
  }

  doSave(form: NgForm) {
    if (!this.control()) {
      return;
    } else {

    this.campaignService.createMedia(this.mediaBean , this.currentFileUpload ,this.campaign)
    .subscribe(
    (media: MediaBean) => {
     this.mediaBean = media;
   if(this.campaignService.forwardToDetailMedia === "detail"){
    this.gotoCampaignDetailPrime();
   }else {
    this.gotoCampaignDetail();
   }
    },
    errors => {
      this.handleMediaSaveErrors(form, errors);
      this.log.error(errors);
    }
    );
  }
  }
  
  handleMediaSaveErrors(form, errors) {
    for (const entry of errors.error) {
      this.notifService.notifyErrorWithDetailFromApi(entry.message, errors); 
    }
    this.validationService.updateControlsValidation(form, errors);
    this.log.error(errors);
  }


  gotoCampaignDetail() {
    this.campaignService.campaignSharedData =   this.campaign;
    this.campaignService.mediaSharedData =   this.mediaBean;
    this.campaignService.confirmationMessage = 'The media "'+this.mediaBean.name+'" has been created successfully';
    this.campaignService.forwardToPageMessage="mediaDetailsStep0";
    this.campaignService.mode="0";
    this.campaignService.getCmpaignByRefMedia(this.campaign.reference).subscribe(
      response => {
       this.campaign = response;
       this.nodes= this.campaign.campaignTree.nodes;
       this.campaignService.nodes =  this.nodes;
       this.router.navigate(['/detailCampaign']);
      },
      err => {
        this.log.error(err);
      })
     
  }

  gotoCampaignDetailPrime() {
    this.campaignService.campaignSharedData =   this.campaign;
    this.campaignService.mediaSharedData =   this.mediaBean;
    this.campaignService.confirmationMessage = 'The media "'+this.mediaBean.name+'" has been created successfully';
    this.campaignService.forwardToPageMessage="mediaDetails";
    this.campaignService.mode="1";
    this.campaignService.getCmpaignByRefMedia(this.campaign.reference).subscribe(
      response => {
       this.campaign = response;
       this.nodes= this.campaign.campaignTree.nodes;
       this.campaignService.nodes =  this.nodes;
       this.router.navigate(['/detailCampaign']);
      },
      err => {
        this.log.error(err);
      })
     
  }

}
