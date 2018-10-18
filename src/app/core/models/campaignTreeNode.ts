/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */


import { AdministrableObject } from './administrable-object';
import { MediaForCampaign } from './media-for-campaign';


export class CampaignTreeNode extends AdministrableObject {  
    id?: number; 
    name: string; 
    reference: string; 
    status: string;
    type?: CampaignTreeNodeType;
    level: number;
    parentNode: CampaignTreeNode;
    childrenNodes: Array<CampaignTreeNode>;

    isPadding(): boolean {
       
        return this.type == CampaignTreeNodeType.PADDING;
      }

    isTerminal(): boolean {
        
         return this.type == CampaignTreeNodeType.TERMINAL;
       }
    }

