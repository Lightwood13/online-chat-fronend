import React from 'react';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { axiosInstance, getJWTToken, hasJWTToken } from '../axiosConfig';
import { ChatList } from './ChatList/ChatList';
import { MessageArea } from './MessageArea/MessageArea';
import { ChatInfo } from './ChatInfo/ChatInfo';
import { MessageData } from '../model/MessageData';
import { ChatData } from '../model/ChatData';


export function ChatPage() {
    const [chatListLoaded, setChatListLoaded] = useState(false);
    const [chatList, setChatList] = useState<ChatData[]>([]);
    const [activeChat, setActiveChat] = useState<ChatData | null>(null);

    const[showChatInfo, setShowChatInfo] = useState(false);

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
        if (activeChat !== null) {
            stompClient.publish({
                destination: '/chat/send',
                body: JSON.stringify({
                    text: text,
                    groupChatId: activeChat.id
                })
            });
        }
    }

    async function onChatSelected(chat: ChatData) {
        setMessageList(await getChatMessages(chat.id));
        setActiveChat(chat);
    }

    function onShowChatInfo() {
        setShowChatInfo(true);
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

    if (!chatListLoaded) {
        return null;
    }
        
    return (
            <div className='chat-page'>
                <ChatList 
                    chatList={chatList}
                    activeChatId={activeChat === null ? null : activeChat.id}
                    onChatSelected={onChatSelected}
                />
                <MessageArea 
                    activeChat={activeChat}
                    messageList={messageList}
                    onSendMessage={onSendMessage}
                    onShowChatInfo={onShowChatInfo}
                />
                <ChatInfo
                    chat={activeChat}
                    show={showChatInfo}
                    onClose={() => setShowChatInfo(false)}
                />
            </div>
        );

}