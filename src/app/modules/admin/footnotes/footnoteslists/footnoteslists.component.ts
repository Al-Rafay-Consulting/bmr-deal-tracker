import { Component, OnInit } from "@angular/core";
import { Footnotes } from "../footnotes.model";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { Table } from "src/app/Base/Table";
import { CommonService } from "src/app/Base/Common.service";
import { SPOperationsService } from "src/app/services/spoperations.service";

@Component({
  selector: "app-footnoteslists",
  templateUrl: "./footnoteslists.component.html",
  styleUrls: ["./footnoteslists.component.scss"],
})
export class FootnoteslistsComponent extends Table implements OnInit {
  public searchInput = false;
  displayedColumns: string[] = [
    "ID",
    "Title",
    "Inactive",
    "actions" /*'Modified', 'Editor.Title'*/,
  ];

  constructor(
    public service: SPOperationsService,
    public router: Router,
    public common: CommonService
  ) {
    super(router);
    this.common.hideGlobalSearch = true;
  }
  footnotes: any[] = [];
  ngOnInit(): void {
    this.common.ShowSpinner();
    const query = {
      select: "ID, Title, Inactive,Modified, Editor/Title",
      expand: "Editor",
      orderby: "ID asc",
    };

    this.service.readItems("Footnotes", query).then((res) => {
      this.footnotes = res["d"].results;
      this.common.HideSpinner();
      this.listData = new MatTableDataSource(res["d"].results as Footnotes[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    });
    setTimeout(() => {
      this.getdealmaster();
    }, 2 );
  }

  ngOnDestroy() {
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: Footnotes) {
    this.router.navigate(["/admin/Footnotes/form"], {
      queryParams: { ID: cat.ID },
    });
  }

  openHomeForm() {
    this.router.navigate(["/home"]);
  }
  // DealId: number = 0;
  // DealLength: any[] = [];
  openDeal(Id: number) {
    // if(this.DealId > 0){
    //   for (let index = 0; index < this.DealId.length; index++) {
    //     const element = array[index];

    //   }
    // }
    // this.DealLength.push(Id);
    // this.DealLength.forEach(function (index) {
    //   console.log(index);
    // });
    // for (var value of this.DealLength) {
    //   console.log(value);
    // }
    // for (let index = 0; index < this.DealLength.length; index++) {
    //   const element = this.DealLength[index];
    //   Id = element.Id;
    // }
    this.router.navigate(["/portal/deals/main"], {
      queryParams: { dealID: Id  },
    });
  }

  FootnotesInf: any[] = [];

  getdealmaster() {
    const query = {
      // select: "FootnotesId,Footnotes/Title",
      select: "ID,Title,FootnotesId,Footnotes/Id,Footnotes/Title",
      expand: "Footnotes",
    };
    this.service.readItems("DealMaster", query).then((res) => {
      let DealsData = res["d"].results;
      var tempVar = "";
      var tempVarID: any = [];

      for (let index = 0; index < this.footnotes.length; index++) {
        const element = this.footnotes[index];
        for (var k = 0; k < DealsData.length; k++) {
          for (var j = 0; j < DealsData[k].Footnotes.results.length; k++) {
            let item = DealsData[k].Footnotes.results.filter(function (e) {
              return e.Id == element.ID;
            });
            if (item.length > 0) {
              if (tempVar == "") tempVar += DealsData[k].Id;
              else tempVar += ", " + DealsData[k].Id;

              tempVarID.push({
                DID:DealsData[k].Id,
                Title:DealsData[k].Title
              }
                );

            }
          }

          //let item = res['d'].results.filter(({ element }) => item.find((x) => x.FootnessId === element.ID)).sort((a, b) => a.Name - b.Name);
        }
        this.FootnotesInf.push({
          ID: this.footnotes[index].ID,
          Title: this.footnotes[index].Title,
          Deals: tempVar,
          DealsID: tempVarID,
        });
        tempVar = "";
        tempVarID = [];

        // for (let index = 0; index < this.FootnotesInf.length; index++) {
        //   const element = this.FootnotesInf[index];
        //   if(element.Id == )
        // }
        console.log(this.FootnotesInf);
      }
    });
  }
}
