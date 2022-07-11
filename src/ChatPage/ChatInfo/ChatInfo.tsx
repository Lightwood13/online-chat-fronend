import React, { useEffect } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { ChatData } from '../../model/ChatData';
import { UserData } from '../../model/UserData';

import defaultProfilePhoto from '../../images/default.png';
import defaultGroupProfilePhoto from '../../images/default_group.png';
import { ProfileHeader } from '../ProfileInfo/ProfileHeader';

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
                        uploadProfilePhotoUrl={`http://localhost:8080/group-chat-profile-photo/${props.chat.id}`}
                        profileName={props.chat.name}
                    />
                    <div className='chat-members-label'>
                        <BsFillPeopleFill className='chat-members-icon'/> {`${props.chat.members.length} ${memberWord}`}
                    </div>
                    <div className='chat-members-list'>
                        {props.chat.members.map(
                            (userId: string) => {
                                const user = props.users.get(userId);
                                return (
                                    <div className='chat-members-list-item' key={userId}>
                                        <img className='message-profile-photo' src={
                                            user === undefined || user.profilePhotoLocation === null
                                            ? defaultProfilePhoto
                                            : `http://localhost:8080/photo/${user.profilePhotoLocation}`
                                        }/>
                                        <div className='chat-members-item-name'>{
                                            user === undefined ? '[deleted]' : user.name
                                        }</div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}