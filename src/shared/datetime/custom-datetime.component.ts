/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { NGXLogger } from 'ngx-logger';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Component, forwardRef, Input } from '@angular/core';
// Pour ngmodel
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { DateUtilService } from '../../app/core/services/date-util.service';


@Component({
    selector: 'app-datetime',
    templateUrl: './custom-datetime.component.html',
    styleUrls: ['./custom-datetime.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomDatetimeComponent),
            multi: true
        }
    ]
})
export class CustomDatetimeComponent implements ControlValueAccessor {

    protected date: Date;
    private onChange = (_) => { };
    private _dpDate: NgbDateStruct;
    private _dpTime: NgbTimeStruct;
    @Input()
    disabled: boolean;

    constructor(
        private log: NGXLogger,
        private dateUtilService: DateUtilService
    ) {
    }

    writeValue(obj: any): void {
        this.date = <Date>obj;
    }

    /**
     * Set the function to be called when the control receives a change event.
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    /**
     * Set the function to be called when the control receives a touch event.
     */
    registerOnTouched(fn: any): void {

    }

    get dpDate() {
        if (this.date) {
            // On doit feinter le angular watch pour eviter les boucles infinies \o/
            let newVal = this.dateUtilService.dateToNgbDate(this.date);
            if (!this.dateUtilService.AreNgbDateSame(newVal, this._dpDate)) {
                this._dpDate = newVal;
            }
            return this._dpDate;
        } else {
            return null;
        }
    }
    set dpDate(ngbDate: NgbDateStruct) {
        if (ngbDate != undefined) {
            if (this.date) {
                this.date = this.dateUtilService.updateDate(ngbDate, this.date);
            } else {
                this.date = this.dateUtilService.getDateAtMidnight(ngbDate);
            }
        } else {
            this.date = undefined;
        }
        this.onChange(this.date);
    }

    get dpTime(): NgbTimeStruct {
        let newVal = this.dateUtilService.dateToNgbTime(this.date);
        if (!this.dateUtilService.AreNgbTimeSame(newVal, this._dpTime)) {
            this._dpTime = newVal;
        }
        return this._dpTime;
    }

    set dpTime(ngbTime: NgbTimeStruct) {
        if (this.date) {
            this.date = this.dateUtilService.updateDate(ngbTime, this.date);
            this.onChange(this.date);
        }
    }
}