import { Component, Input, OnInit } from '@angular/core';
import { courseClassDayNameMap, courseClassTimeNameMap, CourseUser } from '../models';


function getLast(items: any[]): any {
    return items[items.length - 1];
}


@Component({
    selector: 'hak-course-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.less'],
})
export class CourseItemComponent implements OnInit {
    @Input()
    get course() {
        return this._course;
    }
    set course(course) {
        if (course) {
            this._course = course;
            this.makeClassChips();
        }
    }

    classChips: string[] = [];

    private _course: CourseUser;

    constructor() {
    }

    ngOnInit(): void {
    }

    private makeClassChips(): void {
        this.classChips = this._course.course.classes.map((courseClass) => {
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
