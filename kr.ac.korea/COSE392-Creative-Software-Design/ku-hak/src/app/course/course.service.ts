import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Course, CourseNotice, CourseUser, CourseUserAssignment } from './models';


@Injectable()
export class CourseService {
    readonly courseCollection: AngularFirestoreCollection<Course>;

    constructor(
        private fireStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
    ) {

        this.courseCollection = this.fireStore.collection<Course>('courses');
    }

    courses(): Observable<Course[]> {
        return this.courseCollection.valueChanges();
    }

    myCourses(): Observable<CourseUser[]> {
        const userId = this.fireAuth.auth.currentUser.uid;

        return this.fireStore
            .collection<CourseUser>('courseUsers', ref =>
                ref.where('user.uid', '==', userId),
            )
            .valueChanges();
    }

    myNotices(limit?: number): Observable<CourseNotice[]> {
        return this.fireStore
            .collection<CourseNotice>('courseNotices', ref =>
                ref.orderBy('writtenDatetime'),
            )
            .valueChanges()
            .pipe(
                switchMap(notices =>
                    this.myCourses().pipe(
                        take(1),
                        map((myCourses) => {
                            const myCourseNumberList = myCourses.map(course =>
                                course.course.number);

                            const filtered = notices.filter(notice =>
                                myCourseNumberList.includes(notice.course.number));

                            filtered.sort((a, b) => b.writtenDatetime - a.writtenDatetime);

                            if (limit) {
                                return filtered.slice(0, limit);
                            }

                            return filtered;
                        }),
                    ),
                ),
            );
    }

    courseNotices(courseNumber: string): Observable<CourseNotice[]> {
        return this.fireStore
            .collection<CourseNotice>('courseNotices', ref =>
                ref
                    .where('course.number', '==', courseNumber)
                    .orderBy('writtenDatetime'),
            )
            .valueChanges();
    }

    myAssignments(limit?: number): Observable<CourseUserAssignment[]> {
        const userId = this.fireAuth.auth.currentUser.uid;

        return this.fireStore
            .collection<CourseUserAssignment>('courseAssignmentUsers', (ref) => {
                const query = ref
                    .where(`users.${userId}.uid`, '==', userId);

                if (limit) {
                    return query.limit(limit);
                }

                return query;
            })
            .valueChanges();
    }

    courseAssignments(courseNumber: string): Observable<CourseUserAssignment[]> {
        return this.fireStore
            .collection<CourseUserAssignment>('courseAssignmentUsers', ref =>
                ref
                    .where('assignment.course.number', '==', courseNumber)
                    .orderBy('assignment.createdDatetime'),
            )
            .valueChanges();
    }
}
