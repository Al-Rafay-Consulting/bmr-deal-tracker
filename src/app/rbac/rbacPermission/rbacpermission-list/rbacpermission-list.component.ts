import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GenericService } from 'src/app/services/generic.service';
import { Table } from 'src/app/Base/Table';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { RBACPermissions } from '../../rbac-permissions';
import { Router } from '@angular/router';
import { CommonService } from '../../../Base/Common.service';

@Component({
  selector: 'app-rbacpermission-list',
  templateUrl: './rbacpermission-list.component.html',
  styles: []
})
export class RBACPermissionListComponent extends Table implements OnInit {
  public searchInput = false;
  displayedColumns: string[] = ['actions','ID', 'GroupName', 'ModifiedDate'];

  constructor(public service: GenericService, public router: Router, public messageDialoge: MessageDialogeService,
    public common:CommonService) {
    super(router);
    //this.addControllerName("RBAC_Permissions");
  }

  ngOnInit(): void {
    this.service.getDataByQuery("RBAC_Permissions", "?$expand=RBAC_Groups&$orderby=RBAC_Groups/GroupName asc").then(res => {

      this.listData = new MatTableDataSource(res as RBACPermissions[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

    });
  }

  onEdit(gen: RBACPermissions) {
   
      this.router.navigate(['/rbac/rbacpermission/form'], { queryParams: { ID: gen.ID } })
  }
}
