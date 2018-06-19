import * as admin from 'firebase-admin';
import { UserNotificationTypes } from '../src/app/auth/models';
import { Course } from '../src/app/course/models';
import { asyncForEach } from './utils';


const adminAccount = require('./account-key.json');


admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
});


const store = admin.firestore();
const messaging = admin.messaging();

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


const collections = {
    fcmTokens: store.collection('fcmTokens'),
    notifications: store.collection('notifications'),
};



async function getCourseUserFcmTokens(studentUidList: string[]): Promise<string[]> {
    const fcmTokens = [];

    await asyncForEach<string, void>(studentUidList, async (uid) => {
        const token = await collections.fcmTokens.doc(uid).get();

        if (token) {
            fcmTokens.push(token.data().token as string);
        }
    });

    return fcmTokens;
}


async function sendCourseNoticeNotification(
    notice: {
        courseNumber: string;
        title: string;
        writtenDatetime: number;
        content: string;
    },
): Promise<void> {

    const courseUser = courseUsers.find(c => c.courseNumber === notice.courseNumber);
    const course = courses.find(c => c.number === notice.courseNumber);

    if (!courseUser || !course) {
        return;
    }

    const students = courseUser.students;
    const studentUidList = courseUser.students.map(student => student.uid);
    const fcmTokens = await getCourseUserFcmTokens(studentUidList);

    console.log(fcmTokens);

    await asyncForEach(students, async (student) => {
        const notification = await collections.notifications.add({
            user: { ...student },
            createdDatetime: new Date().getTime(),
            content: `"${course.name}" 수업에 새로운 공지사항입니다.`,
            link: '/course/notices',
            type: UserNotificationTypes.COURSE_NOTICE,
            readed: false,
        });

        console.log(`Notification created: ${notification.id}`);

        await asyncForEach(fcmTokens, async (token) => {
            const response = await messaging.sendToDevice(token, {
                notification: {
                    title: '새로운 공지사항',
                    body: `"${course.name}" 수업에 새로운 공지사항입니다.`,
                },
            });

            console.log(response);
        });
    });
}


sendCourseNoticeNotification(courseNotices[1])
    .then(() => {
        console.log('success!');
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
