import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, ViewChildren ,AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import { TerminalBean } from '../core/models/terminalBean';

import {
   SelectItem, Column, DataTable
} from 'primeng/primeng';
import { NotifMessageService } from '../core/services/notifmessage.service';

import {LazyLoadEvent} from 'primeng/primeng';
import {FilterMetadata} from 'primeng/primeng';
import {CalendarModule} from 'primeng/calendar';

enum TerminalBeanState
{
    ASSIGNED,
    UPDATED,
    AVAILABLE,
    UNDEFINED
}
@Component({
  selector: 'app-list-assign-terminals',
  templateUrl: './list-assign-terminals.component.html',
  styleUrls: ['./list-assign-terminals.component.css']
})
export class ListAssignTerminalsComponent implements OnInit, AfterViewInit {
  
    @Input() campaign: Campaign;
    @Output() listTerminalToUnAssign: EventEmitter<TerminalBean[]> = new EventEmitter<TerminalBean[]>();

    value: Date;
    value1: Date;
    @Input() terminals: TerminalBean[];
    @Input() datasource: TerminalBean[];
    filteredRows: TerminalBean[];

    eventElement: LazyLoadEvent;

    terminalsToBeSelected: TerminalBean[];
    chekedAssignTerminal : TerminalBean[];
    
    selectedTerminal: TerminalBean;
    // object used to recieve campaign to delete or to update
    terminal: TerminalBean;
    // error message in case of error
    errorMessage: string;
  
    // result records count
    @Input() totalRecords: number;

    @ViewChild(('terminalDataTable')) terminalDataTable: DataTable;

    @ViewChildren('dateActivation') dateActivation;

    @ViewChildren('deactivationDate') deactivationDate;


    private datePattern: string;

    private datePatternFull: string;
    
    visible: boolean = true;
    available : boolean =true;
    assign : boolean = false;
    unassign : boolean = false
    activateDateBoolean =false;
    deactivateDateBoolean=false;
    testIfLazyLoad: boolean = false;
  
    constructor(
      private campaignService: CampaignService,
      private router: Router,
      private translateService: TranslateService,
      private notifService: NotifMessageService,
      private log: NGXLogger) {
        this.testIfLazyLoad = false; 
    }
/**
 * ngOnInit
 */
  
    ngOnInit() {

    }
   
    /**
     * ngAfterViewInit
     */
    ngAfterViewInit(): void {
      
    } 
    

    /**
     * loadterminalLazy
     * @param event 
     */
  loadterminalLazy(event: LazyLoadEvent) {
     if (this.datasource && !this.available) {
      if(this.chekedAssignTerminal && this.chekedAssignTerminal.length>0){
        this.checkIfAssingElement(this.datasource);
        this.chekedAssignTerminal=null;
        this.available =true;
       }
        if(this.terminalsToBeSelected && this.terminalsToBeSelected.length > 0 && !this.assign && this.unassign){
          this.checkIfCheckedElement(this.datasource);
          this.terminalsToBeSelected =null;
          this.available =true;
       }
        // sort data
        //this.sortColumn("activationDate");
        this.filteredRows = this.datasource.filter(row => this.filterField(row, event.filters));
        this.terminals = this.filteredRows.slice(event.first, (event.first + event.rows))
        this.totalRecords = this.filteredRows.length;
        } else if (this.datasource && this.available) {
          //this.sortColumn("activationDate");
          this.filteredRows = this.datasource.filter(row => this.filterField(row, event.filters));
          this.terminals = this.filteredRows.slice(event.first, (event.first + event.rows));
          this.totalRecords = this.filteredRows.length;
          
          this.available = true;
      }
      this.eventElement =event;
      this.activateDateBoolean = false;
      this.deactivateDateBoolean = false;    
     }

      /**
     * updateVisibility
     * @param terminals 
     */
    updateVisibility(terminals , chekedAssignTerminal): void {
      this.visible = false;
      this.available =false;
      this.terminals = terminals;
      this.chekedAssignTerminal = chekedAssignTerminal;
      setTimeout(() => this.visible = true, 0);
  }

  /**
   * updateVisibilityPrime
   */
  updateVisibilityPrime(): void {
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
}

/**
 * sortColumn
 * @param event 
 */
sortColumn(field) {

  this.filteredRows = [];
  const tmp = this.datasource.sort((a: any, b: any): number => {
    if (field) {
        return a[field] > b[field] ? 1 : -1;
    }
        });
  const thisRef = this;
  tmp.forEach(function (row: any) {
      thisRef.filteredRows.push(row);
  });
}

/**
 * sortColumnGlobal
 * @param field 
 */
sortColumnGlobal(field , dataSource , filteredRows) {
  
    this.filteredRows = [];
    const tmp = dataSource.sort((a: any, b: any): number => {
      if (field) {
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1;
      }
          });
    filteredRows = [];
    tmp.forEach(function (row: any) {
        filteredRows.push(row);
    });
  }

/**
 * filterField
 * @param row 
 * @param filter 
 */
filterField(row, filter) {
  let isInFilter = false;
  let noFilter = true;

  for (var columnName in filter) {
    if (row[columnName] == null) {
      return;
    }
    noFilter = false;
    let rowValue: String = row[columnName].toString().toLowerCase();
    let filterMatchMode: String = filter[columnName].matchMode;
    if (filterMatchMode.includes("contains") && rowValue.includes(filter[columnName].value.toLowerCase())) {
      isInFilter = true;
    } else if (filterMatchMode.includes("startsWith") && rowValue.startsWith(filter[columnName].value.toLowerCase())) {
      isInFilter = true;
    } else if (filterMatchMode.includes("in") && filter[columnName].value.includes(rowValue)) {
      isInFilter = true;
    }
  }
  if (noFilter) { isInFilter = true; }
  return isInFilter;
}

/**
 * compareField
 * @param rowA 
 * @param rowB 
 * @param field 
 */
compareField(rowA, rowB, field: string): number {
  if (rowA[field] == null) return 1; // on considère les éléments null les plus petits
  if (typeof rowA[field] === 'string') {
    return rowA[field].localeCompare(rowB[field]);
  }
  if (typeof rowA[field] === 'number') {
    if (rowA[field] > rowB[field]) return 1;
    else return -1;
  }
}


/**
 * onChangeInput
 * @param  
 */
onChangeInput($event) {
  
}

/**
 * openCalendarActivationDate
 * @param event 
 */
openCalendarActivationDate(index:number){
  setTimeout(() => {
    var indexTemp ;           
    if(this.eventElement){
      indexTemp = index - this.eventElement.first;
    }else {
      indexTemp = index;
    }
    this.dateActivation._results[indexTemp].showOverlay(this.dateActivation._results[indexTemp].nativeElement);
  }, 0);
}

/**
 * openCalendarDeactivationDate
 * @param event 
 */
openCalendarDeactivationDate(index:number) {
  setTimeout(() => {
    var indexTemp ;           
    if(this.eventElement){
      indexTemp = index - this.eventElement.first;
    }else {
      indexTemp = index;
    }
    this.deactivationDate._results[indexTemp].showOverlay(this.deactivationDate._results[indexTemp].nativeElement);
  }, 0);
}

/**
 * onTableHeaderCheckboxToggle
 * @param event 
 */
onTableHeaderCheckboxToggle(event: any) {
  this.listTerminalToUnAssign.emit(this.terminalsToBeSelected);
}

/**
 * onRowSelected
 * @param event 
 */
onRowSelected(event: any){
  this.listTerminalToUnAssign.emit(this.terminalsToBeSelected);
 }

 /**
  * onRowUnselect
  * @param event 
  */
 onRowUnselect(event) { 
  this.listTerminalToUnAssign.emit(this.terminalsToBeSelected);
}


/**
 * transform
 * @param terminals 
 * @param terminalsToBeSelected 
 */
checkIfAssingElement(dataSource) {
  var terminalsUnassignTemp = [];
  var isExist = false;
if(this.chekedAssignTerminal){
  this.chekedAssignTerminal.forEach((elt, i) => {
    var isExist = false;
    dataSource.forEach((eltJ, j) => {
    if(this.chekedAssignTerminal[i].id == dataSource[j].id){
      isExist =true;
      return ;
    }
  });
  if(!isExist){
      terminalsUnassignTemp.push(this.chekedAssignTerminal[i]);
  }
  });
  terminalsUnassignTemp.forEach((terminal, index) => {
    if(terminal.activationDate && terminal.activationDate != null){
      terminal.activationDate =new Date(terminal.activationDate) ; 
    }
    if(terminal.deactivationDate && terminal.deactivationDate != null){
      terminal.deactivationDate =new Date(terminal.deactivationDate) ;
    }
  });
  this.setCurrentStateToTerminals(terminalsUnassignTemp);
  dataSource.push(...terminalsUnassignTemp);
}
}
/**
 * checkIfCheckedElement
 * @param dataSource 
 */
checkIfCheckedElement(dataSource) {
  var isExist = false;
  this.terminalsToBeSelected.forEach((elt, i) => {
    dataSource.forEach((eltJ, j) => {
    if(this.terminalsToBeSelected[i] == dataSource[j]){
      this.datasource = this.datasource.filter(item => item !== this.terminalsToBeSelected[i]);
    }
  });
  });
}

/**
 * setCurrentStateToTerminals
 * @param dataSource 
 */
setCurrentStateToTerminals(dataSource: TerminalBean[]){
  dataSource.forEach((eltJ, j) => {
    dataSource[j].selected =false;
    dataSource[j].assigned = true;
    dataSource[j].currentState = TerminalBeanState.ASSIGNED;
  });
}

}
  