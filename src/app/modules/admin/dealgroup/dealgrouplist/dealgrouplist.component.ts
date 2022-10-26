import { Component, OnInit } from '@angular/core';
import { Dealgroup } from '../dealgroup.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Component({
  selector: 'app-dealgrouplist',
  templateUrl: './dealgrouplist.component.html',
  styleUrls: ['./dealgrouplist.component.scss']
})
export class DealgrouplistComponent extends Table implements OnInit  {
  public searchInput = false;
  displayedColumns: string[] = [ 'ID', 'Title', 'Inactive', 'actions', /*'Modified', 'Editor.Title'*/];

  constructor(public service: SPOperationsService, public router: Router, public common:CommonService) {
    super(router);
    this.common.hideGlobalSearch = true;
   }

  ngOnInit(): void {
    this.common.ShowSpinner();
    const query = {
      select: 'ID, Title, Modified, Editor/Title, Inactive',
      expand: 'Editor',
      orderby:'Title asc'
    };

    this.service.readItems("Funds" ,query).then(res => {
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res['d'].results as Dealgroup[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: Dealgroup) {
    this.router.navigate(['/admin/Funds/form'], { queryParams: { ID: cat.ID } })
  }

  openHomeForm(){
    this.router.navigate(['/home'])
  }

}

