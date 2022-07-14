import React, { useRef } from 'react';
import { uploadProfilePhoto } from '../../../network';

export function ProfileHeader(props: {
    initialProfilePhotoLocation: string | null
    defaultProfilePhotoUrl: string,
    chatId: string | null,
    profileName: string
}) {
    const profilePhotoUrl = props.initialProfilePhotoLocation !== null
        ? `http://localhost:8080/photo/${props.initialProfilePhotoLocation}`
        : props.defaultProfilePhotoUrl;
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    function onUploadButtonClick() {
        if (hiddenFileInput.current !== null) {
            hiddenFileInput.current.click();
        }
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files !== null && files.length !== 0) {
            uploadProfilePhoto(files[0], props.chatId);
        }
    }

    return (
        <div>
            <div className='profile-info-photo-and-name'>
                <img
                    className='profile-info-photo'
                    src={profilePhotoUrl}
                    alt='Profile photo'
                />
                <div className='profile-info-name'>
                    {props.profileName}
                </div>
            </div>
            <button
                className='upload-profile-photo'
                onClick={onUploadButtonClick}
            >Update profile photo</button>
            <input 
                type='file'
                ref={hiddenFileInput}
                onChange={onFileChange}
                style={{display:'none'}}
            />
        </div>
    );
}