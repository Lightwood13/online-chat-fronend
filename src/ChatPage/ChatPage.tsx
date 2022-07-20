import React, { ReactElement } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import useStateRef from 'react-usestateref';
import { useNavigate } from 'react-router-dom';
import { createNewGroup, demoteUser, getChatInfo, getChatList, getChatMessages, getFriendRequests, getFriends, getJWTToken, getUserInfo, getUsersInfo, hasJWTToken, kickUser, leaveChat, parseJSON, promoteUser, sendMessage, serverUrl } from '../network';
import { ChatList } from './ChatList/ChatList';
import { MessageArea } from './MessageArea/MessageArea';
import { ChatInfo } from './modal/ChatInfo';
import { MessageData } from '../model/MessageData';
import { ChatData } from '../model/ChatData';
import { ProfileInfo } from './modal/ProfileInfo/ProfileInfo';
import { UserData } from '../model/UserData';
import { ChatDataWithLastMessageAndAuthorName } from '../model/ChatDataWithLastMessageAndAuthorName';
import { Friends } from './modal/Friends/Friends';
import { NewGroup } from './modal/NewGroup/NewGroup';


export function ChatPage() {
    const [users, setUsers, usersRef] = useStateRef(new Map<string, UserData>());
    const [friends, setFriends] = useState<UserData[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserData[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const [chatListLoaded, setChatListLoaded] = useState(false);
    const [chatList, setChatList, chatListRef] = useStateRef<ChatDataWithLastMessageAndAuthorName[]>([]);
    const [loadedChats, setLoadedChats, loadedChatsRef] = useStateRef(new Map<string, ChatData>());
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const [messageLists, setMessageLists, messageListsRef] = useStateRef(new Map<string, MessageData[]>());

    const [showChatInfo, setShowChatInfo] = useState(false);
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showCreateNewGroup, setShowCreateNewGroup] = useState(false);

    const [scrollActiveChatToBottom, setScrollActiveChatToBottom] = useState(true);
    const [activeChatScrollPosition, setActiveChatScrollPosition] = useState(0);
    const [, setActiveChatScrolledToBottom, activeChatScrolledToBottomRef] = useStateRef(true);
    const [activeChatInput, setActiveChatInput] = useState('');
    const [chatsScrollPositions, setChatsScrollPositions] = useState(new Map<string, number>());
    const [chatsSavedInput, setChatsSavedInput] = useState(new Map<string, string>());

    const [stompClient] = useState(new Client({
        webSocketFactory: () => new SockJS(`${serverUrl}/ws-connect`),
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
                onUserProfileUpdated(parseJSON(message.body));
            });
            stompClient.subscribe(`/user/${userId}/group-chat-profile-updates`, (message: IMessage) => {
                onChatProfileUpdated(parseJSON(message.body));
            });
            stompClient.subscribe(`/user/${userId}/friend-list-updates`, () => {
                onFriendListUpdated();
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
        } else {
            updatedChatList.push({
                ...updatedChat,
                lastMessageId: null,
                lastMessageAuthorId: null,
                lastMessageAuthorName: null,
                lastMessageSentOn: null,
                lastMessageText: null
            });
        }
        setChatList(updatedChatList);
        if (loadedChatsRef.current.has(updatedChat.id)) {
            setLoadedChats(loadedChats => new Map(loadedChats.set(updatedChat.id, updatedChat)));
        }
    }

    function onSendMessage() {
        if (activeChatId !== null && activeChatInput.trim().length !== 0) {
            sendMessage(activeChatId, activeChatInput.trim());
        }
    }

    async function onChatSelected(chatId: string) {
        if (!messageLists.has(chatId)) {
            const chatInfo = await getChatInfo(chatId);
            const chatMessages = await getChatMessages(chatId);

            const missingMembers = chatInfo.members.filter(m => !users.has(m.id));
            if (missingMembers.length !== 0) {
                const members = await getUsersInfo(missingMembers.map(m => m.id));
                for (const member of members) {
                    users.set(member.id, member);
                }
                setUsers(new Map(users));
            }

            setMessageLists(new Map(messageLists.set(chatId, chatMessages)));
            setLoadedChats(new Map(loadedChats.set(chatId, chatInfo)));
        }
        if (activeChatId !== null) {
            setChatsScrollPositions(chatsScrollPositions.set(activeChatId, activeChatScrollPosition));
            setChatsSavedInput(chatsSavedInput.set(activeChatId, activeChatInput));
        }
        setActiveChatId(chatId);
        const savedChatScrollPosition = chatsScrollPositions.get(chatId);
        const savedChatInput = chatsSavedInput.get(chatId);
        setActiveChatScrollPosition(savedChatScrollPosition !== undefined ? savedChatScrollPosition : 0);
        setActiveChatInput(savedChatInput !== undefined ? savedChatInput : '');
        setScrollActiveChatToBottom(savedChatScrollPosition === undefined);
    }

    async function onFriendListUpdated() {
        const friends = await getFriends();
        const friendRequests = await getFriendRequests();
        setFriends(friends);
        setFriendRequests(friendRequests);
    }

    async function onShowFriends() {
        await onFriendListUpdated();
        setShowFriends(true);
    }

    async function onCreateGroup(name: string, members: string[]) {
        await createNewGroup(name, members);
        setShowCreateNewGroup(false);
    }

    async function onLeaveChat() {
        if (activeChatId !== null) {
            leaveChat(activeChatId);
            const newLoadedChats = new Map(loadedChats);
            const newMessageLists =  new Map(messageLists);
            newLoadedChats.delete(activeChatId);
            newMessageLists.delete(activeChatId);
            setChatList(chatList.filter(c => c.id !== activeChatId));
            setLoadedChats(newLoadedChats);
            setMessageLists(newMessageLists);
            setActiveChatId(null);
        }
    }

    async function onPromote(userId: string) {
        if (activeChatId !== null) {
            await promoteUser(activeChatId, userId);
            setLoadedChats(new Map(loadedChats.set(activeChatId, await getChatInfo(activeChatId))));
        }
    }

    async function onDemote(userId: string) {
        if (activeChatId !== null) {
            await demoteUser(activeChatId, userId);
            setLoadedChats(new Map(loadedChats.set(activeChatId, await getChatInfo(activeChatId))));
        }
    }

    async function onKick(userId: string) {
        if (activeChatId !== null) {
            await kickUser(activeChatId, userId);
            setLoadedChats(new Map(loadedChats.set(activeChatId, await getChatInfo(activeChatId))));
        }
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
            await onFriendListUpdated();
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

    useEffect(() => {
        const chatListCopy = [...chatList];
        chatListCopy.sort((a, b) =>
            (b.lastMessageSentOn !== null ? b.lastMessageSentOn : b.createdOn).getTime() -
            (a.lastMessageSentOn !== null ? a.lastMessageSentOn : a.createdOn).getTime());
        if (!chatList.every((v, i) => v === chatListCopy[i])) {
            setChatList(chatListCopy);
        }
    }, [chatList]);

    if (userId === null || !chatListLoaded) {
        return null;
    }
    const user = users.get(userId);
    if (user === undefined) {
        return null;
    }

    let messageArea: ReactElement | null = null;
    let chatInfo: ReactElement | null = null;
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
                    inputValue={activeChatInput}
                    onInputValueChange={value => setActiveChatInput(value)}
                    onSendMessage={onSendMessage}
                    onShowChatInfo={() => setShowChatInfo(true)}
                />;
        }
        if (activeChat !== undefined) {
            chatInfo = <ChatInfo
                chat={activeChat}
                users={users}
                userId={user.id}
                isAdmin={activeChat.members.find(m => m.id === user.id)?.role === 'admin'}
                show={showChatInfo}
                onPromote={onPromote}
                onDemote={onDemote}
                onKick={onKick}
                onLeaveChat={onLeaveChat}
                onClose={() => setShowChatInfo(false)}
            />;
        }
    }
    
    return (
            <div className='chat-page'>
                <ChatList 
                    chatList={chatList}
                    activeChatId={activeChatId}
                    friendRequestCount={friendRequests.length}
                    onChatSelected={onChatSelected}
                    onCreateNewGroup={() => setShowCreateNewGroup(true)}
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
                    friendRequests={friendRequests}
                    show={showFriends}
                    onClose={() => setShowFriends(false)}
                    onFriendRemoved={onFriendListUpdated}
                    onFriendRequestResolved={onFriendListUpdated}
                />
                <NewGroup
                    user={user}
                    friends={friends}
                    show={showCreateNewGroup}
                    onClose={() => setShowCreateNewGroup(false)}
                    onCreateGroup={onCreateGroup}
                />
            </div>
        );

}