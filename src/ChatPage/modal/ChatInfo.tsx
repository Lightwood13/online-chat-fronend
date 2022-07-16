import React, { useEffect } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { ChatData } from '../../model/ChatData';
import { UserData } from '../../model/UserData';

import defaultGroupProfilePhoto from '../../images/default_group.png';
import { ProfileHeader } from './ProfileInfo/ProfileHeader';
import { UserList } from './UserList';

export function ChatInfo(props: {
    chat: ChatData,
    users: Map<string, UserData>,
    show: boolean,
    onClose: () => void
}) {

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

    if (!props.show) {
        return null;
    }

    const memberWord = (props.chat.members.length === 1) ? 'member' : 'members';

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <div>
                    <ProfileHeader
                        initialProfilePhotoLocation={props.chat.profilePhotoLocation}
                        defaultProfilePhotoUrl={defaultGroupProfilePhoto}
                        chatId={props.chat.id}
                        profileName={props.chat.name}
                    />
                    <div className='chat-members-label'>
                        <BsFillPeopleFill className='chat-members-icon'/> {`${props.chat.members.length} ${memberWord}`}
                    </div>
                    <UserList
                        users={props.chat.members
                                .map(userId => props.users.get(userId))
                                .filter((e): e is UserData => e !== undefined)}
                    />
                </div>
            </div>
        </div>
    );
}