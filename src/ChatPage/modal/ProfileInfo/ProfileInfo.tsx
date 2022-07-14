import React, { useEffect } from 'react';
import { UserData } from '../../../model/UserData';

import defaultProfilePhoto from '../../../images/default.png';
import { ProfileHeader } from './ProfileHeader';

export function ProfileInfo(props: {
    user: UserData,
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
                <ProfileHeader
                    initialProfilePhotoLocation={props.user.profilePhotoLocation}
                    defaultProfilePhotoUrl={defaultProfilePhoto}
                    chatId={null}
                    profileName={props.user.name}
                />
            </div>
        </div>
    );
}