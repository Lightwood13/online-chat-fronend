import React, { FormEvent } from 'react';


export function InputArea (props: {
    inputValue: string,
    onInputValueChange: (value: string) => void,
    onSubmit: () => void
}) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit();
    };

    return (
        <form className='new-message-input-area' onSubmit={handleSubmit}>
            <input 
                className='input-field' 
                value={props.inputValue}
                onChange={e => props.onInputValueChange(e.target.value)}
            />
            <button className='send-button'>Send</button>
        </form>
    );
}