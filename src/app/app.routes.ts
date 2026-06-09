import { Routes } from '@angular/router';
import { authGuard } from './components/authentication/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/authentication/authentication')
        .then(m => m.Authentication)
  },
  {
    path: 'congestion-levels',
    loadComponent: () =>
      import('./components/congestion-levels/congestion-levels')
        .then(m => m.CongestionLevels),
    canActivate: [authGuard]
  },
  {
    path: 'signal-master',
    loadComponent: () =>
      import('./components/signal-master/signal-master')
        .then(m => m.SignalMaster),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard')
        .then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/my-profile/my-profile')
        .then(m => m.MyProfile),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'congestion-levels'
  }
];
