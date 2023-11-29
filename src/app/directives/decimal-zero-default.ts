import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
    selector: '[addZeroDefault]'
})
export class DecimalZeroDefaultDirective {

    focus = false; 
    nativeElement: any;
    constructor(private _elementRef: ElementRef) {
        this.nativeElement = _elementRef.nativeElement;
    }

    @HostListener("ngModelChange", [ "$event"]) onNgModelChange(value: any) {
        const isThis = this;
        
       setTimeout(() => {
            const valueElement = isThis.nativeElement.value;
            if(!isThis.focus && !value?.toString().includes('.') && !valueElement.includes(',')  && value !== Infinity && value !== 0 && value !== null){
                isThis.nativeElement.value = valueElement + ',00';
            }

            let split = valueElement.split(',');
            if(isThis.focus && split.length == 2){
                isThis.nativeElement.value = split[0] +',' + (split[1] || '');
            }
            if(isThis.nativeElement.attributes.formcontrolname.nodeValue === 'nfse'){
                debugger
            }
       }, 100)
    }

    
    @HostListener("blur", [ "$event"]) onNgBlur(value: any) {
        this.focus = false;
        const valueElement = this.nativeElement.value;
        const split = valueElement.split(',');
        if(!valueElement.includes(',')){
            this.nativeElement.value = valueElement + ',00';
        } else if(split.length == 2){
            this.nativeElement.value = split[0] +',' + rigthPad(split[1], 2);
        }
    }

    
    @HostListener("focus", [ "$event"]) onFocus(value: any) {
        this.focus = true;
    }
}

function rigthPad(value: any, totalWidth: any, paddingChar: any = undefined) {
    var length = totalWidth - value.toString().length + 1;
    return value + Array(length).join(paddingChar || '0');
  };