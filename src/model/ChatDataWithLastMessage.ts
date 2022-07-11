export type ChatDataWithLastMessage = {
    id: string,
    name: string,
    profilePhotoLocation: string | null,
    lastMessageId: string,
    lastMessageAuthorId: string,
    lastMessageText: string,
    lastMessageSentOn: string
}