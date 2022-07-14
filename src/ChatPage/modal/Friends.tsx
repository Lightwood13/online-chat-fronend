import React, { useEffect } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { UserData } from '../../model/UserData';

import defaultProfilePhoto from '../../images/default.png';
import { UserList } from './UserList';

export function Friends(props: {
    friends: UserData[],
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

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <div className='friends-label'>Friends</div>
                <UserList users={props.friends}/>
            </div>
        </div>
    );
}