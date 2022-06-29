import React, { useEffect } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { ChatData } from '../../model/ChatData';
import { UserData } from '../../model/UserData';

export function ChatInfo(props: {
    chat: ChatData | null,
    show: boolean,
    onClose: () => void
}) {
    if (!props.show || props.chat === null) {
        return null;
    }

    function closeOnEscapeKeyDown(e: KeyboardEvent) {
        if (e.code === 'Escape') {
            props.onClose();
        }
    }

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        };
    } ,[]);

    const memberWord = (props.chat.members.length === 1) ? 'member' : 'members';

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <div className='chat-info-name'>
                    {props.chat.name}
                </div>
                <div className='chat-members-label'>
                    <BsFillPeopleFill className='chat-members-icon'/> {`${props.chat.members.length} ${memberWord}`}
                </div>
                <ul className='chat-members-list'>
                    {props.chat.members.map(
                        (user: UserData) => <li className='chat-members-list-item' key={user.id}>{user.name}</li>
                    )}
                </ul>
            </div>
        </div>
    );
}