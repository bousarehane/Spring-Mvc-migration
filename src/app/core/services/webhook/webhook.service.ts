/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { Page } from '../../../core/models/pagination/page';
import { PageRequest } from '../../../core/models/pagination/page-request';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NGXLogger } from 'ngx-logger';
import { SelectionResult } from '../../../core/models/selectionResult';

/**
 * Le modèle de données renvoyé par un webhook.
 */
export class WebhookData {
    /**
     * L'identifiant unique de la donnée
     */
    id: string;
    /**
     * Le libellé court de la donnée (nom)
     */
    shortLabel: string;
    /**
     * Le libellé long de la donnée (description)
     */
    longLabel: string;
}

export class WebhookClient<T extends WebhookData> {

    constructor(
        readonly baseUrl: string,
        protected http: HttpClient,
        protected log: NGXLogger
    ) {
    }

    /**
     * Recupère l'objet d'id id auprès du webhook
     * @param id 
     */
    public retrieveOne(id: string): Observable<T> {
        let url = `${this.baseUrl}/${id}`;
        this.log.debug(`retrieveOne(${id}): calling url [${url}]`);
        return this.http.get<T>(url);
    }

    protected getPaginationQueryString(p: PageRequest, separator: string): string {
        let res: string = '';
        if (p) {
            if (p.pageNumber !== undefined) {
                res += `${separator}${p.pageNumberParamName}=${p.pageNumber}`;
                separator = '&';
            }
            if (p.pageSize !== undefined) {
                res += `${separator}${p.pageSizeParamName}=${p.pageSize}`;
                separator = '&';
            }
            if (p.sort !== undefined) {
                res += `${separator}${p.sortParamName}=${p.sort}`;
                separator = '&';
            }
            if (p.desc !== undefined) {
                res += `${separator}${p.descParamName}=${p.desc}`;
                separator = '&';
            }
        }
        return res;
    }

    /**
     * Récupère tous les objets auprès du webhook, en utilisant la pagination.
     * @param pageParam paramètres de pagination et tris
     */
    public retrieveAll(pageParam: PageRequest): Observable<Page<T>> {
        let url = this.baseUrl + this.getPaginationQueryString(pageParam, '?');
        this.log.debug(`retrieveAll(): calling url [${url}]`);
        return this.http.get<Page<T>>(url);
    }

    /**
     * Récupère les objets correspondants aux paramètres de recherche sur le webhook
     * @param pageParam paramètres de pagination et tris
     * @param specificCriterias 
     */
    public search(pageParam: PageRequest, specificCriterias: T): Observable<Page<T>> {
        let url = `${this.baseUrl}/search`;
        url += this.getPaginationQueryString(pageParam, '?');
        let separator: string = url.indexOf('?') > 0 ? '&' : '?';

        if (specificCriterias) {
            Object.keys(specificCriterias).forEach(param => {
                let value: string = encodeURI(specificCriterias[param]);
                url += `${separator}${param}=${value}`
                separator = '&';
            });
        }

        // this.log.debug(`search(): calling url [${url}]`);
        return this.http.get<Page<T>>(url);
    }


    /**
     * Recupère la liste des objets oar leurs ids auprès du webhook
     * @param id : liste des ids
     */
    public retrieveByIds(ids: Array<string>): Observable<SelectionResult<T>> {
        return this.http.get<SelectionResult<T>>(`${this.baseUrl}/ids/${ids}`);
    }
}

