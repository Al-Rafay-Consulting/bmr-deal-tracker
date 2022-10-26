import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-message-dialoge',
  templateUrl: './message-dialoge.component.html',
  styleUrls: ['./message-dialoge.component.scss']
})
export class MessageDialogeComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef:MatDialogRef<MessageDialogeComponent>,
    ) { }

  ngOnInit(): void {
  }

  closeDialoge(){
    this.dialogRef.close();
  }

}
