import React from 'react';

export type MessageData = {
    id: number,
    sender: string,
    messageText: string
}

type MessageProps = {
    data: MessageData
}

export class Message extends React.Component<MessageProps> {
    render(): JSX.Element {
        return (
            <li className='message'>
                <div className='message-sender'>{this.props.data.sender}</div>
                <div className='message-text'>{this.props.data.messageText}</div>
            </li>
        );
    }
}