import React from 'react';

export type MessageData = {
    id: string,
    authorName: string,
    text: string
    sentOn: Date
}

export const Message = (messageProps: {
    data: MessageData
}) => (
        <li className='message'>
            <div className='message-sender'>{messageProps.data.authorName}</div>
            <div className='message-text'>{messageProps.data.text}</div>
            <div className='message-senton'>{messageProps.data.sentOn.toLocaleTimeString(
                [], {hour: '2-digit', minute: '2-digit'}
            )}</div>
        </li>
    );
