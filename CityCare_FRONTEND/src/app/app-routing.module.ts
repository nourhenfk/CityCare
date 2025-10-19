import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/dashboard/admin-dashboard.module').then(m => m.AdminDashboardPageModule),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/user/dashboard/user-dashboard.module').then(m => m.UserDashboardPageModule),
    canActivate: [authGuard]
  }
  ,
  {
    path: 'create-report',
    loadChildren: () => import('./pages/user/create-report/create-report.module').then(m => m.CreateReportPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'report-detail/:id',
    loadChildren: () => import('./pages/shared/report-detail/report-detail.module').then(m => m.ReportDetailPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/shared/map/map.module').then(m => m.MapPageModule),
    canActivate: [authGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
