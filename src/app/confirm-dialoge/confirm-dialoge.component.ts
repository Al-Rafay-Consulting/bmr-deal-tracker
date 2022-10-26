import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialoge',
  templateUrl: './confirm-dialoge.component.html',
  styleUrls: ['./confirm-dialoge.component.scss']
})
export class ConfirmDialogeComponent implements OnInit {

  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef:MatDialogRef<ConfirmDialogeComponent>,
    ) { }

  ngOnInit(): void {
  }

  closeDialoge(){
    this.dialogRef.close(false);
  }

}
