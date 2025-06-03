export interface Contact {
    id: string;
    contact: number;
    name: string;
    email: string;
    picture: string;
    createdAt: Date;
}

export interface Group {
    name: string;
    groupUsers: number[];
    image: string;
}

type FileType = "AUDIO" | undefined
export interface Message {
    message?: string;
    conversationId: number;
    messageId: string;
    userId: number;
    fileType?: FileType;
    fileUrl?: string;
    sentAt: Date;
}

export interface MessageRequest {
    message?: string;
    conversationId?: number;
    contactId: number;
    sentAt: string;
    fileType?: FileType;
    fileUrl?: string;
}

export interface MessageModification {
    messageId: string;
    conversationId: number;
    message?: string;
    type: "EDIT" | "DELETE";
}
export interface Chat {
    id: number;
    contact: Contact;
    isGroup: boolean;
    group: Group;    
    image?:string;
    unseenMessages: number;
}

export interface ContactSearch {
    userId: number;
    name: string;
    email: string;
}