

import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

export class MultiSelect {

    data: any[] = [];
    allSelected: boolean = false;

    constructor() { }

    toggleAllSelection(skillSel: MatSelect) {
        this.allSelected = !this.allSelected;  // to control select-unselect

        if (this.allSelected) {
            skillSel.options.forEach((item: MatOption) => item.select());
        } else {
            skillSel.options.forEach((item: MatOption) => { item.deselect() });
        }
        //this.skillSel.close();
    }

}