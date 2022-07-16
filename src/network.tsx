import axios, { AxiosResponse } from 'axios';
import { ChatDataWithLastMessage } from './model/ChatDataWithLastMessage';
import { ChatDataWithMembersAndMessages } from './model/ChatDataWithMembersAndMessages';
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

export const getChatInfoAndMessages = async (chatId: string) => 
    getOrThrow<ChatDataWithMembersAndMessages>(`${serverUrl}/chat/${chatId}`);

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

export const sendFriendRequest = (username: string): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.post(`${serverUrl}/friend/request/send/${username}`);
};

export const acceptFriendRequest = (userId: string): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.post(`${serverUrl}/friend/request/accept/${userId}`);
};

export const rejectFriendRequest = (userId: string): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.post(`${serverUrl}/friend/request/reject/${userId}`);
};

export const removeFriend = async(friendId: string) => {
    await axiosInstance.post(`${serverUrl}/friend/remove/${friendId}`);
};

export function sendMessage(groupChatId: string, text: string) {
    axiosInstance.post(`${serverUrl}/send`, {
                groupChatId: groupChatId,
                text: text
            });
}

export function uploadProfilePhoto(file: File, chatId: string | null) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = chatId === null ? `${serverUrl}/profile-photo`
        : `${serverUrl}/group-chat-profile-photo/${chatId}`;
    axiosInstance.post(url, formData);
}

export function parseJSON(s: string): any {
    if (s.length === 0)
            return s;
    return JSON.parse(s, (key: string, value: any) => {
        if (key === 'sentOn' || key === 'lastMessageSentOn' || key === 'timestamp')
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