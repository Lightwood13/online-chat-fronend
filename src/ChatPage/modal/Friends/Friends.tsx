import React, { useEffect, useRef, useState } from 'react';
import { UserData } from '../../../model/UserData';
import { FriendList } from './FriendList';
import { acceptFriendRequest, rejectFriendRequest, removeFriend, sendFriendRequest } from '../../../network';
import { FriendRemovalDialog, ConfirmationDialogResult } from './FriendRemovalDialog';
import { AddFriend } from './AddFriend';
import axios from 'axios';
import { FriendRequestList } from './FriendRequestList';

export function Friends(props: {
    friends: UserData[],
    friendRequests: UserData[],
    show: boolean,
    onFriendRemoved: () => void,
    onFriendRequestResolved: () => void,
    onClose: () => void
}) {

    const [addFriendInfo, setAddFriendInfo] = useState<string | null>(null);
    const [addFriendError, setAddFriendError] = useState<string | null>(null);

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [friendToDelete, setFriendToDelete] = useState<UserData|null>(null);
    const isActiveRef = useRef(true);

    function closeOnEscapeKeyDown(e: KeyboardEvent) {
        if (e.code === 'Escape' && isActiveRef.current) {
            props.onClose();
        }
    }

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        };
    }, []);

    useEffect(() => {
        setAddFriendInfo(null);
        setAddFriendError(null);
    }, [props.show]);

    async function onConfirmationDialogClosed(result: ConfirmationDialogResult) {
        isActiveRef.current = true;
        if (result === 'yes' && friendToDelete !== null) {
            await removeFriend(friendToDelete.id);
            props.onFriendRemoved();
        }
        setShowConfirmationDialog(false);
    }

    async function onAddFriend(username: string) {
        try {
            await sendFriendRequest(username);
            setAddFriendError(null);
            setAddFriendInfo('Friend request sent');
        }
        catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                setAddFriendError((err.response.data as any).message);
            }
        }
    }

    async function onResolveFriendRequest(userId: string, accept: boolean) {
        try {
            setAddFriendInfo(null);
            setAddFriendError(null);
            if (accept) {
                await acceptFriendRequest(userId);
            }
            else {
                await rejectFriendRequest(userId);
            }
            props.onFriendRequestResolved();
        }
        catch (err) {
            console.log(err);
        }
    }

    async function onRemoveFriend(friendId: string) {
        isActiveRef.current = false;
        const friend = props.friends.find(friend => friend.id === friendId);
        if (friend !== undefined) {
            setFriendToDelete(friend);
            setShowConfirmationDialog(true);
        }
        setAddFriendInfo(null);
        setAddFriendError(null);
    }

    if (!props.show) {
        return null;
    }

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <AddFriend
                    onSubmit={onAddFriend}
                    info={addFriendInfo}
                    error={addFriendError}
                />
                <FriendRequestList
                    requests={props.friendRequests}
                    onResolveRequest={onResolveFriendRequest}
                />
                <FriendList
                    friends={props.friends}
                    onRemoveFriend={onRemoveFriend}
                />
                {friendToDelete && <FriendRemovalDialog
                    user={friendToDelete}
                    show={showConfirmationDialog}
                    onResult={onConfirmationDialogClosed}
                />}
            </div>
        </div>
    );
}