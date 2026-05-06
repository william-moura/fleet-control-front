export interface ReportCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'Combustível' | 'Frota' | 'Financeiro';
    route: string;
}

export const reportCards: ReportCard[] = [
    {
        id: 'consumption_by_vehicle',
        title: 'Consumo por Veículo',
        description: 'Média de km/l e gastos por placa.',
        icon: 'directions_car',
        category: 'Combustível',
        route: '/reports/consumption-by-vehicle',
    },
    { 
        id: 'total_cost', 
        title: 'Custo Total da Frota', 
        description: 'Soma de manutenções e abastecimentos.', 
        icon: 'payments', 
        category: 'Financeiro', 
        route: '/reports/total-cost'
    },
    {
        id: 'fuel_consumption_by_vehicle',
        title: 'Consumo de Combustível por Veículo',
        description: 'Consumo de combustível por veículo.',
        icon: 'local_gas_station',
        category: 'Combustível',
        route: '/reports/fuel-consumption-by-vehicle',
    }
            
];
