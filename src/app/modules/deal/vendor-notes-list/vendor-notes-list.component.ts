import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Base/Common.service';
import { Table } from 'src/app/Base/Table';
import { MatTableDataSource } from '@angular/material/table';
import { VendorNotes } from '../vendor-notes.model';

import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard'

import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { VendornotesComponent } from '../vendor-notes/vendor-notes.component';
@Component({
  selector: 'app-vendor-notes-list',
  templateUrl: './vendor-notes-list.component.html',
  styleUrls: []
})
export class VendorNotesListComponent extends Table implements OnInit, OnChanges {
  @Input() input_vendorNotesList: VendorNotes [] = [];
  @Input() ifAddButton: boolean = false;
  @Input() vendorID: number = 0;
  @Input() dealID: number = 0;
  @Input() Category: string = '';
  @Output() addNoteEvent = new EventEmitter<VendorNotes>();

  vendorNotesList: VendorNotes [] = [];

  public searchInput = false;
  displayedColumns: string[] = [ 'Notes', 'actions'];
  
  public modalRef: MDBModalRef;
  constructor(
    public service: SPOperationsService, 
    public router: Router, 
    public common:CommonService,
    public modalService: MDBModalService,
    public dialog: ConfirmDialogeService) {
    super(router);    
  }

  ngOnInit(): void {
  }

  
  ngOnChanges(changes: any): void {
    this.fillList();
  }

  ngAfterViewInit() {
    //this.fillList();
  }

  
  fillList(){
    this.vendorNotesList = this.input_vendorNotesList;  
    this.listData = new MatTableDataSource(this.vendorNotesList);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }
  OpenVendorNotesModal() {

    this.modalRef = this.modalService.show(VendornotesComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-content modal-dialog cascading-modal modal-top',
      containerClass: '',
      animated: true,
      styles: "overflow-y: auto",     
      data: {
        DealID: this.dealID,
        Category:this.Category,
        actionType:"Add"
      } 
    });

    this.modalRef.content.action.subscribe((result: any) => {
     // if (this.vendorID > 0) {
        this.getNotesData().then(res => {
          this.fillList();
        });
      //}
      // else{
      //   this.addNoteEvent.emit(result as VendorNotes);

      //   this.input_vendorNotesList.unshift(result as VendorNotes);
      //   this.vendorNotesList = this.input_vendorNotesList;  
      //   this.listData = new MatTableDataSource(this.vendorNotesList);
      //   this.listData.sort = this.sort;
      //   this.listData.paginator = this.paginator;
      // }
        
    })

  }
  onEdit(row: any) {

    this.modalRef = this.modalService.show(VendornotesComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-content modal-dialog cascading-modal modal-top',
      containerClass: '',
      animated: true,
      styles: "overflow-y: auto",     
      data: {
        DealID: this.dealID,
        Category: this.Category,
        objVendorNotes: Object.assign({}, row),
      } 
    });

    this.modalRef.content.action.subscribe((result: any) => {
        this.getNotesData().then(res=>{
          this.fillList();
        });
        
    })
  }

  DeleteNote(ID, index) {

    //var ID =  this.eventNotesList[index].ID
    if (ID != null) {
      this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
        if (res) {
          this.common.ShowSpinner();
          if (ID > 0) {
            this.service.deleteItem("BMR Notes", ID).then(res => {
              this.getNotesData().then(res => {
                this.fillList();
                this.common.HideSpinner();
              });
            });
          }
          else 
          {
            this.input_vendorNotesList.splice(index, 1);
            this.fillList();
            this.common.HideSpinner();
          }

        }
      })
    }
  }

  async getNotesData() {

    const query = {
      select: 'ID, Notes, Modified, Editor/Title',
      filter: 'DealId eq ' + this.dealID,
      expand: 'Editor',
      orderby:" Modified desc"
    };

    // await this.service.readItems("BMR Notes", query).then(res => {      
    //   this.input_vendorNotesList = res['d'].results;      
    // });

  }


}
