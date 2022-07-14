import React, { useEffect, useRef, useState } from 'react';
import { UserData } from '../../model/UserData';
import { UserList } from './UserList';
import { removeFriend } from '../../network';
import { RemovalConfirmationDialog, ConfirmationDialogResult } from './RemovalConfirmationDialog';

export function Friends(props: {
    friends: UserData[],
    show: boolean,
    onFriendRemoved: () => void,
    onClose: () => void
}) {

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

    async function onConfirmationDialogClosed(result: ConfirmationDialogResult) {
        isActiveRef.current = true;
        if (result === 'yes' && friendToDelete !== null) {
            await removeFriend(friendToDelete.id);
            props.onFriendRemoved();
        }
        setShowConfirmationDialog(false);
    }

    async function onRemoveFriend(friendId: string) {
        isActiveRef.current = false;
        const friend = props.friends.find(friend => friend.id === friendId);
        if (friend !== undefined) {
            setFriendToDelete(friend);
            setShowConfirmationDialog(true);
        }
    }

    if (!props.show) {
        return null;
    }

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <div className='friends-label'>Friends</div>
                <UserList
                    users={props.friends}
                    showRemoveButton={true}
                    onRemove={onRemoveFriend}
                />
                {friendToDelete && <RemovalConfirmationDialog
                    user={friendToDelete}
                    show={showConfirmationDialog}
                    onResult={onConfirmationDialogClosed}
                />}
            </div>
        </div>
    );
}