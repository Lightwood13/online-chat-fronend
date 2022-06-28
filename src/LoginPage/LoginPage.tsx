import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { updateJWTToken } from '../axiosConfig';

export function LoginPage()  {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { 
        event.preventDefault();
        if (username.trim().length === 0) {
            setErrorMessage("Username can't be empty");
            return;
        } 
        if (password.trim().length === 0) {
            setErrorMessage("Password can't be empty");
            return;
        } 
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }); 
        if (response.status === 200) {
            updateJWTToken(await response.text());
            navigate('/');
        }
        else {
            setErrorMessage('Incorrect username or password');
        }
    };
    
    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='login-error-text'>{errorMessage}</div>
            <label className='login-label' htmlFor='username'>Username</label>
            <input
                className='login-input'
                id='username'
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <label className='login-label' htmlFor='password'>Password</label>
            <input
                className='login-input'
                id='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button className='login-button'>Login</button>
            <Link className='signup-text' to={'/signup'}>Don&apos;t have an account? Sign up</Link>
        </form>
    );
}