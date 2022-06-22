import React from 'react';
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    const onLogin = () => {
        navigate("/");
    };

    return (<button onClick={onLogin}>Login</button>);
};