
export interface User {
    username: string;
    email: string;
    password: string;
    isGoogle?: boolean; 
}

export interface UserOutput {
    username: string;
    email: string;
    accessToken?: string;
    refershToken?: string;
    isGoogle?: boolean;
}

