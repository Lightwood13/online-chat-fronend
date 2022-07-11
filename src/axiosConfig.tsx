import axios from 'axios';

export function parseJSON(s: string): any {
    if (s.length === 0)
            return s;
    return JSON.parse(s, (key: string, value: any) => {
        if (key === 'sentOn' || key === 'lastMessageSentOn')
            return new Date(value);
        else
            return value;
    });
}

export const axiosInstance = axios.create({
    transformResponse: parseJSON
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