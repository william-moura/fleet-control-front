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
import { Prefeituras } from './pages/prefeituras/prefeituras';
import { Orgaos } from './pages/orgaos/orgaos';
import { Secretarias } from './pages/secretarias/secretarias';
import { AddUpdatePrefeitura } from './pages/add-update-prefeitura/add-update-prefeitura';
import { AddUpdateOrgao } from './pages/add-update-orgao/add-update-orgao';
import { AddUpdateSecretaria } from './pages/add-update-secretaria/add-update-secretaria';
import { Configurations } from './pages/configurations/configurations';
import { TravelsComponent } from './pages/travels-component/travels-component';
import { AddUpdateTravel } from './pages/add-update-travel/add-update-travel';

export const routes: Routes = [
    { path: 'welcome', component: Welcome, data: { icon: 'waving_hand', name: 'Bem-vindo', display: true}, canActivate: [authGuard], pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard',  permission: 'acessar_dashboards', display: true}, canActivate: [authGuard, roleGuard] },    
    { 
        path: '',
        children: [
            { path: 'drivers', component: DriversComponent, data: { icon: 'groups', name: 'Motoristas', permission: 'listar_motoristas'}, canActivate: [authGuard, roleGuard] },
            { path: 'vehicles', component: Vehicles, data: { icon: 'local_shipping', name: 'Veículos', permission: 'listar_veiculos'}, canActivate: [authGuard, roleGuard] },
            { path: 'vehicle-fines', component: VehicleFines, data: { icon: 'payment', name: 'Multas', permission: 'listar_multas_veiculos'}, canActivate: [authGuard, roleGuard] },
            { path: 'supplier', component: SupplierComponent, data: { icon: 'local_shipping', name: 'Fornecedores' , permission: 'listar_fornecedores', display: true}, canActivate: [authGuard, roleGuard] },
            { path: 'users', component: Users, data: { icon: 'groups', name: 'Usuários' , permission: 'listar_usuarios', display: true}, canActivate: [authGuard, roleGuard] },
        ],
        data: { icon: 'dashboard', name: 'Cadastros', permission: 'acessar_dashboards'}, canActivate: [authGuard, roleGuard]
    },
    { 
        path: '',
        children: [
            { path: 'prefeituras', component: Prefeituras, data: { icon: 'home', name: 'Prefeituras' }},
            { path: 'orgaos', component: Orgaos, data: { icon: 'home', name: 'Órgãos' }},
            { path: 'secretarias', component: Secretarias, data: { icon: 'home', name: 'Secretarias' }},
        ],
        data: { icon: 'home', name: 'Empresas', permission: 'acessar_dashboards'}, canActivate: [authGuard, roleGuard]
    },
    { 
        path: '',
        children: [
            { path: 'kilometers', component: KmComponent, data: { icon: 'speed', name: 'Kilometragem', display: true }, canActivate: [authGuard] },
            { path: 'maintenance', component: MaintenanceComponent, data: { icon: 'build', name: 'Manutenção' , permission: 'listar_manutencoes', display: true}, canActivate: [authGuard, roleGuard] },
            { path: 'fuel', component: FuelComponent, data: { icon: 'local_gas_station', name: 'Combustível' , permission: 'listar_abastecimento', display: true}, canActivate: [authGuard, roleGuard] },
            { path: 'travels', component: TravelsComponent, data: { icon: 'local_shipping', name: 'Viagens' , permission: 'listar_abastecimento', display: true}, canActivate: [authGuard, roleGuard] },
        ],
        data: { icon: 'local_shipping', name: 'Movimentação', permission: 'acessar_dashboards'}, canActivate: [authGuard, roleGuard]
    },    
    { path: 'reports', component: ReportsComponent, data: { icon: 'report', name: 'Relatórios' , permission: 'acessar_relatorios', display: true}, canActivate: [authGuard, roleGuard] },
    { path: 'configurations', component: Configurations, data: { icon: 'settings', name: 'Configurações de alertas', display: true}, canActivate: [authGuard], pathMatch: 'full' },    
    
    
    { path: 'login', component: LoginComponent },    
    { path: 'report/preview/:id', component: ReportPreviewComponent, data: { icon: 'report', name: 'Visualizar Relatório', permission: 'nothing'} },
    { path: 'users/manage-roles', component: Roles, data: { icon: 'manage_accounts', name: 'Gerenciar Cargos', display: false} },
    { path: 'vehicle/edit/:id', component: AddUpdateVehicle, data: { icon: 'directions_car', name: 'Veículo', display: false} },
    { path: 'vehicle/new', component: AddUpdateVehicle, data: { icon: 'directions_car', name: 'Veículo', display: false} },
    { path: 'driver/edit/:id', component: AddUpdateDriver, data: { icon: 'groups', name: 'Motorista', display: false} },
    { path: 'driver/new', component: AddUpdateDriver, data: { icon: 'groups', name: 'Motorista', display: false} },
    { path: 'vehicle-fine/edit/:id', component: AddUpdateVehicleFine, data: { icon: 'payment', name: 'Multa', display: false} },
    { path: 'vehicle-fine/new', component: AddUpdateVehicleFine, data: { icon: 'payment', name: 'Multa', display: false} },
    { path: 'kilometer/edit/:id', component: AddUpdateKm, data: { icon: 'speed', name: 'Quilometragem', display: false} },
    { path: 'kilometer/new', component: AddUpdateKm, data: { icon: 'speed', name: 'Quilometragem', display: false} },
    { path: 'maintenance/edit/:id', component: AddUpdateMaintenance, data: { icon: 'build', name: 'Manutenção', display: false} },
    { path: 'maintenance/new', component: AddUpdateMaintenance, data: { icon: 'build', name: 'Manutenção', display: false} },
    { path: 'fuel/edit/:id', component: AddUpdateFuel, data: { icon: 'local_gas_station', name: 'Abastecimento', display: false} },
    { path: 'fuel/new', component: AddUpdateFuel, data: { icon: 'local_gas_station', name: 'Abastecimento', display: false} },
    { path: 'supplier/edit/:id', component: AddUpdateSupplier, data: { icon: 'local_shipping', name: 'Fornecedor', display: false} },
    { path: 'supplier/new', component: AddUpdateSupplier, data: { icon: 'local_shipping', name: 'Fornecedor', display: false} },
    { path: 'users/edit/:id', component: AddUpdateUsers, data: { icon: 'groups', name: 'Usuário', display: false} },
    { path: 'users/new', component: AddUpdateUsers, data: { icon: 'groups', name: 'Usuário', display: false} },
    { path: 'prefeitura/edit/:id', component: AddUpdatePrefeitura, data: { icon: 'home', name: 'Prefeitura', display: false} },
    { path: 'prefeitura/new', component: AddUpdatePrefeitura, data: { icon: 'home', name: 'Prefeitura', display: false} },
    { path: 'orgao/edit/:id', component: AddUpdateOrgao, data: { icon: 'home', name: 'Órgão', display: false} },
    { path: 'orgao/new', component: AddUpdateOrgao, data: { icon: 'home', name: 'Órgão', display: false} },
    { path: 'secretaria/edit/:id', component: AddUpdateSecretaria, data: { icon: 'home', name: 'Secretaria', display: false} },
    { path: 'secretaria/new', component: AddUpdateSecretaria, data: { icon: 'home', name: 'Secretaria', display: false} },
    { path: 'travel/edit/:id', component: AddUpdateTravel, data: { icon: 'local_shipping', name: 'Viagem', display: false} },
    { path: 'travel/new', component: AddUpdateTravel, data: { icon: 'local_shipping', name: 'Viagem', display: false} },
    { path: '**', redirectTo: 'welcome', pathMatch: 'full' }    
];
