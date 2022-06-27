import React from 'react';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { axiosInstance, getJWTToken, hasJWTToken } from '../security';
import { MessageData } from './Message';
import { MessageArea } from './MessageArea';

export function ChatPage() {
    const [isLoaded, setLoaded] = useState(false);
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

    const onMessageReceived = (message: IMessage) => {
        const newMessage = JSON.parse(message.body);
        const newMessage2 = {...newMessage, sentOn: new Date(newMessage.sentOn)};
        setMessageList(messageList => messageList.concat([newMessage2]));
    };

    const onSendMessage = (message: string) => {
        stompClient.publish({
            destination: '/chat/send',
            body: message
        });
    };

    async function getInitialMessages(): Promise<MessageData[]> {
        const response = await axiosInstance.get('http://localhost:8080/chat');
        if (response.status !== 200) {
            throw new Error("Bad server response");
        }
    
        return response.data.map( (message: any) => ({...message, sentOn: new Date(message.sentOn)}));
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (!hasJWTToken()) {
            navigate('/login');
            return;
        }
        getInitialMessages().then(messageData => {
            setMessageList(messageData);
            setLoaded(true);
        });
    }, []);

    return (isLoaded 
        ? <MessageArea messageList={messageList} onSendMessage={onSendMessage}/>
        : <div/>);

}