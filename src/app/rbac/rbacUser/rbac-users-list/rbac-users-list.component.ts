import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RbacUsers } from '../../rbac-users.model';
import { GenericService } from 'src/app/services/generic.service';
import { MatTableDataSource } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';
import { Table } from 'src/app/Base/Table';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { CommonService } from '../../../Base/Common.service';

@Component({
  selector: 'app-rbac-users-list',
  templateUrl: './rbac-users-list.component.html',
  styles: []
})
export class RbacUsersListComponent extends Table implements OnInit {
  public searchInput = false;
  displayedColumns: string[] = [ 'actions','UserId', 'FirstName', 'LastName', 'Inactive', 'IsSystemGenerated'];
  
  showAcitve: boolean = false;
  showInacitve: boolean = false;
  showSystemGenerated: boolean = false;
  

  constructor(public service: GenericService, public router: Router, public messageDialoge: MessageDialogeService,
    public common:CommonService) {
    super(router);    
  }

  ngOnInit(): void {
    this.showAcitve = true;
    this.getUsers();
  }

  getUsers(){
    this.listData = null;
    var queryOption = "?$filter= 1 eq 1 ";

    if(this.showAcitve == true && this.showInacitve == true && this.showSystemGenerated == true)
      queryOption = "?$orderby=FirstName desc"; 
    else if(this.showAcitve == true && this.showInacitve == true && this.showSystemGenerated == false)
      queryOption = "?$filter= (IsSystemGenerated eq null or IsSystemGenerated eq false)";
    else if(this.showAcitve == true && this.showInacitve == false && this.showSystemGenerated == true)
      queryOption = "?$filter= (Inactive eq null or Inactive eq false) ";
    else if(this.showAcitve == true && this.showInacitve == false && this.showSystemGenerated == false)
      queryOption = "?$filter= (Inactive eq null or Inactive eq false) and (IsSystemGenerated eq null or IsSystemGenerated eq false)";  

    else if(this.showAcitve == false && this.showInacitve == true && this.showSystemGenerated == false)
      queryOption = "?$filter= (Inactive eq true) and  (IsSystemGenerated eq null or IsSystemGenerated eq false)";
    else if(this.showAcitve == false && this.showInacitve == false && this.showSystemGenerated == true)
      queryOption = "?$filter= (IsSystemGenerated eq true)";
    else if(this.showAcitve == false && this.showInacitve == false && this.showSystemGenerated == false)
      queryOption = "?$filter= 1 ne 1";        
    else if(this.showAcitve == false && this.showInacitve == true && this.showSystemGenerated == true)
      queryOption = "?$filter= (Inactive eq true)  OR (IsSystemGenerated eq true)";
    else
      queryOption += "& $orderby=FirstName ASC";

    this.service.getDataByQuery("RBAC_Users", queryOption).then(res => {

      this.listData = new MatTableDataSource(res as RbacUsers[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

    });
  }

  onEdit(gen: RbacUsers) {
    if (gen.IsSystemGenerated == true)
      this.messageDialoge.openMessageDialog("Cannot Edit, This user is system generated");
    else
      this.router.navigate(['/rbac/rbacusers/form'], { queryParams: { ID: gen.ID } })
  }

  onCheckBoxChange(){
    this.getUsers();
  }

}
