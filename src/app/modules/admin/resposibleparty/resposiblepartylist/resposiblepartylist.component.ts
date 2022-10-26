import { Component, OnInit } from '@angular/core';
import { ResponsibleParty } from '../responsibleparty.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
@Component({
  selector: 'app-resposiblepartylist',
  templateUrl: './resposiblepartylist.component.html',
  styleUrls: ['./resposiblepartylist.component.scss']
})
export class ResposiblepartylistComponent extends Table implements OnInit  {
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

    this.service.readItems("ResponsibleParty" ,query).then(res => {
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res['d'].results as ResponsibleParty[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: ResponsibleParty) {
    this.router.navigate(['/admin/ResponsibleParty/form'], { queryParams: { ID: cat.ID } })
  }

  openHomeForm(){
    this.router.navigate(['/home'])
  }

}
