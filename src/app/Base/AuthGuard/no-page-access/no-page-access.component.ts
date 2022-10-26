import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-no-page-access',
  templateUrl: './no-page-access.component.html',
  styleUrls: ['./no-page-access.component.scss']
})
export class NoPageAccessComponent implements OnInit {

  location:string = "";

  constructor(public route?: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.location = "";
        this.location = params['location'];        
    });
  }

}
