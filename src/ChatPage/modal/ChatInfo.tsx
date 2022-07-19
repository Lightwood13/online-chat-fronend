import React, { useEffect, useRef, useState } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { ChatData } from '../../model/ChatData';
import { UserData } from '../../model/UserData';

import defaultGroupProfilePhoto from '../../images/default_group.png';
import { ProfileHeader } from './ProfileInfo/ProfileHeader';
import { ChatMemberList } from './ChatMemberList';
import { MemberData } from '../../model/MemberData';
import { ConfirmationDialog, ConfirmationDialogResult } from './ConfirmationDialog';
import { UserListItem } from './UserListItem';

export function ChatInfo(props: {
    chat: ChatData,
    users: Map<string, UserData>,
    userId: string,
    isAdmin: boolean,
    show: boolean,
    onPromote: (userId: string) => void,
    onDemote: (userId: string) => void,
    onKick: (userId: string) => void,
    onLeaveChat: () => void,
    onClose: () => void
}) {
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [showKickDialog, setShowKickDialog] = useState(false);
    const [userToKick, setUserToKick] = useState<UserData | null>(null);
    const isActiveRef = useRef(true);

    function closeOnEscapeKeyDown(e: KeyboardEvent) {
        if (e.code === 'Escape' && isActiveRef.current) {
            props.onClose();
        }
    }

    function onLeaveButtonClicked() {
        isActiveRef.current = false;
        setShowLeaveDialog(true);
    }

    function onLeaveDialogClosed(result: ConfirmationDialogResult) {
        isActiveRef.current = true;
        setShowLeaveDialog(false);
        if (result === 'yes') {
            props.onLeaveChat();
        }
    }

    function onKickUser(userId: string) {
        isActiveRef.current = false;
        const user = props.users.get(userId);
        setUserToKick(user ? user : null);
        setShowKickDialog(true);
    }

    function onKickDialogClosed(result: ConfirmationDialogResult) {
        isActiveRef.current = true;
        setShowKickDialog(false);
        if (result === 'yes' && userToKick !== null) {
            props.onKick(userToKick.id);
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
                <ProfileHeader
                    initialProfilePhotoLocation={props.chat.profilePhotoLocation}
                    defaultProfilePhotoUrl={defaultGroupProfilePhoto}
                    chatId={props.chat.id}
                    profileName={props.chat.name}
                />
                <div className='chat-members-label'>
                    <BsFillPeopleFill className='chat-members-icon'/> {`${props.chat.members.length} ${memberWord}`}
                </div>
                <ChatMemberList
                    users={props.chat.members
                            .map(user => ({...props.users.get(user.id), role: user.role}))
                            .filter((e): e is UserData & MemberData => e !== undefined)}
                    isAdmin={props.isAdmin}
                    onPromote={props.onPromote}
                    onDemote={props.onDemote}
                    onKick={onKickUser}
                    userId={props.userId}
                />
                <button className='chat-leave-button' onClick={onLeaveButtonClicked }>Leave</button>
                <ConfirmationDialog
                    show={showLeaveDialog}
                    title={'Are you sure you want to leave the chat?'}
                    onResult={onLeaveDialogClosed}
                />
                {userToKick !== null && <ConfirmationDialog
                    show={showKickDialog}
                    title={'Are you sure you want to remove this user?'}
                    onResult={onKickDialogClosed}
                    >
                        <UserListItem user={userToKick}/>
                    </ConfirmationDialog>
                }
            </div>
        </div>
    );
}