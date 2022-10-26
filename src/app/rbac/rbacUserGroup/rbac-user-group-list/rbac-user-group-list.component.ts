import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RbacUsers } from '../../rbac-users.model';
import { GenericService } from 'src/app/services/generic.service';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';

@Component({
  selector: 'app-rbac-user-group-list',
  templateUrl: './rbac-user-group-list.component.html',
  styles: []
})
export class RbacUserGroupListComponent extends Table implements OnInit {

  displayedColumns: string[] = ['UserId', 'FirstName', 'LastName', 'Inactive', 'ModifiedDate', 'actions'];

  constructor(public service: GenericService, public router: Router) {
    super(router);
   // this.addControllerName("RBAC_Users_Groups");
  }

  ngOnInit(): void {
    this.service.getDataByQuery("RBAC_Users_Groups", "?$orderby=ID desc").then(res => {
      this.listData = new MatTableDataSource(res as RbacUsers[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

    });
  }

  onEdit(gen: RbacUsers) {
    this.router.navigate(['/rbacusers'], { queryParams: { ID: gen.ID } })
  }

}
