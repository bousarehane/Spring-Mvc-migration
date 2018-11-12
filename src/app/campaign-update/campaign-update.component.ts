import { NotifMessageService } from '../../app/core/services/notifmessage.service';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Campaign, CampaignStatus } from '../../app/core/models/campaign';
import { ParamValue } from '../../app/core/models/param-value';
import { CampaignService} from '../../app/core/services/campaign.service';
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
import * as VasConstants from '../core/globals/VasConstants';

@Component({
  selector: 'app-campaign-update',
  templateUrl: './campaign-update.component.html',
  styleUrls: ['./campaign-update.component.css']
})
export class CampaignUpdateComponent implements OnInit , AfterViewInit {
  campaign: Campaign;
  campaignTow: Campaign;
  isDisplayPopup: boolean;
  campaignTypeList: SelectItem[];
  typeListElements: Array<string>;
  campaignLevelList: SelectItem[];
  levelListElements: Array<any>;
  advertisingCategoryList: SelectItem[];
  advertisingCatListElements: Array<any>;
  refrenceCampaign: string;


  // Référence de la vue du modal
   @ViewChild('modalConfirmationClose') modelConfirmationClose: TemplateRef<Object>;

   @ViewChild('modalMerchantReference') modalMerchantReference: TemplateRef<Object>;
   

   @ViewChild('editForm') editForm: NgForm;

   private modalRef: NgbModalRef;
   


  constructor(
    private cdRef: ChangeDetectorRef, // pour ne pas avoir l'exception ExpressionChangedAfterItHasBeenCheckedError
    private campaignService: CampaignService,


    private dateUtilService: DateUtilService,
    private router: Router,
    private notifService: NotifMessageService,
    private validationService: ValidationService,

    private translateService: TranslateService,
    private modalService: NgbModal,

    private route: ActivatedRoute,

    private log: NGXLogger) {
    this.campaign = <Campaign>{};
    this.campaignTow = <Campaign>{};
    
  
    this.isDisplayPopup = false;
  }

  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
        this.refrenceCampaign = params['reference'];
    });
    this.initcampaignLevelList();
    this.getCampaignByReference(this.refrenceCampaign);
    this.isDisplayPopup = false;
  }
  ngAfterViewInit(): void {
    
   }
  
  /**
   * control() de form
   */
  private control(): boolean {
    if(this.editForm.invalid){
      return false;
    }
    return true;
  }
  /**
   * submit form after validation
   * @param form 
   */
 doSave(form: NgForm) {
    // controls
    if (!this.control()) {
      return;
    } else {
      // update
        let campaignIsSaved: boolean = false;
        this.campaignTow.name = this.campaign.name;
        this.campaignTow.reference = this.campaign.reference;
        this.campaignTow.comment = this.campaign.comment;
        this.campaignTow.id = this.campaign.id;
        this.campaignTow.type  = this.campaign.type;
        this.campaignTow.level = this.campaign.level;
        this.campaignTow.organizationName = this.campaign.organizationName;
        this.campaignTow.defaultCampaign = this.campaign.defaultCampaign;
        this.campaignTow.activationDate = this.campaign.activationDate;
        this.campaignTow.deactivationDate = this.campaign.deactivationDate;
        this.campaignTow.status = this.campaign.status;
        this.campaignTow.advertisingCategoryCode = this.campaign.advertisingCategoryCode;
        this.campaignTow.terminalAmount = this.campaign.terminalAmount;


        this.campaignService.updateCampaign(this.campaignTow).subscribe(
          (camp: Campaign) => {
            if(camp.displayPopup){
              this.modalRef = this.modalService.open(this.modalMerchantReference);
              this.modalRef.result.then((result) => {
              }, (reason) => {
              });
              return;
            }
            campaignIsSaved = true;
            this.campaign.id = camp.id;
            this.campaign.creationDate = camp.creationDate;
            this.campaign.reference = camp.reference;
            this.gotoCampaignDetail();
          },
          errors => {
            this.handleCampaignSaveErrors(form, errors);
          },
          () => { this.log.debug('update campaign Completed'); }
        );
    }
  }

/**
 * get all errors
 * @param form 
 * @param errors 
 */
  handleCampaignSaveErrors(form, errors) {
    for (const entry of errors.error) {
      this.notifService.notifyErrorWithDetailFromApi(entry.message, errors); 
    }
    this.validationService.updateControlsValidation(form, errors);
    this.log.error(errors);
  }

/**
 * return to dashbord page
 */
  doClear() {
      this.modalService.open(this.modelConfirmationClose).result.then((result) => {
      }, (reason) => {
      });
  }
  
/**
 * initcampaignLevelList
 * get list of levels
 */
  private initcampaignLevelList() {
    // initialiser this.campaign;
    this.campaignLevelList = [];
    this.campaignService.getCampaignLevel().subscribe(
      response => {
        this.levelListElements = response;
        for (const entry of this.levelListElements) {
          this.campaignLevelList.push({ label: entry, value: entry });
        }
      },
      err => {
        this.log.error(err);
      })
  }

/**
 * onChangeLevel
 * @param event 
 */
  onChangeLevel(event) {
    this.campaignService.changeLevelEvent(this.campaign).subscribe(
      response => {
        this.campaign.displayMerchantReference = response.displayMerchantReference;
        this.campaign.type=response.type;
        if(response.merchantReference){
          this.campaign.merchantReference =response.merchantReference;
        }
      },
      err => {
        this.log.error(err);
      })
  }

  /**
   * goToYes in popup
   * @param event 
   */
  goToYes(event){
    this.campaignService.goToYesMerchantPopup().subscribe(
      (camp: Campaign) => {
        this.modalRef.close();
        this.campaign = camp;
        this.gotoCampaignDetail();
    },
      err => {
        this.modalRef.close();
        this.handleCampaignSaveErrors(this.editForm, err);
      });

  }

  /**
   * goToNo in popup
   * @param event 
   */
  goToNo(event){
    this.campaignService.goToNoMerchantPopup().subscribe(
      response => {
       this.campaign = response;
      },
      err => {
        this.log.error(err);
      })
    
  }
/**
 * gotoCampaignDetail
 */
gotoCampaignDetail() {
    this.campaignService.campaignSharedData = this.campaign;
    this.campaignService.confirmationMessage = 'La campagne "'+this.campaign.name+'" a été mise à jour'
    this.campaignService.forwardToPageMessage="campaignDetails";
    this.campaignService.mode="1";
    this.router.navigate(['/infoGeneralCmp']); 
    
  }

/**
 * getCampaignByReference
 * @param campReferance 
 */
  getCampaignByReference(campReferance: string){
    this.campaignService.getCmpaignByRef(campReferance).subscribe(
      response => {
       this.campaign = response;

       if (VasConstants.CAMPAIGN_TYPE_EXTERNAL === this.campaign.type)
       {
         this.campaignLevelList = this.campaignLevelList.filter(item => item.value !== VasConstants.CAMPAIGN_LEVEL_2);
         this.campaignLevelList = this.campaignLevelList.filter(item => item.value !== VasConstants.CAMPAIGN_LEVEL_3);
       }
       else if (VasConstants.CAMPAIGN_TYPE_INTERNAL === this.campaign.type)
       {
         this.campaignLevelList = this.campaignLevelList.filter(item => item.value !== VasConstants.CAMPAIGN_LEVEL_1);
       }

       this.campaign.displayMerchantReference = (VasConstants.CAMPAIGN_TYPE_INTERNAL === this.campaign.type);
       this.campaign.displayDefaultCampaign = (VasConstants.CAMPAIGN_TYPE_EXTERNAL === this.campaign.type);
      },
      err => {
        this.log.error(err);
      })
  }
}
