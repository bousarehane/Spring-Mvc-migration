/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import {Injectable} from "@angular/core";
import {NgbDatepickerI18n} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    readonly dayKeys = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    readonly monthKeys = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    constructor(private translateService: TranslateService) {
        super();
    }

    getWeekdayShortName(weekday: number): string {
        return this.translateService.instant('DATE_PICKER_DAY_SHORT_' + this.dayKeys[weekday - 1]);
    }

    getMonthShortName(month: number): string {
        return this.translateService.instant('DATE_PICKER_MONTH_SHORT_' + this.monthKeys[month - 1]);
    }

    getMonthFullName(month: number): string {
        return this.translateService.instant('DATE_PICKER_MONTH_FULL_' + this.monthKeys[month - 1]);
    }
}
