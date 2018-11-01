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
  selector: 'app-campaign-update',
  templateUrl: './campaign-update.component.html',
  styleUrls: ['./campaign-update.component.css']
})
export class CampaignUpdateComponent implements OnInit , AfterViewInit {
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
    this.initcampaignLevelList();
    this.isDisplayPopup = false;
  }

  ngOnInit() {
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
        this.campaignService.updateCampaign(this.campaign , this.campaign.id).subscribe(
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

  gotoCampaignDetail() {
    this.campaignService.mySharedData = this.campaign;
    this.campaignService.confirmationMessage = 'The campaign "'+this.campaign.name+'" has been created successfully'
    this.campaignService.forwardToPageMessage="campaignDetailsStep0";
    this.campaignService.mode="0";
    this.router.navigate(['/detailCampaign']);
  }

}
