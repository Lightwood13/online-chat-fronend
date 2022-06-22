import ReactDOM from 'react-dom/client';
import './index.css';

import { App } from './App';
import { MessageData } from './MessageArea/Message';


// ========================================

async function getInitialMessages(): Promise<MessageData[]> {
    const response = await fetch('http://localhost:8080/chat', {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error("Bad server response");
    }

    return await response.json();
}

async function start() {
    const initialMessages = await getInitialMessages();
    const rootElem = document.getElementById("root");
    if (rootElem === null) {
        throw new Error("Couldn't find root element");
    }
    const root = ReactDOM.createRoot(rootElem);
    root.render(<App initialMessages={initialMessages}/>);
}

start();