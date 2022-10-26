import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/app/Base/AuthGuard/auth-guard.guard';


import { MarketComponent } from './market/market.component';
import { MarketlistComponent } from './market/marketlist/marketlist.component';

import { SubmarketComponent } from './submarket/submarket.component';
import { SubmarketlistComponent } from './submarket/submarketlist/submarketlist.component';

import { StatusComponent } from './status/status.component';
import { StatuslistComponent } from './status/statuslist/statuslist.component';

import { DealtypeComponent } from './dealtype/dealtype.component';
import { DealtypelistComponent } from './dealtype/dealtypelist/dealtypelist.component';

import { ProjecttypeComponent } from './projecttype/projecttype.component';
import { ProjecttypelistComponent } from './projecttype/projecttypelist/projecttypelist.component';

import { DealgroupComponent } from './dealgroup/dealgroup.component';
import { DealgrouplistComponent } from './dealgroup/dealgrouplist/dealgrouplist.component';

import { BrokerageComponent } from './brokerage/brokerage.component';
import { BrokeragelistComponent } from './brokerage/brokeragelist/brokeragelist.component';

import { StateComponent } from './state/state.component';
import { StatelistComponent } from './state/statelist/statelist.component';

import { ManagementprocessComponent } from './managementprocess/managementprocess.component';
import { ManagementprocesslistComponent } from './managementprocess/managementprocesslist/managementprocesslist.component';

import { BrokerComponent } from './broker/broker.component';
import { BrokerlistComponent } from './broker/brokerlist/brokerlist.component';

import { FootnotesComponent } from './footnotes/footnotes.component';
import { FootnoteslistsComponent } from './footnotes/footnoteslists/footnoteslists.component';

import { ResposiblepartyComponent } from './resposibleparty/resposibleparty.component';
import { ResposiblepartylistComponent } from './resposibleparty/resposiblepartylist/resposiblepartylist.component';

import { CategorizationComponent } from './categorization/categorization.component';
import { CategorizationlistComponent } from './categorization/categorizationlist/categorizationlist.component';

const routes: Routes = [


  {
    path: "Market/form", component: MarketComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Market/list", component: MarketlistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Submarket/form", component: SubmarketComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Submarket/list", component: SubmarketlistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Status/form", component: StatusComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Status/list", component: StatuslistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Dealtype/form", component: DealtypeComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Dealtype/list", component: DealtypelistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Projecttype/form", component: ProjecttypeComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Projecttype/list", component: ProjecttypelistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Funds/form", component: DealgroupComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Funds/list", component: DealgrouplistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Brokerage/form", component: BrokerageComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Brokerage/list", component: BrokeragelistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Marketingprocess/form", component: ManagementprocessComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Marketingprocess/list", component: ManagementprocesslistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Broker/form", component: BrokerComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Broker/list", component: BrokerlistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "State/form", component: StateComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "State/list", component: StatelistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Footnotes/form", component: FootnotesComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Footnotes/list", component: FootnoteslistsComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "ResponsibleParty/form", component: ResposiblepartyComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "ResponsibleParty/list", component: ResposiblepartylistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  },
  {
    path: "Categorization/form", component: CategorizationComponent , runGuardsAndResolvers: 'always' , canActivate : [AuthGuardGuard] , data: {sectionName: "Category"}
  },
  {
    path: "Categorization/list", component: CategorizationlistComponent , runGuardsAndResolvers: 'always' , canActivate : [AuthGuardGuard] , data: {sectionName: "Category"}
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }