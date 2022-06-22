import React, { ChangeEvent, FormEvent, useState } from 'react';

type InputAreaProps = {
    onSubmit: (name: string, value: string) => void;
}

export const InputArea = (props: InputAreaProps) => {
    const [name, setName] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit(name, inputValue);
    };

    return (
        <form className='input-area' onSubmit={handleSubmit}>
            <input
                className='name-field'
                name={name}
                onChange={handleNameChange}
            />
            <input 
                className='input-field' 
                value={inputValue}
                onChange={handleInputChange}
            />
            <button className='send-button'>Send</button>
        </form>
    );
};