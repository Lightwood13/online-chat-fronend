import React from 'react';
import { MessageData, Message } from './Message';
import { InputArea } from './InputArea';

type MessageAreaProps = {
    messages: MessageData[],
    onSendMessage: (message: MessageData) => void
}

export const MessageArea = (props: MessageAreaProps) => {
    const onSubmit = (name: string, value: string) => {
        console.log('Submiting ' + value);
        props.onSendMessage({
            id: 0,
            sender: name,
            messageText: value
        });
    };

    const messageList = props.messages
        .map( (message: MessageData) => (<Message key={message.id} data={message}/>));
    
    return (
        <div className='message-area'>
            <ul className='message-list'>
                    {messageList}
            </ul>
            <InputArea onSubmit={onSubmit}/>
        </div>
    );
};