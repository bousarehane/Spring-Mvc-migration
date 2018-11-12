/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */


import { AdministrableObject } from './administrable-object';
import { CampaignLevel } from './campaign-level';
import { MediaForCampaign } from './media-for-campaign';
import { CampaignTree } from './campaignTree';
import { MediaBean } from './MediaBean';



export type CampaignStatus = 'AWAITING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export type CampaignTreeNodeType = 'CAMPAIGN' | 'MEDIA' | 'PADDING' | 'TERMINAL';

export type CampaignTreeNodeStatus = 'FOLD' | 'UNFOLD' | 'UNDEFINED';

export class CampaignsChangeStatus {
  campaignIds: Array<string>;
  status: CampaignStatus;
  constructor(campaignIds: Array<string>, status: CampaignStatus) {
    this.campaignIds = campaignIds;
    this.status = status;
  }
}
export class Campaign extends AdministrableObject {
  id?: string; 
  organizationName: string; 
  value: number; 
  reference: string;
  status?: CampaignStatus;
  activationDate: Date;
  deactivationDate: Date;
  defaultCampaign: boolean;
  type: string;
  mediaActive: number;
  niveau: number;
  changed?: boolean;
  level: any; 
  theAcceptanceMediaForCampaigns: Array<MediaForCampaign>;
  merchantReference: string;
  playlistVersion: string;
  nbTerminal: number;
  nbPicture: number;
  advertisingCategoryCode: string;
  comment: string;
  displayMerchantReference: boolean;
  displayDefaultCampaign: boolean;
  availableCampaignLevels: Array<any>;
  displayPopup: boolean;
  campaignTree: CampaignTree;
  pictureAmount:number;
  terminalAmount:number;
  defaultCampaignValue:string;
  createdBy:string;
  updatedBy:string;
  updateDate:Date;
  creationDate:Date;
  lastUpdatedBy:string;
  lastUpdatedDate:Date;
  playlistLocation:string;
  deactivationReason?: string;
  medias?: Array<MediaBean>;
}

