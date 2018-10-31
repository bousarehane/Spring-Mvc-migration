import { Component, OnInit, Input } from '@angular/core';
import { TerminalBean } from '../core/models/terminalBean';
import { Campaign } from '../core/models/campaign';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terminal-dashboard',
  templateUrl: './terminal-dashboard.component.html',
  styleUrls: ['./terminal-dashboard.component.css']
})
export class TerminalDashboardComponent implements OnInit {

@Input() terminalsListElements: Array<any>;


  constructor(
    private translateService: TranslateService

  ) { 
    this.terminalsListElements
    
  } 

  
  private datePattern: string;
  private datePatternFull: string;
  ngOnInit() {
    this.terminalsListElements; 
    this.translateService.get('DATE_FILTER_FORMAT').subscribe(
      pattern => this.datePattern = pattern
    );
    this.translateService.get('DATE_FILTER_FORMAT_FULL').subscribe(
      pattern => this.datePatternFull = pattern
    );
  }

}
