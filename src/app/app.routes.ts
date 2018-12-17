/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { HomeComponent } from './home/home.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CampaignSearchComponent } from './campaign-search/campaign-search.component';
import { CampaignFormComponent } from './campaign-form/campaign-form.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { DetailMediaComponent } from './detail-media/detail-media.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { HistoriqueCampComponent } from './historique-camp/historique-camp.component';
import { InfoGeneralComponent } from './info-general/info-general.component';
import { CampaignUpdateComponent } from './campaign-update/campaign-update.component';
import { InfoGeneralMediaComponent } from './info-general-media/info-general-media.component';

import { Routes } from '@angular/router';


export const ROUTES: Routes = [
    { path: '', redirectTo: '/searchCampaign', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'searchCampaign', component: CampaignSearchComponent},
    { path: 'addCampain', component: CampaignFormComponent },
    { path: 'detailCampaign', component: CampaignDetailComponent },
    { path: 'detailCampaign/:reference', component: CampaignDetailComponent },
    { path: 'detailMedia', component: DetailMediaComponent },
    { path: 'addMedia', component: AddMediaComponent },
    { path: 'historiqueCmp', component: HistoriqueCampComponent },
    { path: 'infoGeneralCmp', component: InfoGeneralComponent },
    { path: 'updateCampaign', component: CampaignUpdateComponent },
    { path: 'infoGeneralMedia', component: InfoGeneralMediaComponent },
    
    
];

