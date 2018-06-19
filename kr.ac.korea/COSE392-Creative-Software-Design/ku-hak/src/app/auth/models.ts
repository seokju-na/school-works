export class UserMetadata {
    uid?: string;
    name: string;
    department: string;
    studentNumber: string;
    isProfessor?: boolean;
    avatarPath?: string;
}


export enum UserNotificationTypes {
    COURSE_NOTICE = 'COURSE_NOTICE',
    COURSE_ASSIGNMENT = 'COURSE_ASSIGNMENT',
}


export class UserNotification {
    user: {
        uid: string;
        name: string;
    };
    createdDatetime: string;
    content: string;
    link: string;
    type: UserNotificationTypes;
    readed: boolean;
}
