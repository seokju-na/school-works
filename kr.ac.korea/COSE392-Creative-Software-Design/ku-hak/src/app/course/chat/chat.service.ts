import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Course, CourseChat } from '../models';


@Injectable()
export class CourseChatService {
    chats: Observable<CourseChat[]>;

    constructor(
        private fireStore: AngularFirestore,
    ) {
    }

    openRoom(course: Course, studentUid: string): void {
        this.chats = this.fireStore
            .collection<CourseChat>('courseChats', ref =>
                ref
                    .where('courseNumber', '==', course.number)
                    .where('room.student.uid', '==', studentUid)
                    .orderBy('createdDatetime', 'asc'),
            )
            .valueChanges();
    }

    makeChat(
        course: Course,
        student: {
            uid: string;
            name: string;
        },
        sentUser: {
            uid: string;
            name: string;
        },
        message: string,
    ): void {

        message = message.replace('\n', '<br>');

        this.fireStore
            .collection<CourseChat>('courseChats')
            .add({
                courseNumber: course.number,
                room: {
                    student: { ...student },
                    professor: { ...course.professor },
                },
                sentUser: { ...sentUser },
                message,
                createdDatetime: new Date().getTime(),
            });
    }
}
