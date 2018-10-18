/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms/forms';

@Injectable()
export class ValidationService {

    constructor(private log: NGXLogger,) { }

    /**
     * pour afficher les messages retournés par l'api rest en cas d'erreur
     * avec des messages specifiques à un ou pusieurs champs
     * dans html il faut ajouter
     <div *ngIf="name.errors.invalidCheck" translate>
        {{name.errors.message}}
     </div>

     ou

     <div *ngIf="editForm.controls['name'].errors.invalidCheck" translate>
         {{name.errors.message}}
    </div>
     * @param form : la NGForm (pour recuperer le champ et lui ajouter l'erreur)
     * @param err : l'erreur envoyee par l'api rest 
     */
    updateControlsValidation(form: NgForm, err: HttpErrorResponse) {
        let messageMap: Map<string, Array<string>> = new Map();
        if (err.status === 400) {
            if (err != null && err.error != null) {
                const errors = err.error.details;
                this.log.error(JSON.stringify(errors));
                if (errors != null && errors.length > 0) {
                    for (const error of errors) {
                        let field = error.field;
                        // const message = error.defaultMessage;
                        const message = error.message;
                        if (field == null || field === '') {
                            field = 'global_form_message';
                        }
                        if (messageMap.has(field)) {
                            messageMap.get(field).push(message);
                        } else {
                            messageMap.set(field, [message]);
                        }

                        form.controls[field].setErrors({ 'invalidCheck': true, message: messageMap.get(field) });

                    }
                }
            }
        }
    }
}