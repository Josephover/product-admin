import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Products } from './pages/products/products';
import { Orders } from './pages/orders/orders';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'products', component: Products },
  { path: 'orders', component: Orders }
];
