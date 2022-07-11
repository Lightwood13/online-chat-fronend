import React, { useEffect, useRef } from 'react';
import { ChatData } from '../../model/ChatData';
import { MessageData } from '../../model/MessageData';
import { UserData } from '../../model/UserData';
import { ChatHeader } from './ChatHeader';
import { InputArea } from './InputArea';
import { Message } from './Message';

export function MessageArea (props: {
    activeChatId: string,
    activeChat: ChatData,
    users: Map<string, UserData>,
    messageList: MessageData[],
    openedFirstTime: boolean,
    scrollPosition: number,
    onScroll: (scrollPosition: number) => void,
    onSendMessage: (text: string) => void,
    onShowChatInfo: () => void
}) {
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLInputElement | null>(null);


    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView();
    }

    useEffect(() => {
        if (messageListRef.current !== null) {
            messageListRef.current.scrollTop = props.scrollPosition;
        }
    }, [props.scrollPosition]);
    useEffect(() => {
        if (props.openedFirstTime) {
            scrollToBottom();
        }
    }, [props.activeChatId]);

    if (props.messageList.length === 0) {
        return null;
    }

    return (
        <div className='message-area'>
            <ChatHeader chat={props.activeChat} onShowChatInfo={props.onShowChatInfo}/>
            <div 
                className='message-list'
                ref={messageListRef}
                onScroll={e => {props.onScroll(e.currentTarget.scrollTop);}}
            >
                {props.messageList.map( (message: MessageData) => 
                    <Message
                        key={message.id}
                        data={message}
                        author={props.users.get(message.authorId)}
                    />
                )}
                <div ref={messagesEndRef}></div>
            </div>
            <InputArea onSubmit={props.onSendMessage}/>
        </div>
    );
}