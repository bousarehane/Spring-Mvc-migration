import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Campaign } from '../core/models/campaign';
import { CampaignService } from '../core/services/campaign.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Schedule, Growl, Message } from 'primeng/primeng';
import { TerminalBean } from '../core/models/terminalBean';
import { Subject }    from 'rxjs';
import {
   SelectItem, Column, DataTable
} from 'primeng/primeng';
import { NotifMessageService } from '../core/services/notifmessage.service';

import {LazyLoadEvent} from 'primeng/primeng';
import {FilterMetadata} from 'primeng/primeng';

enum TerminalBeanState
{
    ASSIGNED,
    UPDATED,
    AVAILABLE,
    UNDEFINED
}
@Component({
  selector: 'app-list-available-terminals',
  templateUrl: './list-available-terminals.component.html',
  styleUrls: ['./list-available-terminals.component.css']
})
export class ListAvailableTerminalsComponent implements OnInit, AfterViewInit {
    @Output() listTerminalToAssign: EventEmitter<any[]> = new EventEmitter<any[]>();
  
    @Input() campaign: Campaign;
    @Input() terminals: TerminalBean[];
    @Input() datasource: TerminalBean[];
    filteredRows: TerminalBean[];

    terminalsToBeSelected: TerminalBean[];
    chekedUnAssignTerminal : TerminalBean[];
    
    selectedTerminal: TerminalBean;
    // object used to recieve campaign to delete or to update
    terminal: TerminalBean;
    // error message in case of error
    errorMessage: string;
  
    // result records count
    @Input() totalRecords: number;
    visible: boolean = true;
    available : boolean =true;
    assign : boolean = false;
    unassign : boolean = false;

  
    @ViewChild(('terminalDataTable')) terminalDataTable: DataTable;
  
    constructor(
      private campaignService: CampaignService,
      private router: Router,
      private translateService: TranslateService,
      private notifService: NotifMessageService,
      private log: NGXLogger) {
  
    }
  
    /**
     * ngOnInit
     */
    ngOnInit() {
      this.datasource;
      this.terminals;
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
    if (this.datasource && this.available) {
      this.filteredRows = this.datasource.filter(row => this.filterField(row, event.filters))
      // sort data
      this.filteredRows.sort((a, b) => this.compareField(a, b, event.sortField) * event.sortOrder);
      this.terminals = this.filteredRows.slice(event.first, (event.first + event.rows))
      this.totalRecords = this.filteredRows.length;

    } else if (this.datasource && !this.available) {
      if(this.terminalsToBeSelected && this.terminalsToBeSelected.length > 0 && this.assign && !this.unassign){
        this.checkIfCheckedElement(this.datasource);
        this.terminalsToBeSelected =null;
        this.available =true;
      }
      if(this.chekedUnAssignTerminal && this.chekedUnAssignTerminal.length >0){
        this.checkIfUnassingElement(this.datasource);
        this.chekedUnAssignTerminal = null;
        this.available =true;
      }
        this.filteredRows = this.datasource.filter(row => this.filterField(row, event.filters));
        this.filteredRows.sort((a, b) => this.compareField(a, b, event.sortField) * event.sortOrder);
        this.terminals = this.filteredRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = this.filteredRows.length;

        this.available = true;
    }
   
    
}

    /**
     * updateVisibility
     * @param terminals 
     */
    updateVisibility(terminals , chekedUnAssignTerminal): void {
      this.visible = false;
      this.available =false;
      this.terminals = terminals;
      this.chekedUnAssignTerminal = chekedUnAssignTerminal;
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
sortColumn(event) {
  const tmp = this.datasource.sort((a: any, b: any): number => {
    if (event.field) {
        return a[event.field] > b[event.field] ? 1 : -1;
    }
        });
  if (event.order < 0) {
      tmp.reverse();
  }
  const thisRef = this;
  this.terminals = [];
  tmp.forEach(function (row: any) {
      thisRef.terminals.push(row);
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
 * onTableHeaderCheckboxToggle
 * @param event 
 */
onTableHeaderCheckboxToggle(event: any) {
  this.listTerminalToAssign.emit(this.terminalsToBeSelected);
}

/**
 * onRowSelected
 * @param event 
 */
onRowSelected(event: any){
  this.listTerminalToAssign.emit(this.terminalsToBeSelected);
 }

 /**
  * onRowUnselect
  * @param event 
  */
 onRowUnselect(event) { 
  this.listTerminalToAssign.emit(this.terminalsToBeSelected);
}
 
/**
 * transform
 * @param terminals 
 * @param terminalsToBeSelected 
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
 * checkIfExist
 * @param terminals 
 * @param dataSource 
 */
checkIfExist(terminals, dataSource , event) {
  var maxI = (event.first + event.rows);
  if(terminals.length == 0){
    this.datasource.forEach((terminal, i = event.first) => {
      if (i< maxI) {
          this.datasource = this.datasource.filter(item => item !== terminal);
      }    
    });

  }else{
  var isExist = false;
  dataSource.forEach((elt, i = event.first) => {
    isExist =false;
    if(terminals.length <= maxI && i< terminals.length){
    terminals.forEach((eltJ, j) => {
    if(dataSource[i] == terminals[j]){
      isExist =true;
      return;
    }
  });
  if(!isExist){
    this.datasource = this.datasource.filter(item => item !== dataSource[i]);
  }
  } 
  return;
  });
}
}

checkIfUnassingElement(dataSource) {
  var terminalsUnassignTemp = [];
  var isExist = false;
if(this.chekedUnAssignTerminal){
  this.chekedUnAssignTerminal.forEach((elt, i) => {
    var isExist = false;
    dataSource.forEach((eltJ, j) => {
    if(this.chekedUnAssignTerminal[i].id == dataSource[j].id){
      isExist =true;
      return ;
    }
  });
  if(!isExist){
      terminalsUnassignTemp.push(this.chekedUnAssignTerminal[i]);
  }
  });
  this.setCurrentStateToTerminals(terminalsUnassignTemp);
  dataSource.push(...terminalsUnassignTemp);
}
}

/**
 * setCurrentStateToTerminals
 * @param dataSource 
 */
setCurrentStateToTerminals(dataSource: TerminalBean[]){
  dataSource.forEach((eltJ, j) => {
    dataSource[j].selected =false;
    dataSource[j].assigned = false;
    dataSource[j].currentState = TerminalBeanState.AVAILABLE;
  });
}


  }
  