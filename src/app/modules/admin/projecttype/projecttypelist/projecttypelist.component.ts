import { Component, OnInit } from '@angular/core';
import { Projecttype } from '../projecttype.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Component({
  selector: 'app-projecttypelist',
  templateUrl: './projecttypelist.component.html',
  styleUrls: ['./projecttypelist.component.scss']
})
export class ProjecttypelistComponent extends Table implements OnInit  {
  public searchInput = false;
  displayedColumns: string[] = [ 'ID','Title','Inactive','actions', /*'Modified', 'Editor.Title'*/];

  constructor(public service: SPOperationsService, public router: Router, public common:CommonService) {
    super(router);
    this.common.hideGlobalSearch = true;
   }

  ngOnInit(): void {
    this.common.ShowSpinner();
    const query = {
      select: 'ID, SortNo,Title, Inactive ,Modified, Editor/Title',
      expand: 'Editor',
      orderby:'SortNo asc'
    };

    this.service.readItems("ProjectType" ,query).then(res => {
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res['d'].results as Projecttype[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: Projecttype) {
    this.router.navigate(['/admin/Projecttype/form'], { queryParams: { ID: cat.ID } })
  }

  openHomeForm(){
    this.router.navigate(['/home'])
  }

}

