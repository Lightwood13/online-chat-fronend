import React, { FormEvent, ReactElement, useState } from 'react';

export function AddFriend (props: {
    onSubmit: (username: string) => void
    info: string | null,
    error: string | null,
}) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim().length !== 0) {
            props.onSubmit(inputValue.trim());
            setInputValue('');
        }
    };

    let infoOrError: ReactElement | null = null;
    if (props.error !== null) {
        infoOrError = <div className='add-friend-info' style={{color: 'red'}}>{props.error}</div>;
    }
    else if (props.info !== null) {
        infoOrError = <div className='add-friend-info' style={{color: 'green'}}>{props.info}</div>;
    }

    return (
        <div>
            <div className='friends-label'>Add friend</div>
            <form className='add-friend-input-area' onSubmit={handleSubmit}>
                <label htmlFor='friend-username'>Username:</label>
                <input 
                    className='input-field'
                    id='friend-username'
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />
                <button className='send-button'>Add</button>
            </form>
            {infoOrError}
        </div>
    );
}