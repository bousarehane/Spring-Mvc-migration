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
import { AdvPrimeMessage, AdvGrowlService } from 'primeng-advanced-growl';
import { environment } from '../../../environments/environment.prod';

export type MessageSeverity = 'success' | 'info' | 'warn' | 'error';

@Injectable()
export class NotifMessageService {

    constructor(
        private messageService: AdvGrowlService,
        private log: NGXLogger,
        private translate: TranslateService,
    ) {
    }

    /**
     * Afficher une popup de notification
     * @param title le titre de la popup (traduction prise en charge)
     * @param detail le texte de la popup (traduction prise en charge)
     * @param severity le type de notification (succss, info, warn ou error)
     */
    public notify(title: string, detail: string, severity: MessageSeverity, translateParams?: any, durable: boolean = false): void {
        // on attends la disponibilite des traductions en cours de chargement pour obtenir le titre ...
        let nsummary: string = null;
        let ndetail: string = null;
        if (title) {
            //this.translate.get(title, translateParams).subscribe((value) => {
               // nsummary = value;
                nsummary = title;
                ndetail = detail ? this.translate.instant(detail, translateParams) : '';
                const lifetime = 30000; // 30 socondes
                switch (severity) {
                    case 'info':
                        if (durable) {
                            this.messageService.createTimedInfoMessage(ndetail, nsummary, lifetime);
                        } else {
                            this.messageService.createInfoMessage(ndetail, nsummary);
                        }
                        break;
                    case 'success':
                        if (durable) {
                            this.messageService.createTimedSuccessMessage(ndetail, nsummary, lifetime);
                        } else {
                            this.messageService.createSuccessMessage(ndetail, nsummary);
                        }
                        break;
                    case 'error':
                        if (durable) {
                            this.messageService.createTimedErrorMessage(ndetail, nsummary, lifetime);
                        } else {
                            this.messageService.createErrorMessage(ndetail, nsummary);
                        }
                        break;
                    case 'warn':
                        if (durable) {
                            this.messageService.createTimedWarningMessage(ndetail, nsummary, lifetime);
                        } else {
                            this.messageService.createWarningMessage(ndetail, nsummary);
                        }
                        break;
                    default:
                        this.log.warn(`NotifMessageService.notify(): severity '${severity}' not implemented, using 'info'`);
                        if (durable) {
                            this.messageService.createTimedInfoMessage(ndetail, nsummary, lifetime);
                        } else {
                            this.messageService.createInfoMessage(ndetail, nsummary);
                        }
                        break;
                }
            //});
        } else {
            this.log.error(`notify(...) was called without a title, not notifying.`);
        }
    }

    public clearNotifs(): void {
        this.messageService.clearMessages();
    }

    // -------------------------------------------------------------------
    // Fonctions pratiques
    public notifyInfo(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'info', msgTranslateParams);
    }

    public notifyWarn(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'warn', msgTranslateParams);
    }

    public notifySuccess(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'success', msgTranslateParams);
    }

    public notifyErrorWithoutDetail(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'error', msgTranslateParams);
    }

    public notifyDurableInfo(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'info', msgTranslateParams, true);
    }

    public notifyDurableWarn(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'warn', msgTranslateParams, true);
    }

    public notifyDurableSuccess(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'success', msgTranslateParams, true);
    }

    public notifyDurableErrorWithoutDetail(message: string, msgTranslateParams?: any): void {
        this.notify(message, null, 'error', msgTranslateParams, true);
    }

    /**
     *
     * @param message Une clé de traduction
     * @param apiError l'objet erreur retourné par le client http lors d'un appel vers l'api
     * @param translateParams un tableau associatif contenant les détails pour la traduction.
     * Exemple : {"folderName": "dossier1"}
     */
    public notifyErrorWithDetailFromApi(message: string, apiError: any, translateParams?: any): void {
        if (apiError && apiError.error && apiError.error.errorCode) {
            const msgKey = `API_ERR_${apiError.error.errorCode}`;
            this.notify(message, msgKey, 'error', translateParams);
        } else if (apiError && apiError.status === 403) {
            this.notify(message, 'API_ACCESS_FORBIDDEN', 'error');
        } else {
            this.notifyErrorWithoutDetail(message, translateParams);
        }
    }

    public notifyGenericError(detail?: string, msgTranslateParams?: any): void {
        this.notify('ERROR_GENERIC', detail, 'error', msgTranslateParams);
    }

    public notifyInfoWithActionLink(title: string, linkText: string, linkAction: () => void, translateParams?: any,
        messageLife: number = environment.defaultCancelNotificationLifeTime): void {
        this.translate.get(title, translateParams).subscribe(
            nSummary => {
                const nDetail: string = '<span class="toastAction">' + this.translate.instant(linkText, translateParams) + '</span>';
                this.messageService.createTimedInfoMessage(nDetail, nSummary, messageLife, { action: linkAction });
            }
        );
    }

    public onClick(message: AdvPrimeMessage) {
        if (message.additionalProperties && message.additionalProperties.action) {
            message.additionalProperties.action();
            this.messageService.clearMessages();
        } else {
            this.log.debug('No action to do onclick was provided');
        }
    }
}
