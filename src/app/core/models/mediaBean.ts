
import { AdministrableObject } from './administrable-object';
import { Campaign } from './Campaign';
export class MediaBean extends AdministrableObject {
    id: string; 
    reference: string; 
    orderSequence: number;
    displayTime: number;
    sourceFile: string;
    location: string;
    type: string;
    status: string;
    dimension: string;
    size: number;
    displaySize: number;
    colourDepth: number;
    comment: string;
    lastUpdatedBy: string
    lastUpdatedDate: Date;
    height:number;
    width:number;
    deactivationReason?: string;
  }