import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-input-validation',
  template: `
    <div *ngIf="hasError()"  [innerHTML]="errorMessage" class="ui-message ui-messages-error">
    </div>
  `,
  styles: [`
    .ui-messages-error {
      margin: 0;
      margin-top: 0px;
      margin-bottom: 4px;
    }
  `]
})
export class InputValidationComponent {

  @Input() control: NgModel;
  @Input() form: NgForm;
  @Input() errDef: any;

  @Input() custom: any;

  errorMessages = [];
  errorMessage = '';

  hasError(): boolean {
    this.errorMessages = [];
    this.errorMessage = '';
    if ( this.errDef && ( this.control.errors || this.errDef['custom'] ) ) {
      Object.keys(this.errDef).some(key => {

        if ( this.control.errors && this.control.errors[key]) {
          this.errorMessages.push(this.errDef[key]);
        } else if ( key === 'custom' && !this.runCustom() ) {
          this.errorMessages.push(this.errDef[key]);
        }
        return false;
      });
    }

    for ( const m of this.errorMessages ){
      if ( this.errorMessage.length > 0 ) {
        this.errorMessage = this.errorMessage + '. <br /> ';
      }
      this.errorMessage = this.errorMessage + m;
    }
    return this.errorMessages.length > 0  && this.control.dirty;

  }
  public runCustom(): boolean {
    return this.custom(this);
  }

}