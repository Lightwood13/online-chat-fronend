import axios from 'axios';

export const axiosInstance = axios.create({
    transformResponse: (response: string) : any => {
        if (response.length === 0)
            return response;
        return JSON.parse(response, (key: string, value: any) => {
            if (key === 'sentOn')
                return new Date(value);
            else
                return value;
        });
    }
});

export function hasJWTToken(): boolean {
    return localStorage.getItem('token') !== null;
}

export function getJWTToken(): string {
    const token = localStorage.getItem('token');
    return token !== null ? token : '';
}

export function updateJWTToken(newToken: string) {
    localStorage.setItem('token', newToken);
    loadLocalJWTToken();
}

export function loadLocalJWTToken() {
    const token = localStorage.getItem('token');
    if (token !== null) {
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
}