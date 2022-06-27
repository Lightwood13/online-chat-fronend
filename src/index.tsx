import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { App } from './App';
import { MessageData } from './ChatPage/Message';
import { loadLocalJWTToken } from './security';


// ========================================

async function start() {
    loadLocalJWTToken();
    const rootElem = document.getElementById("root");
    if (rootElem === null) {
        throw new Error("Couldn't find root element");
    }
    const root = ReactDOM.createRoot(rootElem);
    root.render(<App/>);
}

start();