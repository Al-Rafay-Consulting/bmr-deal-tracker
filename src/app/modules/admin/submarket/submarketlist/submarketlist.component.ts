import { Component, OnInit } from '@angular/core';
import { SubMarket } from '../submarket.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Component({
  selector: 'app-submarketlist',
  templateUrl: './submarketlist.component.html',
  styleUrls: ['./submarketlist.component.scss']
})
export class SubmarketlistComponent extends Table implements OnInit  {
  public searchInput = false;
  displayedColumns: string[] = [ 'Market.Title','Title','Inactive','actions', /*'Modified', 'Editor.Title'*/];

  constructor(public service: SPOperationsService, public router: Router, public common:CommonService) {
    super(router);    
    this.common.hideGlobalSearch = true;
   }

  ngOnInit(): void {
    this.common.ShowSpinner();
    const query = {
      select: 'ID, Title,Market/Title,MarketId, Inactive,Modified, Editor/Title',     
      expand: 'Editor,Market',
      orderby:'Title asc'
    };

    this.service.readItems("SubMarket" ,query).then(res => {
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res['d'].results as SubMarket[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
  }

  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: SubMarket) {
    this.router.navigate(['/admin/Submarket/form'], { queryParams: { ID: cat.ID } })
  }

  openHomeForm(){
    this.router.navigate(['/home'])
  }

}
