import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { Router } from '@angular/router';
import { Table } from 'src/app/Base/Table';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { RBACGroups } from '../../rbac-groups';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '../../../Base/Common.service';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { RBAC_Users_Groups } from '../../rbac-users-groups';


@Component({
  selector: 'app-rbac-group-list',
  templateUrl: './rbac-group-list.component.html',
  styles: []
})
export class RbacGroupListComponent extends Table implements OnInit {
  public searchInput = false;
  displayedColumns: string[] = ['actions','GroupName', 'IsAdmin', 'ModifiedDate'];  

  constructor(
    public service: GenericService, 
    public router: Router, 
    public msgDialog:MessageDialogeService,
    public common:CommonService) {
    super(router);
    //this.addControllerName("RBAC_Groups");
  }

  ngOnInit(): void {
    this.service.getDataByQuery("RBAC_Groups", "?$expand=RBAC_Users_Groups($expand=RBAC_Users)&$orderby=GroupName ASC").then(res => {

      this.listData = new MatTableDataSource(res as RBACGroups[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

    });
    
  }

  onEdit(gen: RBACGroups) {
    if(gen.IsSystemGenerated == true)
    {
      this.msgDialog.openMessageDialog("Cannot edit. This record is system generated.");
    }
    else
      this.router.navigate(['/rbac/rbacgroup/form'], { queryParams: { ID: gen.ID } })
  }

  userGroups:any[] =[];
  openFrame(frame:ModalDirective, gen: RBACGroups) {                   
    var arry = [...this.listData.data]
    this.userGroups =  arry.filter(f => f.ID == gen.ID) as any[];
    frame.show();
    
  }


}
