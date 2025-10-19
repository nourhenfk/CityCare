import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardPage } from './user-dashboard.page';
import { authGuard } from '../../../guards/auth-guard';

const routes: Routes = [
    {
        path: '',
        component: UserDashboardPage,
        canActivate: [authGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserDashboardPageRoutingModule { }
