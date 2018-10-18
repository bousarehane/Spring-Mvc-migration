/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Injectable()
export class DateUtilService {

  constructor(private datePipe: DatePipe) { }

  /**
   * @deprecated non i18n, à bannir
   * @param d
   */
  formatDate(d: Date): string {
    return this.datePipe.transform(d, 'yyyy-MM-dd hh:mm');
  }

  /**
   * Normalement inutile : on ne manipule pas les dates en string.
   * @deprecated
   */
  parseToDate(s: string): Date {
    return s == null ? null : new Date(s);
  }

  dateToNgbTime(date: Date): NgbTimeStruct {
    if (date) {
      const m = moment(date);
      return {
        hour: m.hours(),
        minute: m.minutes(),
        second: m.seconds()
      };
    }
  }

  dateToNgbDate(date: Date): NgbDateStruct {
    if (date) {
      const m = moment(date);
      return {
        year: m.year(),
        month: m.month() + 1,
        day: m.date()
      };
    }
  }

  AreNgbDateSame(a: NgbDateStruct, b: NgbDateStruct): boolean {
    if (a === undefined) {
      return b === undefined;
    } else if (b === undefined) {
      return false;
    }
    return a.day === b.day && a.month === b.month && a.year === b.year;
  }

  AreNgbTimeSame(a: NgbTimeStruct, b: NgbTimeStruct): boolean {
    if (a === undefined) {
      return b === undefined;
    } else if (b === undefined) {
      return false;
    }
    return a.hour === b.hour && a.minute === b.minute && a.second === b.second;
  }

  ngbTimeToDate(time: NgbTimeStruct): Date {
    if (time == null || time === undefined) {
      return null;
    }
    let res = moment().hours(time.hour).minutes(time.minute);
    if (time.second !== undefined && time.second != null) {
      res = res.seconds(time.second);
    }
    return res.toDate();
  }

  updateDate(time: NgbDateStruct | NgbTimeStruct, date: Date): Date {
    const dateStruct = <NgbDateStruct>time;
    const timeStruct = <NgbTimeStruct>time;
    let m = moment(date);
    if (dateStruct != null && dateStruct.day !== undefined) {
      m.date(dateStruct.day).month(dateStruct.month - 1).year(dateStruct.year);
    } else if (timeStruct != null && timeStruct.hour !== undefined) {
      m.hours(timeStruct.hour).minute(timeStruct.minute).second(timeStruct.second);
    }
    return m.toDate();
  }

  getDateAtMidnight(date: NgbDateStruct): Date {
    const m = moment().hours(0).minute(0).second(0).millisecond(0);
    return this.updateDate(date, m.toDate());
  }

}
