/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
// classe qui contient la clé d'un paramètre , et sa valeur selon son type
export class ParamValue {

  paramId: string; // l'identifiant du paramètre
  paramType: string; // string , number , boolean , date
  multiple: boolean;
  stringValue?: string; // valeur si type string
  numberValue?: number; // valeur su type number
  dateValue?: Date; // valeur si type date
  booleanValue?: boolean; // valeur si type boolean
  stringListValue?: Array<string>; // liste des valeurs string
  numberListValue?: Array<number>; // liste des valeurs number

}
