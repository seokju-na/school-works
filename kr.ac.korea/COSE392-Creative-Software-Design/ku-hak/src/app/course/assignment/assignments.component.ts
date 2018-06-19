import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseService } from '../course.service';
import { CourseUserAssignment } from '../models';


@Component({
    selector: 'hak-course-assignments',
    templateUrl: './assignments.component.html',
    styleUrls: ['./assignments.component.less'],
})
export class CourseAssignmentsComponent implements OnInit {
    myAssignments: Observable<CourseUserAssignment[]>;
    loading = true;

    constructor(private courseService: CourseService) {
    }

    ngOnInit(): void {
        this.myAssignments = this.courseService.myAssignments().pipe(
            tap(() => this.loading = false),
        );
    }
}
