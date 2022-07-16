import React, { useEffect } from 'react';
import { UserData } from '../../../model/UserData';
import { UserListItem } from '../UserListItem';

export type ConfirmationDialogResult = 'yes' | 'no' | 'cancel';

export function FriendRemovalDialog(props: {
    user: UserData,
    show: boolean,
    onResult: (result: ConfirmationDialogResult) => void
}) {

    function closeOnEscapeKeyDown(e: KeyboardEvent) {
        if (e.code === 'Escape') {
            props.onResult('cancel');
        }
    }

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        };
    }, []);

    if (!props.show) {
        return null;
    }

    return (
        <div className='modal-background' onClick={() => props.onResult('cancel')}>
            <div className='dialog' onClick={e => e.stopPropagation()}>
                <div className='dialog-title'>Are you sure you want to remove friend?</div>
                <UserListItem user={props.user}/>
                <div className='dialog-buttons'>
                    <button 
                        className='dialog-button-yes' 
                        onClick={() => props.onResult('yes')}
                    >Yes</button>
                    <button
                        className='dialog-button-no'
                        onClick={() => props.onResult('no')}
                    >No</button>
                </div>
            </div>
        </div>
    );
}