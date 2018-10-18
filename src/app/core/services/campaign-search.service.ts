/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { Injectable } from "@angular/core";
import { CampaignService } from "../../core/services/campaign.service";
import { NGXLogger } from "ngx-logger";
import { Page } from "../../core/models/pagination/page";
import { Campaign } from "../../core/models/campaign";
import { CampaignSearch } from "../../core/models/campaignSearch";
import { environment } from "../../../environments/environment.prod";

@Injectable()
export class CampaignSearchService {

    // injection du service http
    constructor(
        private campaignService: CampaignService,
        private log: NGXLogger
    ) {
    }

    private _totalRecords: number;
    get totalRecords(): number {
        return this._totalRecords;
    }

    private _pageSize: number = environment.pagination.defaultPageSize;
    pageSize: number = environment.pagination.defaultPageSize;
   /* get pageSize(): number {
        return this._pageSize;
    }*/

    currentPage: number = 1;
    searchModel: CampaignSearch = {};

     _campaigns: Array<Campaign> = [];
    get campaigns(): Array<Campaign> {
        return this._campaigns;
    }

    private _campaignsTobeSorted: Array<Campaign> = [];
    get campaignsToBeSorted(): Array<Campaign> {
        return this._campaignsTobeSorted;
    }

    launchSearch() {
        this.currentPage = 1;
        this.searchWithPagination();
        this.searchAll();
    }

    searchWithPagination() {
        this._campaigns = [];
        this.campaignService.getCampaignsByCriteriaPagination(this.searchModel, this.currentPage - 1, this.pageSize)
            .subscribe(
            (page: Page<Campaign>) => {
                this._campaigns = page.content;
                this._totalRecords = page.totalElements;
            },
            err => { this.log.error(err); }
            );
    }

    searchWithPaginationPrime(campaignsTemp: Campaign[]) {
        this._campaigns = [];
        this.campaignService.getCampaignsByCriteriaPagination(this.searchModel, this.currentPage - 1, this.pageSize)
            .subscribe(
            (page: Page<Campaign>) => {
                if (campaignsTemp !== undefined || campaignsTemp.length > 0) {
                    this._campaigns = campaignsTemp;
                    this._totalRecords = page.totalElements
                    return;
                }
                this._campaigns = page.content;
                this._totalRecords = page.totalElements;
            },
            err => { this.log.error(err); }
            );
    }
    
    searchAll() {
        this._campaignsTobeSorted = [];
        this.campaignService.getCampaignsByCreateria(this.searchModel)
        .subscribe(
            (campaigns: Array<Campaign>) => {
                this._campaignsTobeSorted = campaigns;
            },
            err => { this.log.error(err); }
            );
        
      
    }
    clearSearch() {
        this.searchModel = {};
        this._campaigns = [];
    }

    /**
 * Fonction à appeler si la campagne campaign a été modifiée pour la raffraichir dans la liste
 * @param campaign
 */
    public refreshCampaign(campaign: Campaign): void {
        this._campaigns = this._campaigns.map(
            c => (c.id === campaign.id) ? campaign : c
        );
    }

    /**
     * Fonction à appeler pour notifier ce service de la suppression d'une campagne
     * @param campaignId
     */
    public campaignWasDeleted(campaignId: string): void {
        this._campaigns = this.campaigns.filter(
            c => c.id !== campaignId
        );
    }
}
