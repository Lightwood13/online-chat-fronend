import { MemberData } from "./MemberData";

export type ChatData = {
    id: string,
    name: string,
    profilePhotoLocation: string | null,
    createdOn: Date,
    members: MemberData[]
}