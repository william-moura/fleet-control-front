export interface ReportCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'Combustível' | 'Frota' | 'Financeiro' | 'Motorista';
    route: string;
    filter?: boolean;
}

export const reportCards: ReportCard[] = [
    {
        id: 'consumption_by_vehicle',
        title: 'Consumo por Veículo',
        description: 'Média de km/l e gastos por placa.',
        icon: 'directions_car',
        category: 'Combustível',
        route: '/reports/consumption-by-vehicle',
        filter: true,
    },
    { 
        id: 'total_cost', 
        title: 'Custo Total da Frota', 
        description: 'Soma de manutenções e abastecimentos.', 
        icon: 'payments', 
        category: 'Financeiro', 
        route: '/reports/total-cost',
        filter: true,
    },
    {
        id: 'consumption_by_driver',
        title: 'Consumo por Motorista',
        description: 'Consumo de combustível por motorista.',
        icon: 'directions_car',
        category: 'Combustível',
        route: '/reports/consumption-by-driver',
        filter: true,
    },
    {
        id: 'active_vehicles',
        title: 'Relatório geral de Veículos',
        description: 'Relatório geral de Veículos.',
        icon: 'directions_car',
        category: 'Frota',
        route: '/reports/active-vehicles',
        filter: false,
    },
    {
        id: 'vehicle_higher_cost',
        title: 'Veículos com Maior Custo',
        description: 'Veículos com maior custo de manutenção e abastecimento.',
        icon: 'directions_car',
        category: 'Frota',
        route: '/reports/vehicle-highest-cost',
        filter: true,
    },
    {
        id: 'monthly_fuel_cost',
        title: 'Custo Mensal de Combustível por Veículo',
        description: 'Custo mensal de combustível por veículo.',
        icon: 'local_gas_station',
        category: 'Combustível',
        route: '/reports/monthly-fuel-cost',
        filter: true,
    },
    {
        id: 'driver_with_fine_vehicles',
        title: 'Motoristas com Multas',
        description: 'Motoristas com multas de veículos.',
        icon: 'payments',
        category: 'Financeiro',
        route: '/reports/driver-with-fine-vehicles',
        filter: true,
    },
    {
        id: 'vehicles_travels',
        title: 'Relatório de utilização',
        description: 'Relatório de utilização de veículos.',
        icon: 'directions_car',
        category: 'Frota',
        route: '/reports/usage-report',
        filter: false,
    },
    {
        id: 'vehicle_maintenance_report',
        title: 'Relatório de manutenção',
        description: 'Relatório de manutenção de veículos.',
        icon: 'directions_car',
        category: 'Frota',
        route: '/reports/maintenance-report',
        filter: false,
    },
    {
        id: 'consumption_general_report',
        title: 'Relatório geral de consumo',
        description: 'Relatório geral de consumo de veículos.',
        icon: 'directions_car',
        category: 'Combustível',
        route: '/reports/consumption-general-report',
        filter: false,
    },
    {
        id: 'driver_general_report',
        title: 'Relatório geral de motoristas',
        description: 'Relatório geral de motoristas.',
        icon: 'directions_car',
        category: 'Motorista',
        route: '/reports/driver-general-report',
        filter: false,
    },
];
