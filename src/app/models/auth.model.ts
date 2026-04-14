import { Permission } from "./permission";
import { Role } from "./role";

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        nome: string;
        email: string;        
    };
    roles: Role[];
    permissions: Permission[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

