import axios, { AxiosResponse } from 'axios';
import { ChatData } from './model/ChatData';
import { ChatDataWithLastMessage } from './model/ChatDataWithLastMessage';
import { MessageData } from './model/MessageData';
import { UserData } from './model/UserData';

const serverUrl = 'http://localhost:8080';

const axiosInstance = axios.create({
    transformResponse: parseJSON
});

export type ErrorResponse = {
    message: string
}

export function isErrorResponse(obj: unknown): obj is ErrorResponse {
    return typeof obj === 'object' && obj !== null && 'message' in obj;
}

async function getOrThrow<ReturnType>(url: string): Promise<ReturnType> {
    const response = await axiosInstance.get(url);
    return response.data;
}

async function get<ReturnType>(url: string, defaultValue: ReturnType): Promise<ReturnType> {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (e) {
        return defaultValue;
    }
}

export const getChatInfo = async (chatId: string) => 
    getOrThrow<ChatData>(`${serverUrl}/chats/${chatId}/info`);

export const getChatMessages = async (chatId: string) => 
    getOrThrow<MessageData[]>(`${serverUrl}/chats/${chatId}/messages`);

export const getUserInfo = async () =>
    get<UserData | null>(`${serverUrl}/users/me/profile-info`, null);

export const getUsersInfo = async (ids: string[]) =>
    get<UserData[]>(`${serverUrl}/users/profile-info?ids=${ids}`, []);

export const getChatList = async() =>
    get<ChatDataWithLastMessage[]>(`${serverUrl}/chats`, []);

export const getFriends = async() =>
    get<UserData[]>(`${serverUrl}/friends`, []);

export const getFriendRequests = async() =>
    get<UserData[]>(`${serverUrl}/friends/requests`, []);

export const sendFriendRequest = (username: string): Promise<AxiosResponse> => {
    return axiosInstance.post(`${serverUrl}/friends/requests/${username}`);
};

export const acceptFriendRequest = (userId: string): Promise<AxiosResponse> => {
    return axiosInstance.patch(`${serverUrl}/friends/requests/${userId}`);
};

export const rejectFriendRequest = (userId: string): Promise<AxiosResponse> => {
    return axiosInstance.delete(`${serverUrl}/friends/requests/${userId}`);
};

export const removeFriend = async(friendId: string) => {
    await axiosInstance.delete(`${serverUrl}/friends/${friendId}`);
};

export async function sendMessage(chatId: string, text: string) {
    await axiosInstance.post(`${serverUrl}/chats/${chatId}/messages`, {'text': text});
}

export async function uploadProfilePhoto(file: File, chatId: string | null) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = chatId === null ? `${serverUrl}/users/me/profile-photo`
        : `${serverUrl}/chats/${chatId}/profile-photo`;
    await axiosInstance.put(url, formData);
}

export async function createNewGroup(name: string, members: string[]) {
    await axiosInstance.post(`${serverUrl}/chats`, {
            name: name,
            members: members
        });
}

export async function leaveChat(chatId: string) {
    await axiosInstance.delete(`${serverUrl}/chats/${chatId}/users/me`);
}

export async function kickUser(chatId: string, userId: string) {
    await axiosInstance.delete(`${serverUrl}/chats/${chatId}/users/${userId}`);
}

export async function promoteUser(chatId: string, userId: string) {
    await axiosInstance.put(`${serverUrl}/chats/${chatId}/admins/${userId}`);
}

export async function demoteUser(chatId: string, userId: string) {
    await axiosInstance.delete(`${serverUrl}/chats/${chatId}/admins/${userId}`);
}

const dateFields = new Set(['sentOn', 'lastMessageSentOn', 'createdOn', 'timestamp']);

export function parseJSON(s: string) {
    if (s.length === 0)
        return s;
    return JSON.parse(s, (key: string, value) => {
        if (dateFields.has(key) && value !== null)
            return new Date(value);
        else
            return value;
    });
}

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