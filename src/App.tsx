import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';


import { MessageArea } from './ChatPage/MessageArea';
import { MessageData } from './ChatPage/Message';
import { PageNotFound } from './PageNotFound/PageNotFound';
import { LoginPage } from './LoginPage/LoginPage';

type AppProps = {
    initialMessages: MessageData[]
}

export const App = (props: AppProps) => {
    const [messages, setMessages] = useState(props.initialMessages);

    const stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws-connect')
    });

    stompClient.onConnect = function (_frame: IFrame) {
        this.subscribe('/messages/new', onMessageReceived);
    };

    useEffect(() => {
        stompClient.activate();
    });

    const onMessageReceived = (message: IMessage) => {
        const newMessage: MessageData = JSON.parse(message.body);
        setMessages(messages.concat([newMessage]));
    };

    const onSendMessage = (message: MessageData) => {
        if (message.sender === '')
            message.sender = 'Anonymous';
        stompClient.publish({
            destination: '/chat/send',
            body: JSON.stringify(message)
        });
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={
                    <MessageArea 
                    messages={messages}
                    onSendMessage={onSendMessage}
                    />
                }/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='*' element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
};