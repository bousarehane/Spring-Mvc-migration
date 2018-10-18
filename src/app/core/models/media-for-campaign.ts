
import { AdministrableObject } from './administrable-object';
import { Campaign } from './Campaign';
export class MediaForCampaign extends AdministrableObject {
    id: string; 
    mediaRef: string; 
    mediaLocation: string; 
    mimeType: string;
    mediaWidth: number;
    mediaHeight: number;
    mediaSize: number;
    orderSequence: number;
    timeDisplay: number;
    colorDepth: String;
    acceptanceCampaign: Campaign;
  }
  