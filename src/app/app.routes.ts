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
import { SupplierComponent } from './pages/supplier-component/supplier-component';
import { Users } from './pages/users/users';
import { roleGuard } from './auth-guard';
import { Welcome } from './pages/welcome/welcome';

export const routes: Routes = [
    { path: 'welcome', component: Welcome, data: { icon: 'waving_hand', name: 'Bem-vindo', display: true}, canActivate: [authGuard]},
    { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard',  permission: 'acessar_dashboards'}, canActivate: [authGuard, roleGuard] },
    { path: 'drivers', component: DriversComponent, data: { icon: 'groups', name: 'Motoristas', permission: 'listar_motoristas'}, canActivate: [authGuard, roleGuard] },
    { path: 'vehicles', component: Vehicles, data: { icon: 'local_shipping', name: 'Veículos', permission: 'listar_veiculos'}, canActivate: [authGuard, roleGuard] },
    { path: 'kilometers', component: KmComponent, data: { icon: 'speed', name: 'Kilometragem' }, canActivate: [authGuard] },
    { path: 'maintenance', component: MaintenanceComponent, data: { icon: 'build', name: 'Manutenção' , permission: 'listar_manutencoes'}, canActivate: [authGuard, roleGuard] },
    { path: 'fuel', component: FuelComponent, data: { icon: 'local_gas_station', name: 'Combustível' , permission: 'listar_abastecimento'}, canActivate: [authGuard, roleGuard] },
    { path: 'reports', component: ReportsComponent, data: { icon: 'report', name: 'Relatórios' , permission: 'acessar_relatorios'}, canActivate: [authGuard, roleGuard] },
    { path: 'supplier', component: SupplierComponent, data: { icon: 'local_shipping', name: 'Fornecedores' , permission: 'listar_fornecedores'}, canActivate: [authGuard, roleGuard] },
    { path: 'users', component: Users, data: { icon: 'groups', name: 'Usuários' , permission: 'listar_usuarios'}, canActivate: [authGuard, roleGuard] },
    { path: 'login', component: LoginComponent },    
];
