import React from 'react';
import { UserData } from '../../model/UserData';

import defaultProfilePhoto from '../../images/default.png';

export const UserList = (props: {
    users: UserData[],
    showRemoveButton: boolean,
    onRemove: (userId: string) => void
}) => (
    <div className='user-list'>
        {props.users.map(
            (user: UserData) => {
                return (
                    <div className='user-list-item' key={user.id}>
                        <img className='message-profile-photo' src={
                            user === undefined || user.profilePhotoLocation === null
                            ? defaultProfilePhoto
                            : `http://localhost:8080/photo/${user.profilePhotoLocation}`
                        }/>
                        <div className='user-list-item-name'>{
                            user === undefined ? '[deleted]' : user.name
                        }</div>
                        {props.showRemoveButton &&
                            <button 
                                className='user-list-item-remove-button'
                                onClick={() => props.onRemove(user.id)}
                            >Remove</button>
                        }
                    </div>
                );
            }
        )}
    </div>
);