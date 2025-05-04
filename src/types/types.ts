export interface Contact {
    id: string;
    contact: number;
    name: string;
    email: string;
    createdAt: Date;
}

export interface Group {
    name: string;
    groupUsers: number[];
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
    content?: string;
    conversationId?: number;
    contactId: number;
    sentAt: Date;
    fileType?: FileType;
    fileUrl?: string;
}

export interface Chat {
    id: number;
    contact: Contact;
    isGroup: boolean;
    group: Group;
    image?: string;
}

export interface ContactSearch {
    userId: number;
    name: string;
    email: string;
}