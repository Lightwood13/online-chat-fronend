export type ChatDataWithLastMessageAndAuthorName = {
    id: string,
    name: string,
    profilePhotoLocation: string | null,
    lastMessageId: string,
    lastMessageAuthorId: string,
    lastMessageAuthorName: string,
    lastMessageText: string,
    lastMessageSentOn: Date
}