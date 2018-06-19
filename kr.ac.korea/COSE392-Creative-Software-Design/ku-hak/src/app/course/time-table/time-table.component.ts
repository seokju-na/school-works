import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { CourseService } from '../course.service';
import { Course, courseClassDayDateMap, courseClassTimeNameMap, CourseUser } from '../models';


export interface CourseTimeTableRow {
    no: string;
    name: string;
    location: string;
}


@Component({
    selector: 'hak-course-time-table',
    templateUrl: './time-table.component.html',
    styleUrls: ['./time-table.component.less'],
})
export class CourseTimeTableComponent implements OnInit, OnDestroy {
    displayedColumns = ['no', 'name', 'location'];
    dataSource = new MatTableDataSource([]);
    loading = true;

    private myCoursesSubscription: Subscription;

    constructor(
        private courseService: CourseService,
    ) {
    }

    ngOnInit(): void {
        this.myCoursesSubscription = this.courseService.myCourses().subscribe((data) => {
            this.dataSource.data = this.makeTimeTable(data);
            this.loading = false;
        });
    }

    ngOnDestroy(): void {
        if (this.myCoursesSubscription) {
            this.myCoursesSubscription.unsubscribe();
        }
    }

    private makeTimeTable(courses: CourseUser[]): CourseTimeTableRow[] {
        const todayDayOfWeek = 1;
        const todayCourses: Course[] = [];
        const dataSource: CourseTimeTableRow[] = [];

        courses.forEach((courseUser) => {
            const course = courseUser.course;
            const classIndex = course.classes.findIndex(courseClass =>
                courseClassDayDateMap[courseClass.dayOfTheWeek] === todayDayOfWeek);

            if (classIndex !== -1) {
                const targetClass = { ...course.classes[classIndex] };

                targetClass.times.forEach((time) => {
                    todayCourses.push({
                        ...course,
                        classes: [{
                            ...targetClass,
                            times: [time],
                        }],
                    });
                });
            }
        });

        todayCourses.sort((courseA, courseB) => {
            const courseATime = courseClassTimeNameMap[courseA.classes[0].times[0]];
            const courseBTime = courseClassTimeNameMap[courseB.classes[0].times[0]];

            return courseATime - courseBTime;
        });

        for (let i = 1; i <= 10; i++) {
            const no = i.toString();
            let name = '';
            let location = '';

            const target = todayCourses.find(course =>
                courseClassTimeNameMap[course.classes[0].times[0]] === i);

            if (target) {
                name = target.name;
                location = target.location;
            }

            dataSource.push({ no, name, location });
        }

        return dataSource;
    }
}
