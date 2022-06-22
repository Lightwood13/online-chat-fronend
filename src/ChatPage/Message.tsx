import React from 'react';

export type MessageData = {
    id: number,
    sender: string,
    messageText: string
}

type MessageProps = {
    data: MessageData
}

export const Message = (messageProps: MessageProps) => (
        <li className='message'>
            <div className='message-sender'>{messageProps.data.sender}</div>
            <div className='message-text'>{messageProps.data.messageText}</div>
        </li>
    );
