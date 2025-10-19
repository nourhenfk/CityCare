import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPage } from './admin-dashboard.page';
import { adminGuard } from '../../../guards/admin-guard';

const routes: Routes = [
    {
        path: '',
        component: AdminDashboardPage,
        canActivate: [adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminDashboardPageRoutingModule { }
