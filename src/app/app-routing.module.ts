import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { BLBase } from './Base/BLBase/BLBase.component';
import { SpBLBase } from './Base/SpBLBase/SpBLBase.component';
import { ConfirmDialogeComponent } from './confirm-dialoge/confirm-dialoge.component';
import { DragDropFileComponent } from './modules/shared/drag-drop-file/drag-drop-file.component';
import { PageNotFoundComponent } from './Base/AuthGuard/page-not-found/page-not-found.component'
import { NoPageAccessComponent } from './Base/AuthGuard/no-page-access/no-page-access.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { ReportsComponent } from './modules/reports/reports.component';

import { CanlendarAvailComponent } from './canlendar-avail/canlendar-avail.component';
const routes: Routes = [
    // Default Route
    { path: '', redirectTo: '/home', pathMatch: 'full' },    
    { path: "home", component: LandingPageComponent, runGuardsAndResolvers: 'always' },        
    { path: "calendar", component: CanlendarAvailComponent, runGuardsAndResolvers: 'always' },
    { path: "AccessDenied", component: NoPageAccessComponent, runGuardsAndResolvers: 'always' },         
    { path: "reports", component: ReportsComponent, runGuardsAndResolvers: 'always' },
    // Lazy Loading applied    
    { path: 'portal', loadChildren: () => import('./modules/deal/deal.module').then(m => m.DealModule) },
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
    //{ path: 'views', loadChildren: () => import('./modules/views/views.module').then(m => m.ViewsModule) },
    //{ path: 'rbac', loadChildren: () => import('./rbac/rbac-module').then(m => m.RBACModule) },    
    { path: '**', component:PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { 
        useHash: true, 
        onSameUrlNavigation: 'reload',
        preloadingStrategy:PreloadAllModules
    })],
    exports: [RouterModule]
})

export class AppRoutingModule { }

export const RoutingComponent = [                  
    BLBase,      
    SpBLBase,
    LandingPageComponent,
    DragDropFileComponent,
    ReportsComponent              
]

export const EntryComponent = [    
    ConfirmDialogeComponent                       
]
