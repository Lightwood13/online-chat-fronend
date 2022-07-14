import React, { ReactElement } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import useStateRef from 'react-usestateref';
import { useNavigate } from 'react-router-dom';
import { getChatInfoAndMessages, getChatList, getFriends, getJWTToken, getUserInfo, getUsersInfo, hasJWTToken, parseJSON, sendMessage } from '../network';
import { ChatList } from './ChatList/ChatList';
import { MessageArea } from './MessageArea/MessageArea';
import { ChatInfo } from './modal/ChatInfo';
import { MessageData } from '../model/MessageData';
import { ChatData } from '../model/ChatData';
import { ProfileInfo } from './modal/ProfileInfo/ProfileInfo';
import { UserData } from '../model/UserData';
import { ChatDataWithLastMessageAndAuthorName } from '../model/ChatDataWithLastMessageAndAuthorName';
import { Friends } from './modal/Friends';


export function ChatPage() {
    const [users, setUsers, usersRef] = useStateRef(new Map<string, UserData>());
    const [friends, setFriends] = useState<UserData[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const [chatListLoaded, setChatListLoaded] = useState(false);
    const [chatList, setChatList, chatListRef] = useStateRef<ChatDataWithLastMessageAndAuthorName[]>([]);
    const [loadedChats, setLoadedChats, loadedChatsRef] = useStateRef(new Map<string, ChatData>());
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const [messageLists, setMessageLists, messageListsRef] = useStateRef(new Map<string, MessageData[]>());

    const [showChatInfo, setShowChatInfo] = useState(false);
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const [showFriends, setShowFriends] = useState(false);

    const [scrollActiveChatToBottom, setScrollActiveChatToBottom] = useState(true);
    const [activeChatScrollPosition, setActiveChatScrollPosition] = useState(0);
    const [activeChatScrolledToBottom, setActiveChatScrolledToBottom, activeChatScrolledToBottomRef] = useStateRef(true);
    const [chatsScrollPositions, setChatsScrollPositions] = useState(new Map<string, number>());

    const [stompClient, setStompClient] = useState(new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws-connect'),
        connectHeaders: {
            'Authorization': 'Bearer ' + getJWTToken()
        }
    }));

    stompClient.onConnect = function () {
        setStompConnected(true);
    };
    
    const [stompConnected, setStompConnected] = useState(false);
    const [subscribedToStomp, setSubscribedToStomp] = useState(false);

    // subscribe when both user is initialized and stomp client is connected
    useEffect(() => {
        if (stompConnected && userId !== null && !subscribedToStomp) {
            setSubscribedToStomp(true);

            stompClient.subscribe('/messages/new', onMessageReceived);
            stompClient.subscribe(`/user/${userId}/profile-updates`, (message: IMessage) => {
                onUserProfileUpdated(JSON.parse(message.body));
            });
            stompClient.subscribe(`/user/${userId}/group-chat-profile-updates`, (message: IMessage) => {
                onChatProfileUpdated(JSON.parse(message.body));
            });
        }
    }, [stompConnected, userId]);

    useEffect(() => {
        stompClient.activate();
    }, []);

    async function onMessageReceived(message: IMessage) {
        const newMessage: MessageData = parseJSON(message.body);
        let usersMap = usersRef.current;
        if (!usersMap.has(newMessage.authorId)) {
            const newUser = await getUsersInfo([newMessage.authorId]);
            const newUsers = new Map(usersMap);
            for (const user of newUser) {
                newUsers.set(user.id, user);
            }
            usersMap = newUsers;
            setUsers(newUsers);
        }

        const chatIndex = chatListRef.current.findIndex(chatData => chatData.id === newMessage.groupChatId);
        if (chatIndex !== -1) {
            const newChatList = [...chatListRef.current];
            newChatList[chatIndex] = {
                ...newChatList[chatIndex],
                lastMessageId: newMessage.id,
                lastMessageAuthorId: newMessage.authorId,
                lastMessageAuthorName: (x => x ? x.name : '[deleted]')(usersMap.get(newMessage.authorId)),
                lastMessageText: newMessage.text,
                lastMessageSentOn: newMessage.sentOn
            };
            setChatList(newChatList);
        }
        const previousMessages = messageListsRef.current.get(newMessage.groupChatId);
        if (previousMessages !== undefined) {
            const newMessages = previousMessages.concat([newMessage]);
            setMessageLists(messageLists => new Map(messageLists.set(newMessage.groupChatId, newMessages)));
        }

        setScrollActiveChatToBottom(activeChatScrolledToBottomRef.current);
    }

    function onUserProfileUpdated(updatedUser: UserData) {
        if (usersRef.current.has(updatedUser.id)) {
            setUsers(users => new Map(users.set(updatedUser.id, updatedUser)));
        }
    }

    function onChatProfileUpdated(updatedChat: ChatData) {
        const updatedChatList = [...chatListRef.current];
        const updatedChatIndex = updatedChatList.findIndex(chat => chat.id === updatedChat.id);
        if (updatedChatIndex !== -1) {
            updatedChatList[updatedChatIndex] = {...updatedChatList[updatedChatIndex], ...updatedChat};
            setChatList(updatedChatList);
        }
        if (loadedChatsRef.current.has(updatedChat.id)) {
            setLoadedChats(loadedChats => new Map(loadedChats.set(updatedChat.id, updatedChat)));
        }
    }

    function onSendMessage(text: string) {
        if (activeChatId !== null) {
            sendMessage(activeChatId, text);
        }
    }

    async function onChatSelected(chatId: string) {
        if (!messageLists.has(chatId)) {
            const chatInfoWithMessages = await getChatInfoAndMessages(chatId);
            setMessageLists(new Map(messageLists.set(chatId, chatInfoWithMessages.messages)));
            setLoadedChats(new Map(loadedChats.set(chatId, {
                id: chatInfoWithMessages.id,
                name: chatInfoWithMessages.name,
                profilePhotoLocation: chatInfoWithMessages.profilePhotoLocation,
                members: chatInfoWithMessages.members.map(user => user.id)
            })));
            for (const member of chatInfoWithMessages.members) {
                users.set(member.id, member);
            }
            setUsers(new Map(users));
        }
        if (activeChatId !== null) {
            setChatsScrollPositions(chatsScrollPositions.set(activeChatId, activeChatScrollPosition));
        }
        setActiveChatId(chatId);
        const savedChatScrollPosition = chatsScrollPositions.get(chatId);
        setActiveChatScrollPosition(savedChatScrollPosition !== undefined ? savedChatScrollPosition : 0);
        setScrollActiveChatToBottom(savedChatScrollPosition === undefined);
    }

    async function onShowFriends() {
        const friends = await getFriends();
        setFriends(friends);
        setShowFriends(true);
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (!hasJWTToken()) {
            navigate('/login');
            return;
        }
        (async () => {
            const user = await getUserInfo();
            if (user === null) {
                navigate('/login');
                return;
            }
            const chatList = await getChatList();
            const usersArr = await getUsersInfo(chatList.map(chat => chat.lastMessageAuthorId));
            const usersMap = new Map<string, UserData>();
            usersMap.set(user.id, user);
            for (const user of usersArr) {
                usersMap.set(user.id, user);
            }
            const chatListWithAuthorName: ChatDataWithLastMessageAndAuthorName[] =
                chatList.map(chat => ({
                    ...chat,
                    lastMessageAuthorName: (x => x ? x.name : '[deleted]')(usersMap.get(chat.lastMessageAuthorId))
                }));
            setUserId(user.id);
            setUsers(usersMap);

            setChatList(chatListWithAuthorName);
            setChatListLoaded(true);
        })();
    }, []);

    if (userId === null || !chatListLoaded) {
        return null;
    }
    const user = users.get(userId);
    if (user === undefined) {
        return null;
    }

    let messageArea: ReactElement | false = false;
    let chatInfo: ReactElement | false = false;
    if (activeChatId !== null) {
        const activeChat = loadedChats.get(activeChatId);
        const activeMessageList = messageLists.get(activeChatId);
        if (activeChat !== undefined && activeMessageList !== undefined) {
            messageArea = <MessageArea
                    activeChatId={activeChatId}
                    activeChat={activeChat}
                    users={users}
                    messageList={activeMessageList}
                    scrollToBottom={scrollActiveChatToBottom}
                    scrollPosition={activeChatScrollPosition}
                    onScroll={(scrollPosition, scrolledToBottom) => {
                        setActiveChatScrollPosition(scrollPosition);
                        setActiveChatScrolledToBottom(scrolledToBottom);
                    }}
                    onSendMessage={onSendMessage}
                    onShowChatInfo={() => setShowChatInfo(true)}
                />;
        }
        if (activeChat !== undefined) {
            chatInfo = <ChatInfo
                chat={activeChat}
                users={users}
                show={showChatInfo}
                onClose={() => setShowChatInfo(false)}
            />;
        }
    }
    
    return (
            <div className='chat-page'>
                <ChatList 
                    chatList={chatList}
                    activeChatId={activeChatId}
                    onChatSelected={onChatSelected}
                    onShowProfileInfo={() => setShowProfileInfo(true)}
                    onShowFriends={onShowFriends}
                />
                {messageArea}
                {chatInfo}
                <ProfileInfo
                    user={user}
                    show={showProfileInfo}
                    onClose={() => setShowProfileInfo(false)}
                />
                <Friends
                    friends={friends}
                    show={showFriends}
                    onClose={() => setShowFriends(false)}
                    onFriendRemoved={onShowFriends}
                />
            </div>
        );

}