import React, { useEffect } from 'react';
import { UserData } from '../../model/UserData';

export function ProfileInfo(props: {
    user: UserData,
    show: boolean,
    onClose: () => void
}) {
    if (!props.show) {
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

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <div className='profile-info-name'>
                    {props.user.name}
                </div>
            </div>
        </div>
    );
}