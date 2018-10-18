/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Message, ConfirmationService, ConfirmDialogModule, SelectItem } from 'primeng/primeng';
import { Campaign } from '../core/models/campaign';
import { NGXLogger } from 'ngx-logger';
import { HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 providers: [NGXLogger] 
})
export class HomeComponent {

  messageKey : string;

  constructor(private cdRef: ChangeDetectorRef, // pour ne pas avoir l'exception ExpressionChangedAfterItHasBeenCheckedError
    private route: ActivatedRoute,
    log: NGXLogger
  ) {
    this.route.params.subscribe( params => {
      log.debug(params);
      if (params) {
        this.messageKey = params.messageKey;
      }
    })

    log.debug("messageKey is " + this.messageKey);
  }



}
