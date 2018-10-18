import { AdministrableObject } from './administrable-object';
import { Campaign } from './Campaign';


export class CampaignLevel extends AdministrableObject {
    id: number; 
    campaign_lvl: number; 
    company: Campaign; 
    companyId: string; 
    lvl_desc: string; 
  } 