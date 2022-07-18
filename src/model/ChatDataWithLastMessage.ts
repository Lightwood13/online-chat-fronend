export type ChatDataWithLastMessage = {
    id: string,
    name: string,
    profilePhotoLocation: string | null,
    createdOn: Date,
    lastMessageId: string,
    lastMessageAuthorId: string,
    lastMessageText: string,
    lastMessageSentOn: Date
}