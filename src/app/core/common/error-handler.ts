/*
 * Wod, Worldline Offer Designer.
 * Copyright (C) 2017-2018 Worldline
 * All Rights Reserved
 * This product is protected by copyright. Any copying or distribution
 * is forbidden without the agreement of Worldline.
 */
import { ErrorHandler, Injectable, Injector } from '@angular/core';
/*
https://medium.com/@amcdnl/global-error-handling-with-angular2-6b992bdfb59c
*/


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }

  handleError(error) {

    // IMPORTANT: Rethrow the error otherwise it gets swallowed

    // log on the server
    /*
    const loggingService = this.injector.get(LoggingService);
    const location = this.injector.get(LocationStrategy)
    const message = error.message ? error.message : error.toString();
    const url = location instanceof PathLocationStrategy
      ? location.path() : '';
   // get the stack trace, lets grab the last 10 stacks only
    StackTrace.fromError(error).then(stackframes => {
      const stackString = stackframes
        .splice(0, 20)
        .map(function(sf) {
          return sf.toString();
        }).join('\n');
    // log on the server
      loggingService.log({ message, url, stack: stackString });
    */
     throw error;
  }
}
