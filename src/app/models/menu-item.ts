export interface MenuItem {
    path?: string;
    title: string;
    icon?: string;
    data: {
        icon: string;
        name: string;
        permission: string;
        display: boolean;
    };
    children?: MenuItem[];
    expanded?: boolean;
}
