/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import {AfterViewChecked, ViewEncapsulation, ChangeDetectorRef, Component, OnInit, OnDestroy} from "@angular/core";
import {environment} from "../environments/environment.prod";
import {TranslateService} from "@ngx-translate/core";
import { Subscription } from "rxjs/Subscription";
import { NotifMessageService } from './core/services/notifmessage.service';
import { AdvPrimeMessage } from 'primeng-advanced-growl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'vas-adv Campaign';

  // save the subscription to unsubscribe at the end of the application ...
  private securityEvents : Subscription = null;
  
  constructor(
    private translateService: TranslateService,
    private notifService: NotifMessageService) {
  }

      ngOnInit(): void {
      
        let languageKeys = environment.languages.map(language => {
           return language.key;
        });
        this.translateService.addLangs(languageKeys);
        this.translateService.setDefaultLang(environment.defaultLanguage);
        this.translateService.use(environment.defaultLanguage);
      }
      
      ngOnDestroy() : void {
          if (this.securityEvents) {
              this.securityEvents.unsubscribe();
          }
      }

      growlClicked(message: AdvPrimeMessage) {
        this.notifService.onClick(message);
    }

}
