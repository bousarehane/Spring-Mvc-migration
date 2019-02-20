import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { CampaignService } from '../core/services/campaign.service';
import { Campaign } from '../core/models/campaign';
import { MediaBean } from '../core/models/MediaBean';
import { CampaignTreeNode } from '../core/models/CampaignTreeNode';
import { CampaignTree } from '../core/models/CampaignTree';
import { CampaignSearch } from '../core/models/campaignSearch';
import { NGXLogger } from 'ngx-logger';
import { SelectItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm,NgModel } from '@angular/forms';
import { DateUtilService } from '../core/services/date-util.service';

import { StringUtilService } from '../core/services/string-util.service';
import { Parameter, ParameterType } from '../core/models/targeting/parameter';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DetailCompComponent } from '../detail-comp/detail-comp.component';
import { DetailMediaComponent } from '../detail-media/detail-media.component';
import { ListAvailableTerminalsComponent } from '../list-available-terminals/list-available-terminals.component';
import { environment } from '../../environments/environment.prod';
import { DetailMediaStep0Component } from '../detail-media-step0/detail-media-step0.component';
import { TerminalBean } from '../core/models/terminalBean';
import { NotifMessageService } from '../../app/core/services/notifmessage.service';
import { ValidationService } from '../../app/core/services/validation.service';
import { LogService} from '../../app/core/services/log.service';
import { CampaignSearchService } from '../core/services/campaign-search.service';
import { Subject }    from 'rxjs';
import { ListAssignTerminalsComponent } from '../list-assign-terminals/list-assign-terminals.component';
import * as VasConstants from '../core/globals/VasConstants';
import { NgbModal, ModalDismissReasons , NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';



@Component({
  selector: 'app-assign-terminal',
  templateUrl: './assign-terminal.component.html',
  styleUrls: ['./assign-terminal.component.css']
})
export class AssignTerminalComponent implements OnInit {
  campaign : Campaign;
  campaignPrime : Campaign;
  url = '';
  urlTemp = '';
  mediaBean:MediaBean;
  currentStepIndex:number;
  currentFileUpload: File;
  csvListUnassign: boolean;
  checkExternalCampaign:boolean;
  terminalsToBeAssign: TerminalBean[];
  terminalsToBeUnAssign: TerminalBean[];
  terminals: TerminalBean[];
  datasource: TerminalBean[];
  totalRecords: number;
  terminalsUnassign: TerminalBean[];
  datasourceUnassign: TerminalBean[];
  totalRecordsUnassign: number;
  testIfAssign : boolean;
  isDisplayPopup: boolean;
  
  @ViewChild('childAvailable')
  private childAvailable: ListAvailableTerminalsComponent;

  @ViewChild('childAssign')
  private childAssign: ListAssignTerminalsComponent;

  @ViewChild('modalUnassignTerminal') modalUnassignTerminal: TemplateRef<Object>;

  private modalRef: NgbModalRef;

  @ViewChild('assignTerminalForm') assignTerminalForm: NgForm;

  isDisplayPopupPrime : boolean;


 constructor(private campaignService: CampaignService , private logService: LogService , 
    private notifService: NotifMessageService,
    private validationService: ValidationService,
    private router: Router,
    private log: NGXLogger,
    private searchService: CampaignSearchService,
    private modalService: NgbModal) { 
      this.checkExternalCampaign =true;
  }

  
  /**
   * ngOnInit
   */
  ngOnInit() {

    this.campaignPrime = <Campaign>{}; 
   
    this.campaign = this.campaignService.mySharedData;

    this.campaignPrime.reference = this.campaign.reference;
   
    this.checkExternalCampaign = VasConstants.CAMPAIGN_TYPE_EXTERNAL === this.campaign.type ;

    this.csvListUnassign = false;

    // list assign 
    this.campaignService.listAssignTerminals(this.campaign).subscribe( 
      response => {
        this.constructResponse(response);
      }, 
      err => {
        this.log.error(err);
      })
    
  }


  /**
   * onSelectFile
   * @param event 
   */
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


  /**
   * uploadFile
   * @param form 
   * @param event 
   */
    uploadFile(form: NgForm , event){
      this.campaignService.uploadTerminals(this.currentFileUpload ,this.csvListUnassign, this.childAvailable.datasource , this.childAssign.datasource).subscribe(
        response => {
          this.isDisplayPopupPrime = response.isDisplayPopupPrime;
          if(this.isDisplayPopupPrime){
            this.modalRef = this.modalService.open(this.modalUnassignTerminal);
            this.modalRef.result.then((result) => {
            }, (reason) => {
            });
            return;
          }
          this.constructResponse(response);
          this.childAvailable.updateVisibilityPrime();
          this.childAssign.updateVisibilityPrime();
        },
        err => {
          this.handleSaveErrors(form, err);
          this.log.error(err); 
        })
  }

  /**
   * handleMediaSaveErrors
   * @param form 
   * @param errors 
   */
  handleSaveErrors(form, errors) {
    for (const entry of errors.error) {
      this.notifService.notifyErrorWithDetailFromApi(entry.message, errors); 
    }
    this.validationService.updateControlsValidation(form, errors);
    this.log.error(errors);
  }

  /**
   * doAssignTerminal
   * @param event 
   */
  doAssignTerminal(event){
    this.terminalsToBeAssign = event; 
  }
  /**
   * doUnAssignTerminal
   * @param event 
   */
  doUnAssignTerminal(event){
    this.terminalsToBeUnAssign = event;
  }

  /**
   * assign
   */
  assign(){
      if(this.terminalsToBeAssign && this.terminalsToBeAssign.length>0){
          this.childAvailable.assign = true;
          this.childAvailable.unassign = false;
          
          this.childAssign.assign = false;
          this.childAssign.unassign = false;
          this.childAvailable.updateVisibility(this.terminals,null);
          this.childAssign.updateVisibility(this.terminalsUnassign , this.terminalsToBeAssign);
          }
          this.terminalsToBeAssign = null;
  }
  /**
   * unassign
   */
  unassign(){
        if(this.terminalsToBeUnAssign && this.terminalsToBeUnAssign.length >0){
        this.childAssign.assign = false;
        this.childAssign.unassign = true;

        this.childAvailable.assign = false;
        this.childAvailable.unassign = false;
        this.childAvailable.updateVisibility(this.terminals , this.terminalsToBeUnAssign);
        this.childAssign.updateVisibility(this.terminalsUnassign , null);
        }
        this.terminalsToBeUnAssign =null; 
  }
/**
 * doSave
 */
  doSave(form: NgForm){
    
    if(this.campaign.status == "ACTIVE" && this.childAssign.datasource.length == 0){
        this.getTerminalsAssign(this.campaign);
    }

    this.campaignService.saveAssignTerminals(this.campaignPrime , this.childAssign.datasource , this.childAvailable.datasource).subscribe( 
      response => {
        this.campaign = response;
        this.gotoCampaignDetail();
      }, 
      err => {
        this.handleSaveErrors(form, err);
        this.log.error(err); 
      })
  }
/**
 * doClear 
 */
  doClear(){

  }

/**
 * gotoCampaignDetail
 */
  gotoCampaignDetail() {
    this.campaignService.campaignSharedData =   this.campaign;
    this.campaignService.confirmationMessage = 'Le terminal a été enregistré avec succès';
    this.campaignService.forwardToPageMessage="terminalDashboard";
    this.campaignService.nodes =  this.campaign.campaignTree.nodes;
    this.router.navigate(['/detailCampaign']);
  }

  /**
   * goToYes
   * @param event 
   * @param form 
   */
  goToYes(event){
    this.campaignService.goToYesPopup().subscribe(
    response => {
      this.constructResponse(response);
      this.childAvailable.updateVisibilityPrime();
      this.childAssign.updateVisibilityPrime();

      this.modalRef.close();
    },
      err => {
        this.modalRef.close();
        this.handleSaveErrors(this.assignTerminalForm, err);
      });

  }

/**
 * goToNo
 * @param event 
 */
  goToNo(event){
    this.campaignService.goToNoPopup().subscribe(
      response => {
       this.isDisplayPopupPrime = false;
      },
      err => {
        this.log.error(err);
      })
    
  }

/**
 * constructResponse
 * @param response 
 */
  constructResponse (response){
    this.datasource = response.availableTerminals; 
    this.totalRecords = this.datasource.length;
    this.terminals = this.datasource.slice(0, 10);

    this.datasourceUnassign = response.assignedTerminals;
    this.totalRecordsUnassign = this.datasourceUnassign.length;
    this.terminalsUnassign = this.datasourceUnassign.slice(0, 10);
    this.datasourceUnassign.forEach((terminal, index) => {
      if(terminal.activationDate && terminal.activationDate != null){
        terminal.activationDate =new Date(terminal.activationDate) ; 
      }
      if(terminal.deactivationDate && terminal.deactivationDate != null){
        terminal.deactivationDate =new Date(terminal.deactivationDate) ;
      }
    });
  }
/**
 * getTerminalsAssign
 * @param nextPage 
 */
  getTerminalsAssign(campaign:Campaign){   
    this.campaignService.listTerminals(campaign).subscribe( 
      response => {
        this.childAssign.datasource =response;
        this.childAssign.datasource.forEach((terminal, index) => {
          if(terminal.activationDate && terminal.activationDate != null){
            terminal.activationDate =new Date(terminal.activationDate) ; 
          }
          if(terminal.deactivationDate && terminal.deactivationDate != null){
            terminal.deactivationDate =new Date(terminal.deactivationDate) ;
          }
        });
        this.childAssign.datasource.forEach((eltJ, j) => {
          this.childAvailable.datasource = this.childAvailable.datasource.filter(item => item.id !==  this.childAssign.datasource[j].id);
        });
        this.childAssign.updateVisibilityPrime();
        this.childAvailable.updateVisibilityPrime();
        return;
      }, 
      err => {
        this.log.error(err);
      })
  }
}
