export type ChatDataWithLastMessageAndAuthorName = {
    id: string,
    name: string,
    profilePhotoLocation: string | null,
    createdOn: Date,
    lastMessageId: string | null,
    lastMessageAuthorId: string | null,
    lastMessageAuthorName: string | null,
    lastMessageText: string | null,
    lastMessageSentOn: Date | null
}