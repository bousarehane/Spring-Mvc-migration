/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { Injectable } from '@angular/core';


@Injectable()
export class StringUtilService {

  constructor() { }


  /**
   * retorune la sous chaine du premier index au max (+ '...')
   * @param s : le parmaètre string à tronquer
   * @param max : le max
   */
  getMaxName(s: string): string {
    return this.getMaxString(s, 30);
  }

  /**
   * retorune la sous chaine du premier index au max (+ '...')
   * @param s : le parmaètre string à tronquer
   * @param max : le max
   */
  getMaxString(s: string, max: number): string {
    let result = s;
    if (s.length > max) {
      result = s.substr(0, max) + '...';
    }
    return result;
  }


  /**
   * teste si le contenu d'un objet (et non la reference) : existe dans une table
   * @param arr : table
   * @param obj : element objet de recherche
   */
  contains(arr, obj) {
    const keys = Object.keys(obj);
    const transformedValueObj = this.transformValue(keys, obj);
    return arr.some(item => this.transformValue(keys, item) === transformedValueObj);
  }

  private transformValue(keys, objet) {
    let s = '';
    keys.forEach(element => {
      s = s + `"${element}":"${objet[element]}";`
    });
    return s;
  }

}
