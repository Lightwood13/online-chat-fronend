import React, { ChangeEvent, FormEvent, useState } from 'react';


export const InputArea = (props: {
    onSubmit: (value: string) => void 
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

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
                onChange={handleInputChange}
            />
            <button className='send-button'>Send</button>
        </form>
    );
};