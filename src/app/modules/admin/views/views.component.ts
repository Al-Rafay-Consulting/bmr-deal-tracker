import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewMaster } from './view-master.model';
import { ViewDetail } from './view-detail.model';
import { SPOperationsService } from 'src/app/services/spoperations.service';



@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit {

  viewName: string = null;

  constructor( 
    public dialogRef: MatDialogRef<ViewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service:SPOperationsService
    ) { }

  ngOnInit(): void {

    this.service.readItems("View Detail").then(res=>{
      console.log(res);
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 async onSave(){

    var viewMaster =  new ViewMaster();    
    viewMaster.Title = this.viewName;
    viewMaster.ViewList = this.data.listName;
    
    await this.service.createSPItem("View Master", "View Master", viewMaster).subscribe(async res=>{

      for (let index = 0; index < this.data.viewDetail.length; index++) {
        const element = this.data.viewDetail[index] as ViewDetail ;
        element.ViewIDId =  res['d'].ID;
        
        var item = await this.service.createSPItem("View Detail", "View Detail", element).subscribe()
        console.log(item);
        console.log('Index of Filter Item: ' + index);
      }

      this.dialogRef.close({event:'Success'});

    })

  }
    


}
