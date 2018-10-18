/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { CampaignService } from './services/campaign.service';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
    CampaignService,
    DatePipe

    ]
})
export class CoreModule {
}
