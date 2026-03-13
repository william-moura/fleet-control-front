import { Routes } from '@angular/router';
import { DriversComponent } from './pages/drivers-component/drivers-component';
import { Vehicles } from './pages/vehicles/vehicles';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { KmComponent } from './pages/km-component/km-component';
import { MaintenanceComponent } from './pages/maintenance-component/maintenance-component';
import { FuelComponent } from './pages/fuel-component/fuel-component';
import { ReportsComponent } from './pages/reports-component/reports-component';
import { LoginComponent } from './pages/login-component/login-component';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard' }, canActivate: [authGuard] },
    { path: 'drivers', component: DriversComponent, data: { icon: 'groups', name: 'Motoristas' }, canActivate: [authGuard] },
    { path: 'vehicles', component: Vehicles, data: { icon: 'local_shipping', name: 'Veículos' }, canActivate: [authGuard] },
    { path: 'kilometers', component: KmComponent, data: { icon: 'speed', name: 'Kilometragem' }, canActivate: [authGuard] },
    { path: 'maintenance', component: MaintenanceComponent, data: { icon: 'build', name: 'Manutenção' }, canActivate: [authGuard] },
    { path: 'fuel', component: FuelComponent, data: { icon: 'local_gas_station', name: 'Combustível' }, canActivate: [authGuard] },
    { path: 'reports', component: ReportsComponent, data: { icon: 'report', name: 'Relatórios' }, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
];
