import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CampaignService } from '../core/services/campaign.service';
import { Campaign } from '../core/models/campaign';
import { CampaignSearch } from '../core/models/campaignSearch';
import { NGXLogger } from 'ngx-logger';
import { SelectItem } from 'primeng/primeng';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms/forms';
import { DateUtilService } from '../core/services/date-util.service';
import { environment } from '../../environments/environment.prod';
import { StringUtilService } from '../core/services/string-util.service';
import { Parameter, ParameterType } from '../core/models/targeting/parameter';
import {Router} from "@angular/router";

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements  OnInit, AfterViewInit  {
 

  private listCach: Map<string, SelectItem[]> = new Map<string, SelectItem[]>();
  etatList: SelectItem[];
  typeList: SelectItem[];
  templateList: Array<Campaign> = [];
  templateListTow: Array<Campaign> = [];
 
  @Input() searchModel: CampaignSearch;
  @Output() searchModelSubmit: EventEmitter<CampaignSearch> = new EventEmitter<CampaignSearch>();
  @Output() toClear: EventEmitter<string> = new EventEmitter();

  typeParams:SelectItem[];
  statusParams:SelectItem[];


  constructor(
    private campaignService: CampaignService,
    private log: NGXLogger,
    private translate: TranslateService,
    private modalService: NgbModal,
    private dateUtilService: DateUtilService,private router: Router
  ) {
  }

  ngOnInit() {
    //let c: Campaign = new Campaign();
    //c.name = this.translate.instant('NEW_CAMPAIGN');
    if (!this.searchModel) {
      this.searchModel = {};
    }
      this.statusParams = []; 
      this.statusParams.push({ label: '', value: '' });
      this.statusParams.push({ label: 'ALL', value: 'ALL' });
      this.statusParams.push({ label: 'AWAITING_ACTIVATION', value: 'AWAITING_ACTIVATION' });
      this.statusParams.push({ label: 'ACTIVE', value: 'ACTIVE' });
      this.statusParams.push({ label: 'SUSPENDED', value: 'SUSPENDED' });
      this.statusParams.push({ label: 'CLOSED', value: 'CLOSED' });

      this.typeParams = [];
      this.typeParams.push({ label: '', value: '' });
      this.typeParams.push({label:'ALL', value:'ALL'});
      this.typeParams.push({label:'EXTERNAL', value:'EXTERNAL'});
      this.typeParams.push({label:'INTERNAL', value:'INTERNAL'});

      this.searchModel.status = this.statusParams[1].value;
      this.searchModel.type = this.typeParams[1].value;
      
  }


  /**
   * After Init
   */
  ngAfterViewInit(): void {
  }

  redirectToAddCampaign() {
    this.router.navigate(['addCampain']);
  }
  doClear() {
    this.toClear.emit();
  }


  doFind($event) {
    $event.preventDefault();
    this.searchModelSubmit.emit(this.searchModel);
  } 

  applyDateCheck(): boolean {
    let applyDatecheck = true; 
    // this.log.debug('CAMPAIGN STATUS' + this.campaign.statut + 'APPLY DATE CHECK ? ' + applyDatecheck);
    return applyDatecheck;
  }

  /**
   * pour detecter le changement d'un input (element du fomrmulaire campagne)
   * @param  event de modficiation d'un champ
   */
  onChangeInput($event) {
    this.searchModel.changed = true;
  }
}
