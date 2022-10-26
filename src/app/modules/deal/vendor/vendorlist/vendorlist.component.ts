import { Component, OnInit, ViewChild } from '@angular/core';
import { Vendor } from '../vendor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { Industry } from 'src/app/modules/admin/industry/industry.model';
import { Specialty } from 'src/app/modules/admin/speciality/specialty.model';
import { State } from 'src/app/modules/admin/state/state.model';
import { ModalDirective, FileInputModule } from 'ng-uikit-pro-standard';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ViewsComponent } from 'src/app/modules/admin/views/views.component';
import { ViewDetail } from 'src/app/modules/admin/views/view-detail.model';
import { VendorService } from 'src/app/modules/deal/vendor/vendor.service';
import { ToastType } from 'src/app/Enum/ToastType';

@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.scss']
})
export class VendorlistComponent extends Table implements OnInit {

  public searchInput = false;
  displayedColumns: string[] = [ /*'ID',*/ 'Title','IndustryText','SpecialtyText','StateText','actions', /*'Modified', 'Editor.Title'*/];

   
  AutoCompIndustry: Autocomplete<Industry> = new Autocomplete<Industry>("Title", "ID");   
  AutoCompSpecialty: Autocomplete<Specialty[]> = new Autocomplete<Specialty[]>("Title", "ID");  
  AutoCompState: Autocomplete<State[]> = new Autocomplete<State[]>("Title", "ID");  

  //IndustryID: number = 0;
  IndustryID: number[] = [];
  SpecialtyID: number[] = [];
  StateID: number[] = [];

  industryList:Industry[]=[];
  specialtyList:Specialty[]=[];
  stateList:State[]=[];

  filterText:string = "";

  searchIndustry:any = null;
  searchSpecialty:any = null;
  searchState:any = null;
  selectedAccrual:boolean = null;


  viewID:number = 0;
  parent:string = "";

  public ExportData: any[] = [];
  public FileName : string =  "Vendor Data";

  public ColumnNamesAndFormat: any[] = [{         
    'Title': 'Text', 
    'IndustryText': 'Text', 
    'SpecialtyText': 'Text',         
    'StateText': 'Text',             

  }];
  
  public header: any[] = [{
    'Title': 'Vendor Name',
    'IndustryText': 'Industry',
    'SpecialtyText': 'Specialty',
    'StateText': 'State',
  }];
  
  protected _onDestroy = new Subject<void>();
 
  constructor(
    public service: SPOperationsService, 
    public router: Router, 
    public common:CommonService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public vendorService:VendorService) {
    super(router);    
    this.common.hideGlobalSearch = true;
   }

  ngOnInit(): void {


    
    this.route.queryParams
    .subscribe(params => {
        this.viewID = params['ViewID'] || 0;
        this.parent = params['parent'] || 0;
    });


    this.common.ShowSpinner();

    this.getViewData().then(res => {
      Promise.all([
        this.getIndustry(),
        this.getSpecialty(),
        this.getState(),

      ]).then(res => {

        this.getVendorData();
      })
    })

   
  }

  async getViewData() {

    if (this.viewID > 0) {
      var query = {
        select: "ID, Title, FilterValue",
        filter: "ViewIDId eq " + this.viewID
      }

      await this.service.readItems("View Detail", query).then(res => {
        var viewDetail = res['d'].results as ViewDetail[]

        for (let index = 0; index < viewDetail.length; index++) {
          const element = viewDetail[index];
          if (element.Title == 'IndustryId')
            String(element.FilterValue).split(',').forEach(a => a == '' ? [] : this.IndustryID.push(Number(a)));
          else if (element.Title == 'SpecialtyId')
            String(element.FilterValue).split(',').forEach(a => a == '' ? [] : this.SpecialtyID.push(Number(a)));
          else if (element.Title == 'StateId')
            String(element.FilterValue).split(',').forEach(a => a == '' ? [] : this.StateID.push(Number(a)));
          else if (element.Title == 'Accrual')
            this.selectedAccrual = element.FilterValue == "false" ? false : element.FilterValue == "true" ? true : false;
        }

      })
    }
  }
  
  viewDetailList: ViewDetail[] = [];

  openDialog(): void {
    
    const dialogRef = this.dialog.open(ViewsComponent, {
      width: '260px',
      data: {
        viewDetail: this.viewDetailList, 
        listName: 'Vendor List',
        heading: "Vendor Filters"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined)
      {
        if(result.event == "Success")
          this.common.ShowToast("Successfully Saved!",  ToastType.Success);
      }
      //this.animal = result;
    });
  }

 

  getVendorData(){
    this.common.ShowSpinner();
    var filter = "";
    this.filterText = "";
    this.viewDetailList = [];

    var viewDetail =  new ViewDetail();
    

    if (this.IndustryID.length > 0 && this.IndustryID != undefined && this.IndustryID != null) {

      if (filter != "")
        filter += "and"


      if (this.filterText == "")
        this.filterText += "Filtered by: ";
      else
        this.filterText += " | ";

      this.filterText += "Industry = ";

      // Loop to get all selected industry filter
      for (let index = 0; index < this.IndustryID.length; index++) {
        const element = this.IndustryID[index];

        // First item in opening bracket
        if (index == 0) {
          filter += "(IndustryId eq '" + element + "' ";
          this.filterText += this.industryList.filter(res => { return res.ID == element })[0].Title
          viewDetail.FilterValue += String(element).toString();
        }
        else // Next items
        {
          filter += " or  IndustryId eq '" + element + "' ";
          this.filterText += ', ' + this.industryList.filter(res => { return res.ID == element })[0].Title
          viewDetail.FilterValue += ',' + String(element).toString();
        }

      }

      viewDetail.Title = "IndustryId";
      this.viewDetailList.push(viewDetail);

      // Closing bracket of industry filter
      filter += ") ";
    }

    if (this.SpecialtyID.length > 0 && this.SpecialtyID != undefined && this.SpecialtyID != null) {
            
      if (filter != "")
        filter += "and"

      if(this.filterText == "")
        this.filterText += "Filtered by: ";     
      else
        this.filterText += " | ";    

      //filter += "  SpecialtyId eq " + this.SpecialtyID;

      this.filterText += "Specialty = ";
      viewDetail =  new ViewDetail();

      // Loop to get all selected specialty filter
      for (let index = 0; index < this.SpecialtyID.length; index++) {
        const element = this.SpecialtyID[index];

        // First item in opening bracket
        if (index == 0) {
          filter += "(SpecialtyId eq '" + element + "' ";
          this.filterText += this.specialtyList.filter(res => { return res.ID == element })[0].Title
          viewDetail.FilterValue += String(element);
        }
        else // Next items
        {
          filter += " or  SpecialtyId eq '" + element + "' ";
          this.filterText += ', ' + this.specialtyList.filter(res => { return res.ID == element })[0].Title
          viewDetail.FilterValue += ',' + String(element);
        }

      }

      viewDetail.Title = "SpecialtyId";
      this.viewDetailList.push(viewDetail);

      // Closing bracket of specialty filter
      filter += ") ";
      
      //this.filterText += "Specialty = " + this.specialtyList.filter(res => { return res.ID == this.SpecialtyID })[0].Title
      
    }

    if (this.StateID.length > 0 && this.StateID != undefined && this.StateID != null) {
            
      if (filter != "")
        filter += "and"

      //filter += "  StateId eq " + this.StateID;

      //this.filterText += "StateID = ";

      if(this.filterText == "")
        this.filterText += "Filtered by: ";     
      else
        this.filterText += " | ";   
      

      this.filterText += " State = ";
      viewDetail =  new ViewDetail();

      // Loop to get all selected specialty filter
      for (let index = 0; index < this.StateID.length; index++) {
        const element = this.StateID[index];

        // First item in opening bracket
        if (index == 0) {
          filter += "(StateId eq '" + element + "' ";
          this.filterText += this.stateList.filter(res => { return res.ID == element })[0].Title
          viewDetail.FilterValue += String(element);
        }
        else // Next items
        {
          filter += " or StateId eq '" + element + "' ";
          this.filterText += ', ' + this.stateList.filter(res => { return res.ID == element })[0].Title
          viewDetail.FilterValue += ',' + String(element);
        }

      }

      viewDetail.Title = "StateId";
      this.viewDetailList.push(viewDetail);

      // Closing bracket of specialty filter
      filter += ") ";
              
      //this.filterText += "State = " + this.stateList.filter(res => { return res.ID == this.StateID })[0].Title
      
    }
    
    viewDetail =  new ViewDetail();
    if (this.selectedAccrual != null) {
      if (filter != "")
        filter += " and "
      
      if(this.selectedAccrual == true)
        filter += " (Accrual eq " + 1 + ")"
      else
        filter += " (Accrual eq " + 0 + " or Accrual eq null)";


      if (this.filterText == "")
        this.filterText += "Filtered by: ";
      else
        this.filterText += " | ";

       this.filterText += "Accrual = " + (this.selectedAccrual == true ? 'Yes' : 'No');

       viewDetail.Title = "Accrual";
       viewDetail.FilterValue = String(this.selectedAccrual);
       this.viewDetailList.push(viewDetail);
    }

    

    const query = {
      select: 'ID, Title, Modified, Editor/Title, Industry/Title,Specialty/Title,State/Title, IndusId',     
      expand: 'Editor,Industry,Specialty,State',
      filter:filter,
      orderby:'Title asc'
    };

    this.service.readItems("Vendors" ,query).then(res => {
      this.common.HideSpinner();     
      
      // Create Text by looping multi/array columns
      this.setData(res['d'].results);
      this.listData = new MatTableDataSource(res['d'].results);      
      this.setSort();
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      // Export Data
      this.ExportData = res['d'].results;
      
    });
  }


  setData(data:any[]){
    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      // Set Industry text
      for (let i = 0; i <  element.Industry.results.length; i++) {
        const elementIndus = element.Industry.results[i];
        if (i == 0)
          element['IndustryText'] = elementIndus.Title
        else
          element['IndustryText'] += ", " + elementIndus.Title;        
      }

      // Set Specialty text    
      for (let i = 0; i <  element.Specialty.results.length; i++) {
        const elementSpecialty = element.Specialty.results[i];
        if (i == 0)
          element['SpecialtyText'] = elementSpecialty.Title
        else
          element['SpecialtyText'] += ", " + elementSpecialty.Title;        
      }


      // Set State text    
      for (let i = 0; i <  element.State.results.length; i++) {
        const elementState = element.State.results[i];
        if (i == 0)
          element['StateText'] = elementState.Title
        else
          element['StateText'] += ", " + elementState.Title;        
      }
  

    }
  }


  ngOnDestroy(){
    this.common.hideGlobalSearch = false;
  }

  onEdit(cat: Vendor) {
    this.router.navigate(['/contact/vendor/form'], { queryParams: { ID: cat.ID, ViewID: this.viewID , parent: this.parent} })
  }

  onAdd() {
    this.router.navigate(['/contact/vendor/form'], { queryParams: { ViewID: this.viewID , parent: this.parent} })
  }

  openHomeForm(){
    this.router.navigate(['/home'])
  }

  
  async getIndustry(){
    const query = {
      select: 'ID, Title',
      orderby:'Title asc'             
    };

    await this.service.readItems("Industry" ,query).then(res => {
      this.common.HideSpinner();
      this.AutoCompIndustry.data = res['d'].results;
      this.AutoCompIndustry.resultObserve();
      this.industryList = res['d'].results;
    });
  }


  async getSpecialty(){
    const query = {
      select: 'ID, Title',
      orderby:'Title asc'             
    };

    await this.service.readItems("Specialty" ,query).then(res => {
      this.common.HideSpinner();
      this.AutoCompSpecialty.data = res['d'].results;
      this.AutoCompSpecialty.resultObserve();
      this.specialtyList = res['d'].results;
    });
  }

  async getState(){
    const query = {
      select: 'ID, Title',
      orderby:'Title asc'             
    };

    await this.service.readItems("State" ,query).then(res => {
      this.common.HideSpinner();
      this.AutoCompState.data = res['d'].results;
      this.AutoCompState.resultObserve();
      this.stateList = res['d'].results;
    });
  }


  onFilterClick(frame:ModalDirective) {
   
    this.getVendorData();  
    frame.hide();
  }

  onFilterClear(frame: ModalDirective) {

    this.IndustryID = [];
    this.SpecialtyID = [];
    this.StateID = [];    
    this.getVendorData();
    frame.hide();

  }

  toggleSelectAll(selectAllValue: boolean, fieldName:string) {

    if (fieldName == 'Industry')
      this.IndustryID = this.AutoCompIndustry.toggleSelectAll(selectAllValue, this.AutoCompIndustry, "Id")
    else if (fieldName == 'Specialty')
      this.SpecialtyID = this.AutoCompSpecialty.toggleSelectAll(selectAllValue, this.AutoCompSpecialty, "Id")
    else if (fieldName == 'State')
      this.StateID = this.AutoCompState.toggleSelectAll(selectAllValue, this.AutoCompState, "Id")

  }

  onBack(){
    //if(this.parent == 'Views')
    if(this.viewID > 0)
        this.openViews();   
  }

  openViews(){
    this.router.navigate(['/contact/views']);
  }

  openContactList(){
    this.vendorService.vendorIdList = [];
    for (let index = 0; index < this.ExportData.length; index++) {
      const element = this.ExportData[index];
      this.vendorService.vendorIdList.push(element['ID'])      
    }

    this.router.navigate(['/contact/list'], { queryParams: { ViewID: this.viewID , parent: 'vendors'} });
  }



}
