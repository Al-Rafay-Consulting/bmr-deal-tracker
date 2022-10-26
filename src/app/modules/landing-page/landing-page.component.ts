import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LandingPageService } from './landing-page.service';
import { SharePointConfigService } from 'src/app/Base/SharePoint/share-point-config.service';
import { CommonService } from 'src/app/Base/Common.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  
  public Home_ContractImg = "";
  public Home_CategoryImg = ""
  public Home_VendorImg = ""  
  public Home_ViewsImg = ""  
  public Home_AdminImg = ""  
  
  isapploaded:boolean = false;

  constructor(
    public router: Router,
    public spConfigService:SharePointConfigService,
    public lpService:LandingPageService,
    public common:CommonService
  ) {
    this.common.hideGlobalSearch = true;  
   }

  ngOnInit(): void {

    this.getEventPortalImages();
  }

  openDealsList(){
    this.router.navigate(['/portal/deals/list']);
  }

  openReportsList(){
    this.router.navigate(['/reports']);
  }
  openNewDealList(){
    this.router.navigate(['/portal/form']);
  }


  getEventPortalImages(){

    if (this.lpService.HomeImages.length == 0) {
      this.common.ShowSpinner();
      this.spConfigService.getRecordByGroupAsync("Home").then(res => {        
        this.lpService.HomeImages = res;                      
        this.setImages();       
        setTimeout(() => {
          this.isapploaded = true;
          this.common.HideSpinner();
        }, 1000);
        
        
      })
    }         
    else
    {
      this.isapploaded = true;
      this.setImages();
    }
    
  }

  setImages(){
    // this.Home_ContractImg = this.getFilteredImagesByTitle("Home_ContractImg", this.lpService.HomeImages)[0].ListUrl;
    // this.Home_CategoryImg = this.getFilteredImagesByTitle("Home_CategoryImg", this.lpService.HomeImages)[0].ListUrl;
    // this.Home_VendorImg = this.getFilteredImagesByTitle("Home_VendorImg", this.lpService.HomeImages)[0].ListUrl;
    // this.Home_ViewsImg = this.getFilteredImagesByTitle("Home_ViewsImg", this.lpService.HomeImages)[0].ListUrl;    
    // this.Home_AdminImg = this.getFilteredImagesByTitle("Home_AdminImg", this.lpService.HomeImages)[0].ListUrl;  
  }

  getFilteredImagesByTitle(Title: string, arr: []): any {
    return arr.filter(function (x) {
      return x['Title'] == Title;
    })
  }


}
