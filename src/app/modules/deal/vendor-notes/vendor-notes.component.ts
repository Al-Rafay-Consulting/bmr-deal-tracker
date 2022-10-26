import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastType } from 'src/app/Enum/ToastType';
import { ToastService, MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { GeneralService } from 'src/app/services/general.service';
import { GenericService } from 'src/app/services/generic.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BLBase } from 'src/app/Base/BLBase/BLBase.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import {VendorNotes} from '../vendor-notes.model';
import {Vendor} from 'src/app/modules/deal/vendor/vendor.model';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../Base/Common.service';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { Autocomplete } from 'src/app/Base/Autocomplete';
declare let SP: any;
//import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-vendornotes',
  templateUrl: './vendor-notes.component.html',
  styleUrls: []
})
export class VendornotesComponent extends SpBLBase<VendorNotes> implements OnInit {

  
  AutoBMRDealTeam: Autocomplete < any > = new Autocomplete < any > ("Title", "Id");


  actionType:string = "";
  DealID: number = 0;
  Category: string = '';
  vendorNotesList: VendorNotes[] = [];

  objVendorNotes:VendorNotes = new VendorNotes();

  //public service: GenericService<ClientNotes> = new GenericService<ClientNotes>(this.http);
  action:Subject<VendorNotes> = new Subject<VendorNotes>();  
  constructor(    
    public http:HttpClient,
    public service: SPOperationsService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,    
    public modalRef: MDBModalRef,
    public messageDialog: MessageDialogeService,
    public common:CommonService
    
  ) { 
    
    super(service, router, route, spinner, toast, dialog, messageDialog);
    
    this.formTitle =  "Add Notes";

    this.addListTitle("BMR Notes", "BMR Notes");
    this.isGetByPrimaryKey = false;
    this.primaryKey = 0;
   

  }

  setSectionName(){
    this.sectionName = "BMR Notes";
  }

  public Initializeobject() {
    this.formData = new VendorNotes();
  }

  
  AfterOnInit() {
     
    this.formTitle = this.actionType == "Attachment"? "Add Attachment" : "Add Notes";
    this.SavebuttonText = 'Submit';    
    if(this.objVendorNotes.ID > 0){
    this.formData.ID = this.objVendorNotes.ID;
    this.formData.DealId = this.objVendorNotes.DealId;
    this.formData.Notes = this.objVendorNotes.Notes;

    }
    

  }



  ngOnInit(): void {
    super.ngOnInit();
  }

  onCreate(form: NgForm) {
    // Sameer:06/18/2021
    //this.router.navigate(['/clientnotes'], { replaceUrl: true });

    this.Create();

  }

  BeforeUpsert(jsonObject: any) {
    //form.value.ClientID = this.ClientID;
  }

  onSubmit(form: NgForm) {

    var objNotes = new VendorNotes();
    this.primaryKey = this.formData.ID;
    objNotes.ID = this.formData.ID;
    objNotes.Notes = this.formData.Notes;

   // objNotes.Notes = this.wysiwyg.textarea.nativeElement.innerHTML;

    
      objNotes.DealId = this.DealID;
      this.insertRecord(objNotes);
    
    // else
    // {
    //   this.action.next(objNotes);
    //   this.modalRef.hide();
    // }
    
  }
  AfterInsert() {
    //this.router.navigate(['/eventnotes']);
    this.action.next();
    this.modalRef.hide();
  }

  
  AfterUpdate() {
    this.action.next();
    this.modalRef.hide();
  }

  onReload(form: NgForm) {
    this.Reload(form);
  }

  DeleteNote(ID) {

    if (ID != 0 && ID != null) {
      this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
        if (res) {
          this.deleteRecord(ID);

        }
      })
    }
  }

  AfterDelete() {
    this.modalRef.hide();
  }

  onEdit(row){
  
    document.getElementById('modalBodyArea').scrollTop = 0;
    if(row !=null)
    {
      this.formData.ID = row.ID;
      this.formData.Notes = row.Notes;   
      this.primaryKey = row.ID;
      this.SavebuttonText = 'Update';
    }

  }

  SaveAttachment(form: NgForm) {
  
    var itemID = 0;
    if(this.vendorNotesList.length > 0)
     itemID = this.vendorNotesList[0].ID;

     this.uploadFileAsAttachment(itemID, this.filesToUpload, this.listTitle)
  
    
  }

  uploadFileAsAttachment(itemID, filesToAttach, listTitle) {
    var count = 0;
    if (filesToAttach.length > 0) {
        count = filesToAttach.length;
        this.attachFile(filesToAttach[--count], itemID, listTitle, count);
    }
    else {
        //window.location.href = indexPageUrl;
    }

  }

  //fileToUpload: File | null = null;
  filesToUpload: FileList | null = null;
 
  handleFileInput(files: FileList) {

    this.filesToUpload = files;
    
  }
  //count_attachment:number = 0;
  attachFile(fileToAttach, itemID, listTitle, count) {
    //this.count_attachment = count;
    var aFile = fileToAttach;
    {
      if (aFile) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(aFile);
        var itemUrl = this.service.getReadURL(listTitle, null)
        var FormDigestValue = this.service.context.FormDigestValue
        reader.onload = (function () {
          return function (e) {
            var buffer = e.target.result;
            var contents = _arrayBufferToBase64(buffer);

            var attach = new SP.RequestExecutor("/");
            attach.executeAsync({
              url: encodeURIComponent("https://alrafayconsulting.sharepoint.com/sites/DMSDemo2/crm/_api/web/lists/GetByTitle('Vendor Notes')/items" + "(" + itemID + ")/AttachmentFiles/add(FileName='" + aFile.name + "')"),
              method: "POST",
              binaryStringRequestBody: true,
              body: contents,
              headers: {
                'accept': 'application/json;odata=verbose',
                "X-RequestDigest": FormDigestValue
              },
              success: fsuccess(fileToAttach, itemID, listTitle, count),
              error: ferror,
              state: "Update"
            });

          };
        })();

        
      }
      else {
       // window.location.href = indexPageUrl;
      }
    }

    function _arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return binary;
    }

    function fsuccess(fileToAttach, itemID, listTitle, count) {
      // var msg = JSON.parse(data.body).d.FileName + ' successfully attached. Verify by View Item ' + list.url + '/DispForm.aspx?ID=' + itemID;
      // msg += ' or view/download attachment by visiting URL: ' + list.url + '/Attachments/' + itemID + '/' + JSON.parse(data.body).d.FileName;
      // console.log(msg);
  
      if (count > 0) {
        this.attachFile(fileToAttach[--count], itemID, listTitle, count);
      }
      else {
        //window.location.href = indexPageUrl;
      }
    }
  
    function ferror(data) {
      console.log('error:\n\n' + JSON.parse(data.body).error.message.value.trim());
      if (count > 0) {
        //this.attachFile(fileToAttach, itemID, listTitle, count);
      }
      else {
        //window.location.href = indexPageUrl;
      }
    }
  }
  getDealTeamUsers() {
    this.service.getUsersByGroupName("BMR Deal Team").then(res => {
      // console.log(res);
      this.AutoBMRDealTeam.data = null;
      this.AutoBMRDealTeam.data = res['d']['results'] as any[];
      this.AutoBMRDealTeam.resultObserve();
    })
  }
  getSubmitText(): string {

    if (this.DealID > 0) {
      if (this.formData.ID > 0)
        return "Update"
      else
        return this.SavebuttonText
    } else
      return 'Add'

  }

  // _arrayBufferToBase64(buffer) {
  //   var binary = '';
  //   var bytes = new Uint8Array(buffer);
  //   var len = bytes.byteLength;
  //   for (var i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return binary;
  // }

}
