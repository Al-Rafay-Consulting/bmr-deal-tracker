import { ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoginUser } from './User/login-user';
import { EnRights } from '../Enum/Enums';
import { Router } from '@angular/router';
import { ParentBase } from './parent-base';

export class Table extends ParentBase implements OnInit {

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    listData: MatTableDataSource<any>;
    // displayedColumns:string[] = ['ID', 'TypeName', 'Amount', 'IsByDefault',  'ModifiedDate', 'actions'];/*'ModifiedBy',*/   
    displayedColumns: string[];
    searchKey: string = "";
    pageSize: number = 50;
    searchNotFoundText:string = "No data matching the search keyword ";
    

    public formID: string = "";
    public CanAdd: boolean = true;
    public CanEdit: boolean = true;
    public CanDelete: boolean = true;
    public CanView: boolean = true;

    constructor(public router?: Router) {
        super(router);
    }

    ngOnInit(): void {
        //this.GetUserRights();
    }

    onSearchClick() {
        this.searchKey = "";
        this.applyFilter();
    }

    applyFilter() {
      
      /*  this.listData.filterPredicate= function(data: any, filter: string): boolean {
            const dataStr =JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1; 
          };
        this.listData.filter = this.searchKey.trim().toLowerCase();
        */

        this.listData.filterPredicate = (data, filter: string)  => {
          if(data.isGroup == true){
            return true;
          }else{
            const accumulator = (currentTerm, key) => {
              return this.nestedFilterCheck(currentTerm, data, key);
            };
            const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) !== -1;
          }
            
          };

          this.listData.filter = this.searchKey.trim().toLowerCase();
          
    }


    nestedFilterCheck(search, data, key) {
        if (typeof data[key] === 'object') {
          for (const k in data[key]) {
            if (data[key][k] !== null) {
              search = this.nestedFilterCheck(search, data[key], k);
            }
          }
        } else {
          search += data[key];
        }
        return search;
      }

    GetUserRights() {
        if (this.formID != "") {

            var sectionName = this.formID;
            var userPermission = LoginUser.UserPermissions.filter(function (x) {
                return x.SectionName == sectionName
            })

            for (let index = 0; index < userPermission.length; index++) {
                const element = userPermission[index];

                if (element.RightsID == EnRights.View)
                    this.CanView = element.HasPermission;
                else if (element.RightsID == EnRights.Add)
                    this.CanAdd = element.HasPermission;
                else if (element.RightsID == EnRights.Edit)
                    this.CanEdit = element.HasPermission;
                else if (element.RightsID == EnRights.Delete)
                    this.CanDelete = element.HasPermission;
            }

            if (this.CanView == false) {
                this.CanAdd = false;
                this.CanEdit = false;
                this.CanDelete = false;
            }
        }
    }

    syncPrimaryPaginator(event: PageEvent) {
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.pageSize = event.pageSize;
        this.paginator.page.emit(event);        
    }


    getProperty = (obj, path) => (
      path.split('.').reduce((o, p) => o && o[p], obj)
    )
    
  
    setSort() {
      this.listData.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
        return item[property];
      };
    }
    

    

}