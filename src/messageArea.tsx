import React from 'react';
import { MessageData, Message } from './message';
import { InputArea } from './inputArea';

type MessageAreaProps = {
    messages: MessageData[]
    onSendMessage: (message: MessageData) => void;
}

export class MessageArea extends React.Component<MessageAreaProps> {
    constructor(props: MessageAreaProps) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(name: string, value: string) {
        console.log('Submiting ' + value);
        this.props.onSendMessage({
            id: 0,
            sender: name,
            messageText: value
        });
    }

    render(): JSX.Element {
        const messageList = this.props.messages
            .map( (message: MessageData) => (<Message key={message.id} data={message}/>));
        return (
            <div className='message-area'>
                <ul className='message-list'>
                        {messageList}
                </ul>
                <InputArea onSubmit={this.onSubmit}/>
            </div>
        );
    }
}