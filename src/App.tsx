import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChatPage } from './ChatPage/ChatPage';
import { LoginPage } from './LoginPage/LoginPage';
import { SignupPage } from './LoginPage/SignUpPage';
import { PageNotFound } from './PageNotFound/PageNotFound';

export function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<ChatPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/signup' element={<SignupPage/>}/>
                <Route path='*' element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}