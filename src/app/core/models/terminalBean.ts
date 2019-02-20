import { AdministrableObject } from "./administrable-object";

export class TerminalBean extends AdministrableObject{
    id: string;
    address: string;
    shipTo: string;
    contractStatus :string ;
    subscriptionStatus:string;
    activationDate :Date;
    deactivationDate :Date;
    zipCode:string;
    mccCode:string;
}