import { MessageData } from "./MessageData";
import { UserData } from "./UserData";

export type ChatData = {
    id: string,
    name: string,
    members: UserData[],
    lastMessage: MessageData | null
}