import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogeComponent } from './confirm-dialoge.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogeService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg) {
    return this.dialog.open(ConfirmDialogeComponent, {
      width: '390px',
      panelClass:"confirm-dialog-container",
      disableClose: true,
      data:{
        message:msg
      }
    })
  }
}
