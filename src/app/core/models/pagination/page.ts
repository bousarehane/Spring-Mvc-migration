/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
/**
 * Objet Page compatible avec ceux renvoyés par Spring Data.
 * Classe java : org.springframework.data.domain.Page
 * Lien : https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Page.html
 */
export class Page<T> {
    content: Array<T>;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first?: boolean;
    last?: boolean;
}