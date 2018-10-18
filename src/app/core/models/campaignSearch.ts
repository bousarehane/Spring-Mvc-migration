/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
export class CampaignSearch {
    id?: string; // id de la limite
    name?: string;
    orgName?: string; // l'id de l'offre
    value?: number; // valeur de la limite (nombre ou montant)
    reference?: string; // chaine de car définissant la limite
    status?: string;
    values?: string;
    dateActivation?: Date;
    dateDesactivation?: Date;
    defaultCampaign?: boolean;
    mediaActive?: number;
    niveau?: number;
    type?: string;
    /** pour designer que la campagne est modifiée par l'utilisteur est n'a pas encore été sauvegardée */
  changed?: boolean;
}
