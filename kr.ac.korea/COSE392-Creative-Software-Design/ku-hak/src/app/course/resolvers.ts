import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CourseUser, CourseUserAssignment } from './models';


@Injectable()
export class CourseAssignmentResolver implements Resolve<CourseUserAssignment> {
    constructor(
        private fireStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<CourseUserAssignment> {
        const { id } = route.params;
        const user = this.fireAuth.auth.currentUser;

        if (!id || !user) {
            return of(null);
        }

        return this.fireStore
            .collection<CourseUserAssignment>('courseAssignmentUsers', ref =>
                ref
                    .where('assignment.id', '==', id)
                    .where(`users.${user.uid}.uid`, '==', user.uid),
            )
            .snapshotChanges()
            .pipe(
                take(1),
                map(actions => actions.map((action) => {
                    const data = action.payload.doc.data() as CourseUserAssignment;
                    const docId = action.payload.doc.id;

                    return { id: docId, ...data };
                })),
                map(values => values ? values[0] : null),
            );
    }
}


@Injectable()
export class CourseUserResolver implements Resolve<CourseUser> {
    constructor(
        private fireStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<CourseUser> {
        const { courseNumber } = route.params;
        const user = this.fireAuth.auth.currentUser;

        if (!courseNumber || !user) {
            return of(null);
        }

        return this.fireStore
            .collection<CourseUser>('courseUsers', ref =>
                ref
                    .where('course.number', '==', courseNumber)
                    .where('user.uid', '==', user.uid),
            )
            .snapshotChanges()
            .pipe(
                take(1),
                map(actions => actions.map((action) => {
                    const data = action.payload.doc.data() as CourseUser;
                    const docId = action.payload.doc.id;

                    return { id: docId, ...data };
                })),
                map(values => values ? values[0] : null),
            );
    }
}


export const COURSE_RESOLVERS = [
    CourseAssignmentResolver,
    CourseUserResolver,
];
