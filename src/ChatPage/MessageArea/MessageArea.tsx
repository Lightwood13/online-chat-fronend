import React from 'react';
import { ChatData } from '../../model/ChatData';
import { MessageData } from '../../model/MessageData';
import { ChatHeader } from './ChatHeader';
import { InputArea } from './InputArea';
import { Message } from './Message';

export function MessageArea (props: {
    activeChat: ChatData | null,
    messageList: MessageData[],
    onSendMessage: (text: string) => void,
    onShowChatInfo: () => void
}) {
    
    if (props.messageList.length === 0) {
        return null;
    }

    return (
        <div className='message-area'>
            <ChatHeader chat={props.activeChat} onShowChatInfo={props.onShowChatInfo}/>
            <ul className='message-list'>
                    {props.messageList.map( (message: MessageData) => 
                    (<Message key={message.id} data={message}/>)
                )}
            </ul>
            <InputArea onSubmit={props.onSendMessage}/>
        </div>
    );
}