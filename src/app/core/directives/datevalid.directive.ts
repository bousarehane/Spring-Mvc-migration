/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { NG_ASYNC_VALIDATORS, ValidatorFn, Validator, AbstractControl, NgModel } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { DateUtilService } from 'app/core/services/date-util.service';
import { Observable } from 'rxjs/Observable';

/**
 * Vérifie si une date est valide
 * @param date la date à vérifier
 * @param dateReference la date à laquelle on compare la date à vérifier, par défaut date actuelle.
 * @param mustBeBefore si vrai, la date 'date' doit être avant la date 'dateReference' pour que la validation soit OK.
 */
export function dateValidator(date: Date, dateReference?: Date, mustBeBeforeDateRef: boolean = false): ValidatorFn {
    let momentCheck = moment(date);
    let momentRef = dateReference ? moment(dateReference) : moment();
    return (control: AbstractControl): { [key: string]: any } => {
        if (!momentCheck.isAfter(momentRef)) {
            return mustBeBeforeDateRef ? null : { 'checkDateValid': 'tooEarly' };
        } else {
            return mustBeBeforeDateRef ? { 'checkDateValid': 'tooLate' } : null;
        }
    };
}

@Directive({
    selector: '[checkDateValid]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: DateValidatorDirective, multi: true }]
})
export class DateValidatorDirective implements Validator {
    @Input() dateToCheck: Date;
    @Input() dateReference: NgModel;
    @Input() mustBeBeforeDateRef: boolean;
    /**
     * appliquer la validation ou non ? par fdefaut true ;
     * exemple : si la campagne est diffusée cette validation ne doit pas etre appliquee
     */
    @Input() applyDateCheck: boolean = true;

    validate(control: AbstractControl): Observable<{ [key: string]: any }> {
        if (!this.applyDateCheck) {
            return Observable.empty();
        }

        let dateRefObs: Observable<Date>;
        const dateToCheck = this.dateToCheck ? this.dateToCheck : control.value;



        if (this.dateReference) {
            // On vérifie la date en fonction d'un autre champs du formulaire.

            // On souscrit à l'observable de changement de valeur pour vérifier la bonne valeur (MSTSOFTAST-310)
            // Le take(1) permet de clore l'observable après 1 changement de valeur (appel à la méthode complete coté subscriber)
            let referenceChangeObs = this.dateReference.valueChanges.take(1);
            // On souscrit également à l'observable de changement de la valeur du champ qu'on contrôle ici.
            // L'idée est que si c'est ce champ qui change de valeur en premier,
            // l'appel à cette directive a été déclenché par une modification de ce champ.
            // Sinon c'est le champs "dateReference" qui a été modifié
            // La partie mergeMap permet d'envoyer la date de référence et non la date du champs controlé
            let valueChangeObs = control.valueChanges.take(1).mergeMap(() => Observable.of(this.dateReference.model));
            dateRefObs = Observable.race(referenceChangeObs, valueChangeObs);
        } else {
            dateRefObs = Observable.of(null);
        }

        return dateRefObs.mergeMap(dateRef => {
            if (dateToCheck) {
                let res = dateValidator(dateToCheck, dateRef, this.mustBeBeforeDateRef)(control);
                return Observable.of(res).take(1);
            } else {
                return Observable.empty();
            }
        });
    }
}
