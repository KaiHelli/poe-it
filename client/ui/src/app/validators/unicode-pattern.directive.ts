import {Directive, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";

@Directive({
  selector: '[unicodePattern]',
  providers: [{provide: NG_VALIDATORS, useExisting: UnicodePatternDirective, multi: true}]
})
export class UnicodePatternDirective implements Validator {
  @Input('unicodePattern') unicodePattern = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.unicodePattern ? unicodePatternValidator(new RegExp(this.unicodePattern, 'u'))(control)
      : null;
  }
}

/** A hero's name can't match the given regular expression */
export function unicodePatternValidator(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const matched = pattern.test(control.value);
    return matched ? null : {unicodePattern: {value: control.value}};
  };
}
