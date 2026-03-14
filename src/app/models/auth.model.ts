export interface AuthResponse {
    token: string;
    user: {
        id: number;
        nome: string;
        email: string;        
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

