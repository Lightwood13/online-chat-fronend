import React, { useEffect, useState } from 'react';
import { UserData } from '../../../model/UserData';
import { NewGroupMembersList } from './NewGroupMembersList';

export function NewGroup(props: {
    user: UserData,
    friends: UserData[]
    show: boolean,
    onCreateGroup: (name: string, memberIds: string[]) => void,
    onClose: () => void
}) {

    const [selectedMembers, setSelectedMembers] = useState(new Set<string>());
    const [groupName, setGroupName] = useState('');

    function closeOnEscapeKeyDown(e: KeyboardEvent) {
        if (e.code === 'Escape') {
            props.onClose();
        }
    }

    function onMemberToggled(memberId: string) {
        const newSelectedMembers = new Set(selectedMembers);
        if (selectedMembers.has(memberId)) {
            newSelectedMembers.delete(memberId);
        }
        else {
            newSelectedMembers.add(memberId);
        }
        setSelectedMembers(newSelectedMembers);
    }

    function onCreateGroup() {
        const members = Array.from(selectedMembers);
        members.push(props.user.id);
        props.onCreateGroup(groupName, members);
    }

    useEffect(() => {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
        };
    }, []);
    
    useEffect(() => {
        setGroupName('');
    }, [props.show]);

    if (!props.show) {
        return null;
    }

    return (
        <div className='modal-background' onClick={props.onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <div className='create-group-title'>Create new group</div>
                <div className='new-group-name-input-area'>
                    <label htmlFor='group-name'>Name:</label>
                    <input 
                        className='input-field'
                        id='group-name'
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </div>
                <NewGroupMembersList
                    friends={props.friends}
                    onMemberToggled={onMemberToggled}
                />
                <button
                    className='new-group-create-button'
                    onClick={onCreateGroup}
                >Create</button>
            </div>
        </div>
    );
}