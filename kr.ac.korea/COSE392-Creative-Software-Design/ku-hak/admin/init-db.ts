import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import {
    Course,
    CourseAssignment,
    CourseAssignmentStatus,
    CourseAssignmentTypes,
    CourseNotice,
    CoursePersonalAssignment,
    CourseTeamAssignment,
    CourseUser,
    CourseUserAssignment,
    CourseUserPosition,
} from '../src/app/course/models';
import { asyncForEach } from './utils';


const adminAccount = require('./account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
    databaseURL: 'https://ku-hak.firebaseio.com',
});

const store = admin.firestore();

const courses: Course[] = require('./courses.json');
const courseUsers: {
    courseNumber: string;
    professor: {
        uid: string;
        name: string;
    };
    students: {
        uid: string;
        name: string;
    }[];
}[] = require('./course-users.json');
const courseNotices: {
    courseNumber: string;
    title: string;
    writtenDatetime: number;
    content: string;
}[] = require('./course-notices.json');
const courseAssignments: {
    courseNumber: string;
    name: string;
    dueDatetime: number;
    content: string;
    type: CourseAssignmentTypes;
}[] = require('./course-assignments.json');
const courseAssignmentUsers: {
    assignment: number;
    type: CourseAssignmentTypes;
    data: Partial<CoursePersonalAssignment> | Partial<CourseTeamAssignment>;
}[] = require('./course-assignment-users.json');

const collections = {
    courses: store.collection('courses') as any,
    courseUsers: store.collection('courseUsers') as any,
    courseNotices: store.collection('courseNotices') as any,
    courseAssignments: store.collection('courseAssignments') as any,
    courseAssignmentUsers: store.collection('courseAssignmentUsers') as any,
};


async function removeCollection(
    collection: firebase.firestore.CollectionReference,
): Promise<void> {

    console.log(`Removing collection: ${collection.path}`);

    const snapshot = await collection.get();
    const idList: string[] = [];

    snapshot.forEach(doc => idList.push(doc.id));

    await asyncForEach<string, void>(idList, async (id) => {
        const doc = await collection.doc(id);
        await doc.delete();

        console.log(`${id} deleted.`);
    });
}


async function addCollection<T>(
    collection: firebase.firestore.CollectionReference,
    items: T[],
): Promise<void> {

    console.log(`Adding collection: ${collection.path}`);

    await asyncForEach<T, void>(items, async (item: any) => {
        const doc = item.id ? collection.doc(item.id) : collection.doc();

        await doc.set(item);

        console.log(`${doc.path} added`);
    });
}


async function initDB(): Promise<void> {
    // Remove database
    await removeCollection(collections.courses);
    await removeCollection(collections.courseUsers);
    await removeCollection(collections.courseNotices);
    await removeCollection(collections.courseAssignments);
    await removeCollection(collections.courseAssignmentUsers);

    // Add 'courses' collection
    await addCollection<Course>(collections.courses, courses);

    // Add 'courseUsers' collection
    const courseUserItems: CourseUser[] = [];

    courseUsers.forEach((courseUser) => {
        const course = courses.find(c => c.number === courseUser.courseNumber);

        if (!course) {
            throw new Error(`Cannot find course: ${courseUser.courseNumber}`);
        }

        // Add professor
        courseUserItems.push({
            course,
            user: { ...course.professor },
            position: CourseUserPosition.PROFESSOR,
        });

        // Add students
        courseUser.students.forEach((student) => {
            courseUserItems.push({
                course,
                user: { ...student },
                position: CourseUserPosition.STUDENT,
            });
        });
    });

    await addCollection<CourseUser>(collections.courseUsers, courseUserItems);

    // Add 'courseNotices' collection
    const courseNoticeItems: CourseNotice[] = [];

    courseNotices.forEach((notice) => {
        const course = courses.find(c => c.number === notice.courseNumber);

        if (course) {
            courseNoticeItems.push({
                course: { ...course },
                title: notice.title,
                writtenDatetime: notice.writtenDatetime,
                content: notice.content,
            });
        }
    });

    await addCollection<CourseNotice>(collections.courseNotices, courseNoticeItems);

    // Add 'courseAssignments' collection
    const courseAssignmentItems: CourseAssignment[] = [];

    courseAssignments.forEach((assignment) => {
        const course = courses.find(c => c.number === assignment.courseNumber);


        if (course) {
            courseAssignmentItems.push({
                id: admin.firestore().collection('_').doc().id,
                course: { ...course },
                name: assignment.name,
                dueDatetime: assignment.dueDatetime,
                content: assignment.content,
                type: assignment.type,
                createdDatetime: new Date().getTime(),
            } );
        }
    });

    await addCollection<CourseAssignment>(
        collections.courseAssignments,
        courseAssignmentItems,
    );

    // Add 'courseAssignmentUsers' collection
    const courseAssignmentUserItems: CourseUserAssignment[] = [];

    courseAssignmentUsers.forEach((user) => {
        const assignment = courseAssignmentItems[user.assignment];
        const status = assignment.dueDatetime < new Date().getTime()
            ? CourseAssignmentStatus.EXPIRED
            : CourseAssignmentStatus.PENDING;

        switch (user.type) {
            case CourseAssignmentTypes.PERSONAL:
                courseAssignmentUserItems.push({
                    assignment,
                    users: { ...(<CoursePersonalAssignment>user.data).users },
                    files: [],
                    status,
                } as any);
                break;

            case CourseAssignmentTypes.TEAM:
                courseAssignmentUserItems.push({
                    assignment,
                    users: { ...(<CourseTeamAssignment>user.data).users },
                    roles: [],
                    files: [],
                    status,
                });
                break;
        }
    });

    await addCollection<any>(
        collections.courseAssignmentUsers,
        courseAssignmentUserItems,
    );
}


initDB()
    .then(() => {
        console.log('success!');
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
