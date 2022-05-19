import React from 'react';
import SockJS from 'sockjs-client';
import { Client, IFrame, IMessage } from '@stomp/stompjs';


import { MessageArea } from './messageArea';
import { MessageData } from './message';

type AppProps = {
    initialMessages: MessageData[]
}

type AppState = {
    messages: MessageData[]
}

export class App extends React.Component<AppProps, AppState> {
    stompClient: Client

    constructor(props: AppProps) {
        super(props);
        this.state = {
            messages: this.props.initialMessages
        }

        this.onSendMessage = this.onSendMessage.bind(this);
        const onMessageReceived = this.onMessageReceived.bind(this);

        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-connect')
        });
        this.stompClient.onConnect = function (frame: IFrame) {
            this.subscribe('/messages/new', onMessageReceived)
        }
    }

    componentDidMount() {
        this.stompClient.activate();
    }

    onMessageReceived(message: IMessage) {
        const newMessage: MessageData = JSON.parse(message.body);
        const oldMessages: MessageData[] = this.state.messages;
        this.setState({
            messages: oldMessages.concat([newMessage])
        })
    }

    onSendMessage(message: MessageData) {
        if (message.sender === '')
            message.sender = 'Anonymous';
        this.stompClient.publish({
            destination: '/chat/send',
            body: JSON.stringify(message)
        });
    }

    render(): JSX.Element {
        return <MessageArea 
            messages={this.state.messages}
            onSendMessage={this.onSendMessage}
            />
    }
}