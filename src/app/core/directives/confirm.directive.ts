/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { Component, Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-content',
    template: `
        <div class="modal-header">
          <h6 class="modal-title" translate>DIALOGS_CONFIRMATION</h6>
          <button type="button" class="close" aria-label="Close" (click)="activeModal.close(false)">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" [innerHTML]="contentMessageKey | translate:translateParams">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="activeModal.close(true)" translate>DIALOGS_YES</button>
            <button type="button" class="btn btn-secondary" (click)="activeModal.close(false)" translate>DIALOGS_NO</button>
        </div>
    `
})
export class ConfirmModalContent {

    contentMessageKey: string;
    translateParams: any;

    constructor(public activeModal: NgbActiveModal) {
    }
}

@Directive({
    selector: '[confirm]'
})

export class ConfirmDirective {
    /** Clé i18n de message à afficher dans la popup de confirmation */
    @Input() confirmMessage: string;

    /** Le cas échéant, paramètres supplémentaires pour l'i18n */
    @Input() translateParams: any;

    /**
     * Si vrai, on court-circuite la demande de confirmation.
     * Utile pour les liens où la confirmation n'est pas systématiquement nécessaire
     */
    @Input() skipConfirm: boolean = false;

    @Output() clickConfirmed = new EventEmitter();

    constructor(private modalService: NgbModal) {
    }

    @HostListener('click') onClick() {
        if (this.skipConfirm) {
            this.clickConfirmed.emit();
        } else {
            const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.contentMessageKey = this.confirmMessage;
            modalRef.componentInstance.translateParams = this.translateParams;
            modalRef.result.then(
                (result) => {
                    if (result) {
                        // The user clicked on the "Yes" button
                        this.clickConfirmed.emit();
                    }
                },
                (reason) => {
                    // The modal was dismissed : we do nothing
                }
            );
        }
    }
}
