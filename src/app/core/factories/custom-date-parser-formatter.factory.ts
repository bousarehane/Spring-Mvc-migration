/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";

import * as moment from "moment";

export class CustomDateParserFormatterImpl extends NgbDateParserFormatter {
    constructor(private translateService: TranslateService) {
        super();
    }

    format(date: NgbDateStruct): string {
        if (date == null) {
            return '';
        }
        let d = moment({
            year: date.year,
            month: date.month - 1,
            date: date.day
        });
        return d.isValid() ? d.format(this.translateService.instant('DATE_PICKER_FORMAT')) : '';
    }

    parse(value: string): NgbDateStruct {
        if (!value) {
            return null;
        }
        let d = moment(value, this.translateService.instant('DATE_PICKER_FORMAT'));
        return d.isValid() ? {
            year: d.year(),
            month: d.month() + 1,
            day: d.date()
        } : null;
    }
}

export function CustomDateParserFormatter(translateService: TranslateService) {
    return new CustomDateParserFormatterImpl(translateService);
}
