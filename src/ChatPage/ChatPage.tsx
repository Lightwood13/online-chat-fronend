import React from 'react';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { axiosInstance, getJWTToken, hasJWTToken } from '../axiosConfig';
import { ChatList } from './ChatList/ChatList';
import { ChatData } from './ChatList/ChatListItem';
import { MessageData } from './MessageArea/Message';
import { MessageArea } from './MessageArea/MessageArea';


export function ChatPage() {
    const [chatListLoaded, setChatListLoaded] = useState(false);
    const [chatList, setChatList] = useState<ChatData[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messageList, setMessageList] = useState<MessageData[]>([]);
    const [stompClient, setStompClient] = useState( new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws-connect'),
        connectHeaders: {
            'Authorization': 'Bearer ' + getJWTToken()
        }
    }));

    stompClient.onConnect = function (_frame: IFrame) {
        this.subscribe('/messages/new', onMessageReceived);
    };

    useEffect(() => {
        stompClient.activate();
    }, []);

    function onMessageReceived(message: IMessage) {
        const newMessage = JSON.parse(message.body);
        const newMessage2 = {...newMessage, sentOn: new Date(newMessage.sentOn)};
        setMessageList(messageList => messageList.concat([newMessage2]));
    }

    function onSendMessage(text: string) {
        if (activeChatId !== null) {
            stompClient.publish({
                destination: '/chat/send',
                body: JSON.stringify({
                    text: text,
                    groupChatId: activeChatId
                })
            });
        }
    }

    async function onChatSelected(chatId: string) {
        setMessageList(await getChatMessages(chatId));
        setActiveChatId(chatId);
    }

    async function getChatMessages(chatId: string): Promise<MessageData[]> {
        const response = await axiosInstance.get(`http://localhost:8080/chat/${chatId}`);
        if (response.status !== 200) {
            throw new Error("Bad server response");
        }
    
        return response.data;
    }

    async function getChatList(): Promise<ChatData[]> {
        try {
            const response = await axiosInstance.get('http://localhost:8080/chats');

            if (response.status !== 200) {
                throw new Error("Bad server response");
            }
    
            return response.data;
        } catch (e) {
            navigate('/login');
            return [];
        }
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (!hasJWTToken()) {
            navigate('/login');
            return;
        }
        getChatList().then(chatList => {
            setChatList(chatList);
            setChatListLoaded(true);
        });
    }, []);

    return (chatListLoaded 
        ? (
            <div className='chat-page'>
                <ChatList chatList={chatList} onChatSelected={onChatSelected}/>
                <MessageArea messageList={messageList} onSendMessage={onSendMessage}/>
            </div>
        )
        : <div/>);

}