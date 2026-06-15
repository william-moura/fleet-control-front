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
import { ReportPreviewComponent } from './components/report-preview-component/report-preview-component';
import { VehicleFines } from './pages/vehicle-fines/vehicle-fines';
import { Roles } from './pages/roles/roles';
import { AddUpdateVehicle } from './pages/add-update-vehicle/add-update-vehicle';
import { AddUpdateDriver } from './pages/add-update-driver/add-update-driver';
import { AddUpdateVehicleFine } from './pages/add-update-vehicle-fine/add-update-vehicle-fine';
import { AddUpdateKm } from './pages/add-update-km/add-update-km';
import { AddUpdateMaintenance } from './pages/add-update-maintenance/add-update-maintenance';
import { AddUpdateFuel } from './pages/add-update-fuel/add-update-fuel';
import { AddUpdateSupplier } from './pages/add-update-supplier/add-update-supplier';
import { AddUpdateUsers } from './pages/add-update-users/add-update-users';

export const routes: Routes = [
    { path: 'welcome', component: Welcome, data: { icon: 'waving_hand', name: 'Bem-vindo', display: true}, canActivate: [authGuard]},
    { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard',  permission: 'acessar_dashboards'}, canActivate: [authGuard, roleGuard] },
    { path: 'drivers', component: DriversComponent, data: { icon: 'groups', name: 'Motoristas', permission: 'listar_motoristas'}, canActivate: [authGuard, roleGuard] },
    { path: 'vehicles', component: Vehicles, data: { icon: 'local_shipping', name: 'Veículos', permission: 'listar_veiculos'}, canActivate: [authGuard, roleGuard] },
    { path: 'vehicle-fines', component: VehicleFines, data: { icon: 'payment', name: 'Multas', permission: 'listar_multas_veiculo'}, canActivate: [authGuard, roleGuard] },
    { path: 'kilometers', component: KmComponent, data: { icon: 'speed', name: 'Kilometragem' }, canActivate: [authGuard] },
    { path: 'maintenance', component: MaintenanceComponent, data: { icon: 'build', name: 'Manutenção' , permission: 'listar_manutencoes'}, canActivate: [authGuard, roleGuard] },
    { path: 'fuel', component: FuelComponent, data: { icon: 'local_gas_station', name: 'Combustível' , permission: 'listar_abastecimento'}, canActivate: [authGuard, roleGuard] },
    { path: 'reports', component: ReportsComponent, data: { icon: 'report', name: 'Relatórios' , permission: 'acessar_relatorios'}, canActivate: [authGuard, roleGuard] },
    { path: 'supplier', component: SupplierComponent, data: { icon: 'local_shipping', name: 'Fornecedores' , permission: 'listar_fornecedores'}, canActivate: [authGuard, roleGuard] },
    { path: 'users', component: Users, data: { icon: 'groups', name: 'Usuários' , permission: 'listar_usuarios'}, canActivate: [authGuard, roleGuard] },
    { path: 'login', component: LoginComponent },    
    { path: 'report/preview/:id', component: ReportPreviewComponent, data: { icon: 'report', name: 'Visualizar Relatório', permission: 'nothing'} },
    { path: 'users/manage-roles', component: Roles, data: { icon: 'manage_accounts', name: 'Gerenciar Cargos', display: false} },
    { path: 'vehicle/edit', component: AddUpdateVehicle, data: { icon: 'directions_car', name: 'Veículo', display: false} },
    { path: 'vehicle/new', component: AddUpdateVehicle, data: { icon: 'directions_car', name: 'Veículo', display: false} },
    { path: 'driver/edit', component: AddUpdateDriver, data: { icon: 'groups', name: 'Motorista', display: false} },
    { path: 'driver/new', component: AddUpdateDriver, data: { icon: 'groups', name: 'Motorista', display: false} },
    { path: 'vehicle-fine/edit', component: AddUpdateVehicleFine, data: { icon: 'payment', name: 'Multa', display: false} },
    { path: 'vehicle-fine/new', component: AddUpdateVehicleFine, data: { icon: 'payment', name: 'Multa', display: false} },
    { path: 'kilometer/edit', component: AddUpdateKm, data: { icon: 'speed', name: 'Quilometragem', display: false} },
    { path: 'kilometer/new', component: AddUpdateKm, data: { icon: 'speed', name: 'Quilometragem', display: false} },
    { path: 'maintenance/edit', component: AddUpdateMaintenance, data: { icon: 'build', name: 'Manutenção', display: false} },
    { path: 'maintenance/new', component: AddUpdateMaintenance, data: { icon: 'build', name: 'Manutenção', display: false} },
    { path: 'fuel/edit', component: AddUpdateFuel, data: { icon: 'local_gas_station', name: 'Abastecimento', display: false} },
    { path: 'fuel/new', component: AddUpdateFuel, data: { icon: 'local_gas_station', name: 'Abastecimento', display: false} },
    { path: 'supplier/edit', component: AddUpdateSupplier, data: { icon: 'local_shipping', name: 'Fornecedor', display: false} },
    { path: 'supplier/new', component: AddUpdateSupplier, data: { icon: 'local_shipping', name: 'Fornecedor', display: false} },
    { path: 'users/edit', component: AddUpdateUsers, data: { icon: 'groups', name: 'Usuário', display: false} },
    { path: 'users/new', component: AddUpdateUsers, data: { icon: 'groups', name: 'Usuário', display: false} }
];
