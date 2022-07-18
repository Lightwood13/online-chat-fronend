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
    scrollToBottom: boolean,
    scrollPosition: number,
    inputValue: string,
    onScroll: (scrollPosition: number, scrolledToBottom: boolean) => void,
    onInputValueChange: (value: string) => void,
    onSendMessage: () => void,
    onShowChatInfo: () => void
}) {
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const messageListEndRef = useRef<HTMLInputElement | null>(null);


    function scrollToBottom() {
        messageListEndRef.current?.scrollIntoView();
    }

    useEffect(() => {
        if (messageListRef.current !== null) {
            messageListRef.current.style.scrollBehavior = 'smooth';
        }
    }, [props.messageList]);

    useEffect(() => {
        if (messageListRef.current !== null) {
            messageListRef.current.style.scrollBehavior = 'auto';
        }
    }, [props.activeChatId]);

    useEffect(() => {
        if (messageListRef.current !== null) {
            messageListRef.current.scrollTop = props.scrollPosition;
        }
    }, [props.activeChatId, props.messageList]);

    useEffect(() => {
        if (props.scrollToBottom) {
            scrollToBottom();
        }
    }, [props.activeChatId, props.messageList]);

    return (
        <div className='message-area'>
            <ChatHeader chat={props.activeChat} onShowChatInfo={props.onShowChatInfo}/>
            <div 
                className='message-list'
                ref={messageListRef}
                onScroll={e => {
                    props.onScroll(
                        e.currentTarget.scrollTop,
                        e.currentTarget.offsetHeight + e.currentTarget.scrollTop >= e.currentTarget.scrollHeight
                    );}}
            >
                {props.messageList.map( (message: MessageData) => 
                    <Message
                        key={message.id}
                        data={message}
                        author={props.users.get(message.authorId)}
                    />
                )}
                <div ref={messageListEndRef}></div>
            </div>
            <InputArea
                inputValue={props.inputValue}
                onInputValueChange={props.onInputValueChange}
                onSubmit={props.onSendMessage}
            />
        </div>
    );
}