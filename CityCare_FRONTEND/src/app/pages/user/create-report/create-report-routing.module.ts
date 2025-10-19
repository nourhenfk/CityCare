import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReportPage } from './create-report.page';
import { authGuard } from '../../../guards/auth-guard';

const routes: Routes = [
    {
        path: '',
        component: CreateReportPage,
        canActivate: [authGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreateReportPageRoutingModule { }
