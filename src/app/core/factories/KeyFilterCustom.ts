import { Directive, forwardRef, Input } from "@angular/core";
import { KeyFilter, DomHandler } from "primeng/primeng";
import { AbstractControl, NG_VALIDATORS } from "@angular/forms";

export const KEYFILTER_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => KeyFilterCustom),
    multi: true
};

@Directive({
    selector: '[pKeyFiltCustom]',
    providers: [DomHandler, KEYFILTER_VALIDATOR]
})

export class KeyFilterCustom extends KeyFilter {

    @Input('pKeyFiltCustom') set pattern(_pattern: any) {
        this._pattern = _pattern;
        this.regex = KeyFilter.DEFAULT_MASKS[this._pattern] || this._pattern;
    }
    
    validate(c: AbstractControl): { [key: string]: any } {
        let value = this.el.nativeElement.value;
        if (value != null && value != "" && !this.regex.test(value)) {
            return {
                validatePattern: false
            }
        }
    }
    
}