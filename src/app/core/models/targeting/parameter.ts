/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
export type ParameterType = 'STRING' | 'NUMBER' | 'FLOAT' | 'BOOLEAN' | 'MAP' | 'DATE' | 'BIGDECIMAL';

export class Parameter {

    name: string;
    type: ParameterType;
    value: any;
    multiple: boolean = false;

    constructor(
        name: string,
        type: ParameterType,
        value: any,
        multiple: boolean = false
    ) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.multiple = multiple;
    }
}