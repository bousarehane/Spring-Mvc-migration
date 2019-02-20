import { AdministrableObject } from "./administrable-object";


 enum TerminalBeanState
{
    ASSIGNED,
    UPDATED,
    AVAILABLE,
    UNDEFINED
}
  
export class TerminalBean extends AdministrableObject{
    selected : boolean;
    assigned : boolean;
    originalState: TerminalBeanState;
    specialState : TerminalBeanState;
    currentState : TerminalBeanState;
    id: string;
    address: string;
    shipTo: string;
    contractStatus :string ;
    subscriptionStatus:string;
    activationDate:Date;
    deactivationDate :Date;
    zipCode:string;
    mccCode:string;
}