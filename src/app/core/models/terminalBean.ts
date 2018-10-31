import { AdministrableObject } from "./administrable-object";

export class TerminalBean extends AdministrableObject{
    id: string;
    address: string;
    shipTo: string;
    contractStatus :string ;
    subscriptionStatus:string;
    activationDate:string;
    deactivationDate :string;
    zipCode:string;
    mccCode:string;
}