import React, { ChangeEvent, FormEvent, useState } from 'react';


export function InputArea (props: {
    onSubmit: (text: string) => void 
}) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit(inputValue);
        setInputValue('');
    };

    return (
        <form className='input-area' onSubmit={handleSubmit}>
            <input 
                className='input-field' 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            <button className='send-button'>Send</button>
        </form>
    );
}