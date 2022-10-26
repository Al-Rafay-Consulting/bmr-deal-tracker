import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogeComponent } from './message-dialoge.component';

@Injectable({
  providedIn: 'root'
})
export class MessageDialogeService {

  constructor(private dialog: MatDialog) { }

  openMessageDialog(msg) {
    return this.dialog.open(MessageDialogeComponent, {
      width: '500px',
      panelClass:"confirm-dialog-container",
      disableClose: true,
      data:{
        message:msg
      }
    })
  }
}
