import { MessageData } from "./MessageData";
import { UserData } from "./UserData";

export type ChatDataWithMembersAndMessages = {
    id: string,
    name: string,
    profilePhotoLocation: string | null,
    members: UserData[],
    messages: MessageData[]
}