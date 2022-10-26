import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealComponent } from './deal/deal.component';
import { AuthGuardGuard } from 'src/app/Base/AuthGuard/auth-guard.guard';


import { DealportalComponent } from './dealportal/dealportal.component';
import { DealslistComponent } from './dealslist/dealslist.component';



const routes: Routes = [

    {
        path: 'form', component: DealComponent, runGuardsAndResolvers: 'always', canActivate:[AuthGuardGuard], data: {sectionName: "Deal"}
    },
    {
        path: "deals/main", component: DealportalComponent, runGuardsAndResolvers: 'always', canActivate:[AuthGuardGuard], data: {sectionName: "Category"}
      } ,
      {
        path: "deals/list", component: DealslistComponent, runGuardsAndResolvers: 'always', canActivate:[AuthGuardGuard], data: {sectionName: "Category"}
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealRoutingModule { }
