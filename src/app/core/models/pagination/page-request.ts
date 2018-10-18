/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
/**
 * Cet objet contient l'ensemble des paramètres de pagination utilisé dans les Webhooks
 */
export class PageRequest {
    /**
     * Numéro de page
     */
    pageNumber?: number;
    readonly pageNumberParamName = 'page';

    /**
     * Taille de page, valeur par défaut dépendant du serveur
     */
    pageSize?: number;
    readonly pageSizeParamName = 'size';
    /**
     * Tri ascendant : exemples :
     * - sort=attr1,attr2 : tri ascendant sur la propriété attr1 puis attr2
     * - sort=attr1,attr2;desc=attr3 : tri ascendant sur la propriété attr1 puis attr2, puis tri descendant sur attr3
     */
    sort?: string;
    readonly sortParamName = 'sort';
    /**
     * Tri descendant : exemples :
     * - desc=attr1,attr2 : tri descendant sur la propriété attr1 puis attr2
     * - desc=attr1,attr2;asc=attr3 : tri descendant sur la propriété attr1 puis attr2, puis tri ascendant sur attr3
     */
    desc?: string;
    readonly descParamName = 'desc';

    constructor (pageSize: number){
        this.pageSize = pageSize;
    }
}