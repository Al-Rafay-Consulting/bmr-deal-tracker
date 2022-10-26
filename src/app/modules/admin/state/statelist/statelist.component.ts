import { Component, OnInit } from '@angular/core';
import { State } from '../state.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Component({
  selector: 'app-statelist',
  templateUrl: './statelist.component.html',
  styleUrls: ['./statelist.component.scss']
})
export class StatelistComponent extends Table implements OnInit  {
  public searchInput = false;
  displayedColumns: string[] = [ 'Title','Inactive','actions', /*'Modified', 'Editor.Title'*/];

  constructor(public service: SPOperationsService, public router: Router, public common:CommonService) {
    super(router);    
    this.common.hideGlobalSearch = true;
   }

  ngOnInit(): void {
    this.common.ShowSpinner();
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',     
      expand: 'Editor',
      orderby:'Title asc'
    };

    this.service.readItems("State" ,query).then(res => {
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res['d'].results as State[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: State) {
    this.router.navigate(['/admin/State/form'], { queryParams: { ID: cat.ID } })
  }

  openHomeForm(){
    this.router.navigate(['/home'])
  }

}
