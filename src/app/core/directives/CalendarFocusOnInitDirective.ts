import { NG_ASYNC_VALIDATORS, ValidatorFn, Validator, AbstractControl, NgModel } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import {
    Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild,
    ChangeDetectorRef, TemplateRef, forwardRef, ViewChildren, QueryList , AfterViewChecked, ElementRef
  } from '@angular/core';

@Directive({
    selector: "[jflCalendarFocusOnInit]"
})
export class CalendarFocusOnInitDirective implements AfterViewInit {

    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit() {
        window.setTimeout(() =>
            this.elementRef.nativeElement.children[0].children[1].click()
        );
    }}