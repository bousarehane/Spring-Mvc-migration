import { NGXLogger } from 'ngx-logger';
import { DateValidatorDirective } from './core/directives/datevalid.directive';
import { MessageService } from 'primeng/components/common/messageservice';
import { HomeComponent } from './home/home.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router'; 
import { ROUTES } from './app.routes';
import { CampaignComponent } from './campaign/campaign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import {
  InputTextModule, ButtonModule, ConfirmDialogModule, DataTableModule, CalendarModule,
  CheckboxModule, TriStateCheckboxModule, ListboxModule, SelectButtonModule, PaginatorModule,
  DropdownModule, FieldsetModule, TabViewModule, PanelModule, TooltipModule, SlideMenuModule, OverlayPanelModule, DataGridModule,
  TreeModule, TreeNode, ContextMenuModule, MenuItem, KeyFilterModule, SplitButtonModule, TreeDragDropService, MultiSelectModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { AdvGrowlModule } from 'primeng-advanced-growl';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n } from './core/services/custom-datepicker-i18n.service';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { CampaignService } from './core/services/campaign.service';
import { CampaignSearchService } from './core/services/campaign-search.service';
import { DateUtilService } from './core/services/date-util.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmDirective, ConfirmModalContent } from './core/directives/confirm.directive';
import { environment } from '../environments/environment.prod';
import { ValidationService } from './core/services/validation.service';
import { StringUtilService } from './core/services/string-util.service';
import { CustomDateParserFormatter } from './core/factories/custom-date-parser-formatter.factory';
import { KeyFilterCustom } from './core/factories/KeyFilterCustom';
import { LogService } from './core/services/log.service';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignSearchComponent } from './campaign-search/campaign-search.component';
import { NotifMessageService } from './core/services/notifmessage.service';
import { CustomDatetimeComponent } from '../shared/datetime/custom-datetime.component';
import { InputValidationComponent } from './input-validation/input-validation.component';
import { CampaignFormComponent } from './campaign-form/campaign-form.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { DetailCompComponent } from './detail-comp/detail-comp.component';
import { DetailMediaComponent } from './detail-media/detail-media.component';
import { DetailComStep0Component } from './detail-com-step0/detail-com-step0.component';
import { StepBarComponent } from './step-bar/step-bar.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { MessagesModule} from 'primeng/primeng';
import { DetailMediaStep0Component } from './detail-media-step0/detail-media-step0.component';
import { HistoriqueCampComponent } from './historique-camp/historique-camp.component';
import {TabMenuModule} from 'primeng/tabmenu';
import { InfoGeneralComponent } from './info-general/info-general.component';
import { TerminalDashboardComponent } from './terminal-dashboard/terminal-dashboard.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// pour intercepter les erreurs , et envoyer l'erreur à l'api log
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logService: LogService) { }
  handleError(error) {
    this.logService.logError(error);
    throw error;
  }
}

@NgModule({
  entryComponents: [
    ConfirmModalContent
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    CampaignComponent,
    ConfirmModalContent,
    ConfirmDirective,
    DateValidatorDirective,
    CampaignListComponent,
    CampaignSearchComponent,
    CustomDatetimeComponent,
    InputValidationComponent,
    CampaignFormComponent,
    CampaignDetailComponent,
    DetailCompComponent,
    DetailMediaComponent,
    DetailComStep0Component,
    StepBarComponent,
    AddMediaComponent,
    DetailMediaStep0Component,
    HistoriqueCampComponent,
    InfoGeneralComponent,
    TerminalDashboardComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    CoreModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule, CustomFormsModule, ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { enableTracing: false }),
    SlideMenuModule, OverlayPanelModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    DataTableModule,
    TableModule,
    CalendarModule,
    TreeModule,
    ContextMenuModule,
    CheckboxModule,
    TriStateCheckboxModule,
    ListboxModule,
    DropdownModule,
    MultiSelectModule,
    FieldsetModule,
    TabViewModule,
    PanelModule,
    AdvGrowlModule,
    TooltipModule,
    DataGridModule,
    SelectButtonModule,
    PaginatorModule,
    KeyFilterModule,
    MessagesModule,
    TabMenuModule,
    SplitButtonModule,
     //  **** here for logger, here you can set levels according to environment
     LoggerModule.forRoot({
      level: environment.log.clientLevelLog,
      serverLogLevel: environment.log.serverLevelLog
    }),
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],

  providers: [
    CampaignService,
    DateUtilService,
    CampaignSearchService,
    StringUtilService,
    MessageService,
    NotifMessageService,
    ValidationService,
    TreeDragDropService,
    LogService,
    {
      provide: NgbDateParserFormatter,
      useFactory: CustomDateParserFormatter,
      deps: [TranslateService]
    },
    {
      provide: NgbDatepickerI18n,
      useClass: CustomDatepickerI18n
    },
    {// pour intercepter les erreurs
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
