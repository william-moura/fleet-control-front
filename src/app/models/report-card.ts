export interface ReportCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'Combustível' | 'Frota' | 'Financeiro';
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
        title: 'Veículos Ativos',
        description: 'Veículos ativos no sistema.',
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
    }
];
