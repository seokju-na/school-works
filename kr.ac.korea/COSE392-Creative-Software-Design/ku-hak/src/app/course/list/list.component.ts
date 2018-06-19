import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CourseService } from '../course.service';
import { CourseUser } from '../models';


@Component({
    selector: 'hak-course-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less'],
})
export class CourseListComponent implements OnInit {
    myCourses: Observable<CourseUser[]>;
    loading = true;

    constructor(private courseService: CourseService) {
    }

    ngOnInit(): void {
        this.myCourses = this.courseService.myCourses().pipe(
            tap(() => this.loading = false),
            map(courses => courses.sort((a, b) => {
                if (a.course.name > b.course.name) {
                    return 1;
                } else if (a.course.name < b.course.name) {
                    return -1;
                }
                return 0;
            })),
        );
    }

}
