import React, { ReactNode } from 'react';
import { UserData } from '../../model/UserData';

import defaultProfilePhoto from '../../images/default.png';

export const UserListItem = (props: {
    user: UserData,
    children?: ReactNode
}) => (
    <div className='user-list-item' key={props.user.id}>
        <img className='message-profile-photo' src={
            props.user === undefined || props.user.profilePhotoLocation === null
            ? defaultProfilePhoto
            : `http://localhost:8080/photo/${props.user.profilePhotoLocation}`
        }/>
        <div className='user-list-item-name'>{
            props.user === undefined ? '[deleted]' : props.user.name
        }</div>
        {props.children}
    </div>
);

export const UserListItemWithLeftContent = (props: {
    user: UserData,
    children?: ReactNode
}) => (
    <div className='user-list-item' key={props.user.id}>
        {props.children}
        <img className='message-profile-photo' src={
            props.user === undefined || props.user.profilePhotoLocation === null
            ? defaultProfilePhoto
            : `http://localhost:8080/photo/${props.user.profilePhotoLocation}`
        }/>
        <div className='user-list-item-name'>{
            props.user === undefined ? '[deleted]' : props.user.name
        }</div>
    </div>
);