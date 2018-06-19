import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseService } from '../course.service';
import {
    courseClassDayNameMap,
    courseClassTimeNameMap,
    CourseNotice,
    CourseUser,
    CourseUserAssignment,
} from '../models';


function getLast(items: any[]): any {
    return items[items.length - 1];
}


@Component({
    selector: 'hak-course-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class CourseDetailComponent implements OnInit {
    readonly course: CourseUser;
    classChips: string[] = [];

    notices: Observable<CourseNotice[]>;
    noticesLoading = true;
    noticesEmpty = false;

    assignments: Observable<CourseUserAssignment[]>;
    assignmentsLoading = true;
    assignmentsEmpty = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private courseService: CourseService,
    ) {

        this.course = this.activatedRoute.snapshot.data.course;
    }

    ngOnInit(): void {
        this.makeClassChips();

        this.notices = this.courseService
            .courseNotices(this.course.course.number)
            .pipe(tap((notices) => {
                this.noticesLoading = false;
                this.noticesEmpty = notices.length === 0;
            }));

        this.assignments = this.courseService
            .courseAssignments(this.course.course.number)
            .pipe(tap((assignments) => {
                this.assignmentsLoading = false;
                this.assignmentsEmpty = assignments.length === 0;
            }));
    }

    private makeClassChips(): void {
        this.classChips = this.course.course.classes.map((courseClass) => {
            const day = courseClassDayNameMap[courseClass.dayOfTheWeek];
            const times = courseClass.times;

            if (times.length === 1) {
                return `${day} ${courseClassTimeNameMap[times[0]]}`;
            }

            const firstToLast = [times[0], getLast(times)].map(value =>
                courseClassTimeNameMap[value]);

            return `${day} ${firstToLast.join('~')}`;
        });
    }
}
