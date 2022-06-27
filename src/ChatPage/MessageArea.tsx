import React from 'react';
import { InputArea } from './InputArea';
import { Message, MessageData } from './Message';

export function MessageArea (props: {
    messageList: MessageData[]
    onSendMessage: (message: string) => void
}) {
    
    return (
        <div className='message-area'>
            <ul className='message-list'>
                    {props.messageList.map( (message: MessageData) => 
                    (<Message key={message.id} data={message}/>)
                )}
            </ul>
            <InputArea onSubmit={props.onSendMessage}/>
        </div>
    );
}