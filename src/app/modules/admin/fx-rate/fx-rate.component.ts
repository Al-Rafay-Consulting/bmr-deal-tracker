import { Component, OnInit } from '@angular/core';
import { FXRate } from './FXRate.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fx-rate',
  templateUrl: './fx-rate.component.html',
  styleUrls: ['./fx-rate.component.scss']
})
export class FXRateComponent extends Table implements OnInit {
  public searchInput = false;
  displayedColumns: string[] = ['Title','Rates'];

  constructor(public service: SPOperationsService, public router: Router, public common:CommonService ,public http: HttpClient,) {
    super(router);    
    this.common.hideGlobalSearch = true;
   }
  ngOnInit(): void {
    this.common.ShowSpinner();
    this.http.get("https://v6.exchangerate-api.com/v6/2dbcde4e7ee57f80c045748d/latest/USD").toPromise().then((res:any) => {
      this.common.HideSpinner();
      let item = res.conversion_rates as any [];
      const mapped = Object.keys(item).map(key => ({Title: key, Rates: item[key]}));
      // console.log(mapped);
      this.listData = new MatTableDataSource(mapped);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      
    });
  }
  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }
  // onEdit(cat: Market) {
  //   this.router.navigate(['/admin/Market/form'], { queryParams: { ID: cat.ID } })
  // }
  openHomeForm(){
    this.router.navigate(['/home'])
  }
}
