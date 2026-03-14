export interface AuthResponse {
    token: string;
    user: {
        id: number;
        nome: string;
        email: string;        
    };
}
