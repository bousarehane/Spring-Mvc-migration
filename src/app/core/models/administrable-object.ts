/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import * as moment from 'moment';

export class AdministrableObject {
    name: string;
    creationDate?: Date;
    authorUsername?: string; // user name
    lastModificationDate?: Date;
    lastModificatorUsername?: string; // user name
}
