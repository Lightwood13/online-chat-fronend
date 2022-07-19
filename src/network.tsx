import axios, { AxiosResponse } from 'axios';
import { ChatData } from './model/ChatData';
import { ChatDataWithLastMessage } from './model/ChatDataWithLastMessage';
import { MessageData } from './model/MessageData';
import { UserData } from './model/UserData';

const serverUrl = 'http://localhost:8080';

const axiosInstance = axios.create({
    transformResponse: parseJSON
});

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
    getOrThrow<ChatData>(`${serverUrl}/chat/info/${chatId}`);

export const getChatMessages = async (chatId: string) => 
    getOrThrow<MessageData[]>(`${serverUrl}/chat/messages/${chatId}`);

export const getUserInfo = async () =>
    get<UserData | null>(`${serverUrl}/my-profile-info`, null);

export const getUsersInfo = async (ids: string[]) =>
    get<UserData[]>(`${serverUrl}/profile-info?ids=${ids}`, []);

export const getChatList = async() =>
    get<ChatDataWithLastMessage[]>(`${serverUrl}/chats`, []);

export const getFriends = async() =>
    get<UserData[]>(`${serverUrl}/my-friends`, []);

export const getFriendRequests = async() =>
    get<UserData[]>(`${serverUrl}/friend/request/pending`, []);

export const sendFriendRequest = (username: string): Promise<AxiosResponse> => {
    return axiosInstance.post(`${serverUrl}/friend/request/send/${username}`);
};

export const acceptFriendRequest = (userId: string): Promise<AxiosResponse> => {
    return axiosInstance.post(`${serverUrl}/friend/request/accept/${userId}`);
};

export const rejectFriendRequest = (userId: string): Promise<AxiosResponse> => {
    return axiosInstance.post(`${serverUrl}/friend/request/reject/${userId}`);
};

export const removeFriend = async(friendId: string) => {
    await axiosInstance.post(`${serverUrl}/friend/remove/${friendId}`);
};

export async function sendMessage(groupChatId: string, text: string) {
    await axiosInstance.post(`${serverUrl}/send`, {
                groupChatId: groupChatId,
                text: text
            });
}

export async function uploadProfilePhoto(file: File, chatId: string | null) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = chatId === null ? `${serverUrl}/profile-photo`
        : `${serverUrl}/chat/profile-photo/${chatId}`;
    await axiosInstance.post(url, formData);
}

export async function createNewGroup(name: string, members: string[]) {
    await axiosInstance.post(`${serverUrl}/chat/create`, {
            name: name,
            members: members
        });
}

export async function leaveChat(chatId: string) {
    await axiosInstance.delete(`${serverUrl}/chat/${chatId}/user/me`);
}

export async function kickUser(chatId: string, userId: string) {
    await axiosInstance.delete(`${serverUrl}/chat/${chatId}/user/${userId}`);
}

export async function promoteUser(chatId: string, userId: string) {
    await axiosInstance.put(`${serverUrl}/chat/${chatId}/admins/${userId}`);
}

export async function demoteUser(chatId: string, userId: string) {
    await axiosInstance.delete(`${serverUrl}/chat/${chatId}/admins/${userId}`);
}

const dateFields = new Set(['sentOn', 'lastMessageSentOn', 'createdOn', 'timestamp']);

export function parseJSON(s: string): any {
    if (s.length === 0)
            return s;
    return JSON.parse(s, (key: string, value: any) => {
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