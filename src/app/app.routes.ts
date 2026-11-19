import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';
import { Equipment } from './pages/equipment/equipment';
import { authGuard } from './guards/auth-guard';
import { Admin } from './pages/admin/admin';
import { adminGuard } from './guards/admin-guard';
import { Reservations } from './pages/reservations/reservations';



export const routes: Routes = [
  { path: '', component: Landing, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'equipment', component: Equipment, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },
  { path: 'reservations', component: Reservations, canActivate: [authGuard] },

];