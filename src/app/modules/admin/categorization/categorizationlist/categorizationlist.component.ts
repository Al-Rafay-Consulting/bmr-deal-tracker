import { Component, OnInit } from '@angular/core';
import {Categorization  } from '../categorization';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
@Component({
  selector: 'app-categorizationlist',
  templateUrl: './categorizationlist.component.html',
  styleUrls: ['./categorizationlist.component.scss']
})
export class CategorizationlistComponent extends Table implements OnInit {
  public searchInput = false;
  displayedColumns: string[] = [ 'Title','Inactive','actions', /*'Modified', 'Editor.Title'*/];

  constructor(public service: SPOperationsService, public router: Router, public common: CommonService) {
    super(router);
    this.common.hideGlobalSearch = true;
  }

  ngOnInit(): void {
    this.common.ShowSpinner();
    const query = {
      select: 'ID, Title,Inactive, Modified, Editor/Title',
      expand: 'Editor',
      orderby: 'Title asc'
    };

    this.service.readItems("Categorization", query).then(res => {
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res['d'].results as Categorization[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }
  ngOnDestroy() {
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: Categorization) {
    this.router.navigate(['/admin/Categorization/form'], { queryParams: { ID: cat.ID } })
  }

}
