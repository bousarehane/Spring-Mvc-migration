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



@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css']
})
export class CampaignFormComponent implements OnInit , AfterViewInit {
  campaign: Campaign;
  isDisplayPopup: boolean;
  campaignTypeList: SelectItem[];
  typeListElements: Array<string>;
  campaignLevelList: SelectItem[];
  levelListElements: Array<any>;
  advertisingCategoryList: SelectItem[];
  advertisingCatListElements: Array<any>;


  // Référence de la vue du modal
   @ViewChild('modalConfirmationClose') modelConfirmationClose: TemplateRef<Object>;

   @ViewChild('modalMerchantReference') modalMerchantReference: TemplateRef<Object>;
   

   @ViewChild('editForm') editForm: NgForm;

   private modalRef: NgbModalRef;
   
   private modalRefClose: NgbModalRef;


  constructor(
    private cdRef: ChangeDetectorRef, // pour ne pas avoir l'exception ExpressionChangedAfterItHasBeenCheckedError
    private campaignService: CampaignService,


    private dateUtilService: DateUtilService,
    private router: Router,
    private notifService: NotifMessageService,
    private validationService: ValidationService,

    private translateService: TranslateService,
    private modalService: NgbModal,

    private log: NGXLogger) {
    this.campaign = <Campaign>{};
    this.initcampaignTypeList();
    this.initcampaignLevelList();
    this.initAdvertisingCategory();
    this.isDisplayPopup = false;
  }

  ngOnInit() {
    this.isDisplayPopup = false;
  }
  ngAfterViewInit(): void {
    
   }
  

  validateField1(context: NgModel ): boolean {
    if (context.control.value === 'sysa') {
      return false;
    }
    return true;
  }

  private control(): boolean {
    if(this.editForm.invalid){
      return false;
    }
    return true;
  }
 doSave(form: NgForm) {
    // controls
    if (!this.control()) {
      return;
    } else {
      // creation
      if (this.campaign.id == null || this.campaign.id === '') {
        let campaignIsSaved: boolean = false;
        this.campaignService.createCampaign(this.campaign).subscribe(
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
          () => { this.log.debug('Creat campaign Completed'); }
        );
      }
    }
  }


  handleCampaignSaveErrors(form, errors) {
    //this.notifService.notifyErrorWithDetailFromApi('ERROR_SAVING_CAMPAIGN', errors);
    for (const entry of errors.error) {
      this.notifService.notifyErrorWithDetailFromApi(entry.message, errors); 
    }
    this.validationService.updateControlsValidation(form, errors);
    this.log.error(errors);
  }

  doClear() {
      this.modalRefClose = this.modalService.open(this.modelConfirmationClose);
      this.modalRefClose.result.then((result) => {
      }, (reason) => {
      });
  }
  

  private initcampaignTypeList() {
    // initialiser this.campaign;
    this.campaignTypeList = [];
    this.campaignService.getCampaignType().subscribe(
      response => {
        this.typeListElements = response;
        for (const entry of this.typeListElements) {
          this.campaignTypeList.push({ label: entry, value: entry });
        }
      },
      err => {
        this.log.error(err);
      })
  }

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


  private initAdvertisingCategory() {
    // initialiser this.campaign;
    this.advertisingCategoryList = [];
    this.campaignService.getAdvertisingCategory().subscribe(
      response => {
        this.advertisingCatListElements = response;
        for (const entry of this.advertisingCatListElements) {
          this.advertisingCategoryList.push({ label: entry, value: entry });
        }
      },
      err => {
        this.log.error(err);
      })
  }

  onChangeInput($event) {
    
  }

  onChangeType(event) {
    this.campaignService.changeTypeEvent(this.campaign).subscribe(
      response => {
        this.campaign.displayMerchantReference = response.displayMerchantReference;
        this.campaign.displayDefaultCampaign = response.displayDefaultCampaign;
        this.campaign.availableCampaignLevels =response.availableCampaignLevels;
        if(response.merchantReference){
          this.campaign.merchantReference =response.merchantReference;
        }
      if (this.campaign !== undefined && this.campaign.availableCampaignLevels != undefined && this.campaign.availableCampaignLevels.length > 0) {
          this.campaignLevelList = [];
        for (const entry of this.campaign.availableCampaignLevels) {
          this.campaignLevelList.push({ label: entry, value: entry });
        }
      }
      },
      err => {
        this.log.error(err);
      })
  }

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
 * goToNo
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

  gotoCampaignDetail() {
    this.campaignService.mySharedData = this.campaign;
    this.campaignService.confirmationMessage = 'The campaign "'+this.campaign.name+'" has been created successfully'
    this.campaignService.forwardToPageMessage="campaignDetailsStep0";
    this.campaignService.mode="0";
    this.router.navigate(['/detailCampaign']);
  }

  clickOnYes(){
    this.modalRefClose.close();
    this.router.navigate(['/searchCampaign']); 
  }
}
