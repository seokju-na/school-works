import { FileRef } from '../core/models';


export enum CourseClassTime {
    FIRST = 'FIRST',
    SECOND = 'SECOND',
    THIRD = 'THIRD',
    FOURTH = 'FOURTH',
    FIFTH = 'FIFTH',
    SIX = 'SIX',
    SEVEN = 'SEVEN',
    EIGHT = 'EIGHT',
    NINE = 'NINE',
    TEN = 'TEN',
}


export const courseClassTimeNameMap = {
    [CourseClassTime.FIRST]: 1,
    [CourseClassTime.SECOND]: 2,
    [CourseClassTime.THIRD]: 3,
    [CourseClassTime.FOURTH]: 4,
    [CourseClassTime.FIFTH]: 5,
    [CourseClassTime.SIX]: 6,
    [CourseClassTime.SEVEN]: 7,
    [CourseClassTime.EIGHT]: 8,
    [CourseClassTime.NINE]: 9,
    [CourseClassTime.TEN]: 10,
};


export enum CourseClassDay {
    MON = 'MON',
    TUE = 'TUE',
    WED = 'WED',
    THU = 'THU',
    FRI = 'FRI',
}


export const courseClassDayNameMap = {
    [CourseClassDay.MON]: '월',
    [CourseClassDay.TUE]: '화',
    [CourseClassDay.WED]: '수',
    [CourseClassDay.THU]: '목',
    [CourseClassDay.FRI]: '금',
};


export const courseClassDayDateMap = {
    [CourseClassDay.MON]: 1,
    [CourseClassDay.TUE]: 2,
    [CourseClassDay.WED]: 3,
    [CourseClassDay.THU]: 4,
    [CourseClassDay.FRI]: 5,
};


export class Course {
    id?: string;
    number: string;
    name: string;
    englishName: string;
    professor: {
        uid: string;
        name: string;
    };
    classes: {
        dayOfTheWeek: CourseClassDay,
        times: CourseClassTime[],
    }[];
    location: string;
}


export enum CourseUserPosition {
    STUDENT = 'STUDENT',
    PROFESSOR = 'PROFESSOR',
}


export class CourseUser {
    id?: string;
    course: Course;
    user: {
        uid: string;
        name: string;
    };
    position: CourseUserPosition;
}


export class CourseAssignment {
    id: string;
    course: Course;
    name: string;
    dueDatetime: number;
    createdDatetime: number;
    content: string;
    type: CourseAssignmentTypes;
}


export enum CourseAssignmentTypes {
    PERSONAL = 'PERSONAL',
    TEAM = 'TEAM',
}


export enum CourseAssignmentStatus {
    PENDING = 'PENDING',
    SUBMITTED = 'SUBMITTED',
    EXPIRED = 'EXPIRED',
}


export const courseAssignmentStatusNameMap = {
    [CourseAssignmentStatus.PENDING]: '제출중',
    [CourseAssignmentStatus.SUBMITTED]: '제출완료',
    [CourseAssignmentStatus.EXPIRED]: '마감됨',
};


export class CoursePersonalAssignment {
    id?: string;
    assignment: CourseAssignment;
    users: {
        [key: string]: {
            uid: string;
            name: string;
        };
    };
    files: FileRef[];
    status: CourseAssignmentStatus;
}


export class CourseTeamAssignment extends CoursePersonalAssignment {
    roles: {
        user: {
            uid: string;
            name: string;
        };
        role: string;
    }[];
}


export type CourseUserAssignment =
    CoursePersonalAssignment
    | CourseTeamAssignment;


export class CourseNotice {
    course: Course;
    title: string;
    writtenDatetime: number;
    content: string;
}


export class CourseChat {
    courseNumber: string;
    room: {
        student: {
            uid: string;
            name: string;
        };
        professor: {
            uid: string;
            name: string;
        };
    };
    sentUser: {
        uid: string;
        name: string;
    };
    message: string;
    createdDatetime: number;
}
