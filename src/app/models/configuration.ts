export interface Configuration {
    alerts: AlertSettings[];
}
export interface AlertSettings {
    daysBefore: number | null;
    alertType: string;
}